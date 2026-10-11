import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

let schemaReady;

function getTelegramUser(initData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || typeof initData !== 'string' || !initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) return null;
  params.delete('hash');
  const checkString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('\n');
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
  schemaReady ??= (async () => {
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
    await sql`CREATE INDEX IF NOT EXISTS orders_user_timestamp ON orders (telegram_user_id, timestamp DESC)`;
    // Los pedidos creados por la antigua demostración no tienen comprobante de Telegram.
    await sql`UPDATE orders SET status = 'pending' WHERE status = 'paid' AND telegram_payment_charge_id IS NULL`;
  })();
  await schemaReady;
}

export default async function handler(request, response) {
  const user = getTelegramUser(request.headers['x-telegram-init-data']);
  if (!user) return response.status(401).json({ error: 'Inicia la aplicación desde Telegram.' });
  if (!process.env.DATABASE_URL) return response.status(503).json({ error: 'Falta conectar la base de datos Neon en Vercel.' });

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

    if (request.method === 'DELETE') {
      await sql`DELETE FROM orders WHERE telegram_user_id = ${user.id}`;
      return response.status(200).json({ ok: true });
    }

    response.setHeader('Allow', 'GET, DELETE');
    return response.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('Vercel orders API error:', error);
    return response.status(500).json({ error: 'No se pudo acceder al historial de pedidos.' });
  }
}
