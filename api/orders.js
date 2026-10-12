import { ensureOrderSchema, getSql, getTelegramUser } from '../server/paypal.js';

export default async function handler(request, response) {
  const user = getTelegramUser(request.headers['x-telegram-init-data']);
  if (!user) return response.status(401).json({ error: 'Inicia la aplicación desde Telegram.' });

  try {
    const sql = getSql();
    await ensureOrderSchema(sql);
    if (request.method === 'GET') {
      const rows = await sql`SELECT order_id AS "orderId", service_id AS "serviceId",
        service_name AS "serviceName", stars_paid AS "starsPaid", price_eur AS "priceEur",
        currency, timestamp, status, telegram_user_id AS "telegramUserId",
        telegram_username AS "telegramUsername", invoice_link AS "invoiceLink",
        paypal_order_id AS "paypalOrderId"
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
    console.error('Orders API error:', error);
    return response.status(500).json({ error: error instanceof Error ? error.message : 'No se pudo acceder al historial de pedidos.' });
  }
}
