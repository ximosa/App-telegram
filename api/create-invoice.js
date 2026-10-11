import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const services = new Map([
  ['seo-audit-express', { name: 'Auditoría SEO y rendimiento', title: 'Auditoría SEO', description: 'Auditoría inicial de SEO técnico, rendimiento y seguridad.', stars: 250, priceEur: 5 }],
  ['monthly-maintenance', { name: 'Mantenimiento web mensual', title: 'Mantenimiento web', description: 'Servicio mensual de mantenimiento web. Renovación no automática.', stars: 750, priceEur: 15 }],
  ['landing-page', { name: 'Landing page a medida', title: 'Landing page a medida', description: 'Diseño y desarrollo de una landing page profesional.', stars: 22500, priceEur: 450 }],
  ['woocommerce-store', { name: 'Tienda online con WooCommerce', title: 'Tienda WooCommerce', description: 'Diseño y desarrollo de una tienda online con WooCommerce.', stars: 42500, priceEur: 850 }],
]);

function getTelegramUser(initData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || typeof initData !== 'string' || !initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) return null;
  params.delete('hash');
  const checkString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  const expected = crypto.createHmac('sha256', secret).update(checkString).digest();
  const supplied = Buffer.from(hash, 'hex');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
  const authDate = Number(params.get('auth_date'));
  if (!Number.isFinite(authDate) || Math.abs(Date.now() / 1000 - authDate) > 86400) return null;
  try {
    const user = JSON.parse(params.get('user') || 'null');
    return Number.isSafeInteger(user?.id) ? user : null;
  } catch {
    return null;
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método no permitido.' });
  }

  const user = getTelegramUser(request.headers['x-telegram-init-data']);
  if (!user) return response.status(401).json({ error: 'Abre la aplicación desde Telegram para continuar.' });
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return response.status(503).json({ error: 'Falta configurar TELEGRAM_BOT_TOKEN en Vercel.' });
  if (!process.env.DATABASE_URL) return response.status(503).json({ error: 'Falta conectar la base de datos Neon en Vercel.' });

  const service = services.get(request.body?.serviceId);
  if (!service) return response.status(400).json({ error: 'El servicio seleccionado no está disponible para pago.' });

  const orderId = `wg_${crypto.randomBytes(20).toString('hex')}`;
  const timestamp = Date.now();
  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY, service_id TEXT NOT NULL, service_name TEXT NOT NULL,
      stars_paid INTEGER NOT NULL, price_eur NUMERIC NOT NULL, currency TEXT NOT NULL DEFAULT 'XTR',
      timestamp BIGINT NOT NULL, status TEXT NOT NULL, telegram_user_id BIGINT NOT NULL,
      telegram_username TEXT, invoice_link TEXT, invoice_payload TEXT,
      telegram_payment_charge_id TEXT UNIQUE
    )`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_payload TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS telegram_payment_charge_id TEXT`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_invoice_payload_unique ON orders (invoice_payload) WHERE invoice_payload IS NOT NULL`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_charge_id_unique ON orders (telegram_payment_charge_id) WHERE telegram_payment_charge_id IS NOT NULL`;
    await sql`UPDATE orders SET status = 'pending' WHERE status = 'paid' AND telegram_payment_charge_id IS NULL`;
    await sql`INSERT INTO orders
      (order_id, service_id, service_name, stars_paid, price_eur, currency, timestamp, status,
       telegram_user_id, telegram_username, invoice_payload)
      VALUES (${orderId}, ${request.body.serviceId}, ${service.name}, ${service.stars}, ${service.priceEur},
       'XTR', ${timestamp}, 'pending', ${user.id}, ${user.username || null}, ${orderId})`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: service.title,
        description: service.description,
        payload: orderId,
        currency: 'XTR',
        prices: [{ label: service.title, amount: service.stars }],
      }),
    });
    const invoice = await telegramResponse.json();
    if (!telegramResponse.ok || !invoice.ok || typeof invoice.result !== 'string') {
      await sql`UPDATE orders SET status = 'failed' WHERE order_id = ${orderId}`;
      console.error('Telegram createInvoiceLink failed:', invoice.description || telegramResponse.status);
      return response.status(502).json({ error: 'Telegram no pudo crear la factura. Comprueba la configuración del bot.' });
    }

    await sql`UPDATE orders SET invoice_link = ${invoice.result} WHERE order_id = ${orderId}`;
    return response.status(201).json({ orderId, invoiceLink: invoice.result });
  } catch (error) {
    console.error('Create Telegram invoice failed:', error);
    return response.status(500).json({ error: 'No se pudo preparar el pago. Inténtalo de nuevo más tarde.' });
  }
}
