import { neon } from '@neondatabase/serverless';

async function callTelegram(method, body) {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Telegram ${method} failed: ${result.description || response.status}`);
  return result.result;
}

async function ensureSchema(sql) {
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
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método no permitido.' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!botToken || !webhookSecret || !process.env.DATABASE_URL) {
    return response.status(503).json({ error: 'El webhook de pagos no está configurado.' });
  }
  if (request.headers['x-telegram-bot-api-secret-token'] !== webhookSecret) {
    return response.status(401).json({ error: 'No autorizado.' });
  }

  const sql = neon(process.env.DATABASE_URL);
  try {
    await ensureSchema(sql);
    const update = request.body || {};

    if (update.pre_checkout_query) {
      const query = update.pre_checkout_query;
      const [order] = await sql`SELECT order_id, stars_paid, telegram_user_id, status
        FROM orders WHERE invoice_payload = ${query.invoice_payload} LIMIT 1`;
      const valid = order && order.status === 'pending' && order.stars_paid === query.total_amount &&
        String(order.telegram_user_id) === String(query.from?.id) && query.currency === 'XTR';
      await callTelegram('answerPreCheckoutQuery', {
        pre_checkout_query_id: query.id,
        ok: Boolean(valid),
        ...(!valid ? { error_message: 'No se pudo validar este pedido. Cierra la factura e inténtalo de nuevo.' } : {}),
      });
    }

    const payment = update.message?.successful_payment;
    if (payment) {
      const userId = update.message?.from?.id;
      if (payment.currency !== 'XTR' || !payment.invoice_payload || !payment.telegram_payment_charge_id) {
        console.error('Telegram webhook received an invalid successful_payment payload.');
        return response.status(200).json({ ok: true });
      }

      const [order] = await sql`UPDATE orders
        SET status = 'paid', telegram_payment_charge_id = ${payment.telegram_payment_charge_id}
        WHERE invoice_payload = ${payment.invoice_payload}
          AND telegram_user_id = ${userId}
          AND stars_paid = ${payment.total_amount}
          AND currency = 'XTR'
          AND status = 'pending'
        RETURNING order_id`;
      if (!order) {
        const [alreadyProcessed] = await sql`SELECT order_id FROM orders
          WHERE invoice_payload = ${payment.invoice_payload}
            AND telegram_payment_charge_id = ${payment.telegram_payment_charge_id} LIMIT 1`;
        if (!alreadyProcessed) console.error('Telegram successful_payment did not match a pending order.');
      }
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram payment webhook failed:', error);
    return response.status(500).json({ error: 'No se pudo procesar la notificación.' });
  }
}
