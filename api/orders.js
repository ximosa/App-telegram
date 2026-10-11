import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const services = new Map([
  ['seo-audit-express', { name: 'Auditoría SEO y rendimiento', stars: 250, priceEur: 5 }],
  ['monthly-maintenance', { name: 'Mantenimiento web mensual', stars: 750, priceEur: 15 }],
  ['landing-page', { name: 'Landing page a medida', stars: 22500, priceEur: 450 }],
  ['woocommerce-store', { name: 'Tienda online con WooCommerce', stars: 42500, priceEur: 850 }],
]);

let schemaReady;

function getTelegramUser(initData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || typeof initData !== 'string' || !initData) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) return null;
  params.delete('hash');
  const checkString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
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

async function ensureSchema(sql) {
  schemaReady ??= sql`CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    stars_paid INTEGER NOT NULL,
    price_eur NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'XTR',
    timestamp BIGINT NOT NULL,
    status TEXT NOT NULL,
    telegram_user_id BIGINT NOT NULL,
    telegram_username TEXT,
    invoice_link TEXT
  )`.then(() => sql`CREATE INDEX IF NOT EXISTS orders_user_timestamp
    ON orders (telegram_user_id, timestamp DESC)`);
  await schemaReady;
}

export default async function handler(request, response) {
  const user = getTelegramUser(request.headers['x-telegram-init-data']);
  if (!user) return response.status(401).json({ error: 'Inicia la aplicación desde Telegram.' });

  if (!process.env.DATABASE_URL) {
    return response.status(503).json({ error: 'Falta conectar la base de datos de Vercel.' });
  }

  const sql = neon(process.env.DATABASE_URL);
  try {
    await ensureSchema(sql);

    if (request.method === 'GET') {
      const rows = await sql`SELECT order_id AS "orderId", service_id AS "serviceId",
        service_name AS "serviceName", stars_paid AS "starsPaid", price_eur AS "priceEur",
        currency, timestamp, status, telegram_user_id AS "telegramUserId",
        telegram_username AS "telegramUsername", invoice_link AS "invoiceLink"
        FROM orders WHERE telegram_user_id = ${user.id} ORDER BY timestamp DESC`;
      return response.status(200).json(rows);
    }

    if (request.method === 'POST') {
      const { orderId, serviceId, timestamp, status, invoiceLink } = request.body || {};
      const service = services.get(serviceId);
      if (typeof orderId !== 'string' || orderId.length > 100 || !service ||
          !Number.isSafeInteger(timestamp) || !['paid', 'cancelled', 'failed', 'pending'].includes(status)) {
        return response.status(400).json({ error: 'Datos del pedido no válidos.' });
      }

      await sql`INSERT INTO orders
        (order_id, service_id, service_name, stars_paid, price_eur, currency, timestamp,
         status, telegram_user_id, telegram_username, invoice_link)
        VALUES (${orderId}, ${serviceId}, ${service.name}, ${service.stars}, ${service.priceEur},
         'XTR', ${timestamp}, ${status}, ${user.id}, ${user.username || null}, ${invoiceLink || null})
        ON CONFLICT (order_id) DO NOTHING`;
      return response.status(201).json({ ok: true });
    }

    if (request.method === 'DELETE') {
      await sql`DELETE FROM orders WHERE telegram_user_id = ${user.id}`;
      return response.status(200).json({ ok: true });
    }

    response.setHeader('Allow', 'GET, POST, DELETE');
    return response.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('Vercel orders API error:', error);
    return response.status(500).json({ error: 'No se pudo acceder al historial de pedidos.' });
  }
}
