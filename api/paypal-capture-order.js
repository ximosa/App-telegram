import { ensureOrderSchema, getSql, getTelegramUser, paypalRequest } from '../server/paypal.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método no permitido.' });
  }
  const user = getTelegramUser(request.headers['x-telegram-init-data']);
  if (!user) return response.status(401).json({ error: 'Abre la aplicación desde Telegram para continuar.' });
  const paypalOrderId = request.body?.paypalOrderId;
  if (typeof paypalOrderId !== 'string' || paypalOrderId.length > 100) return response.status(400).json({ error: 'Pedido de PayPal no válido.' });

  try {
    const sql = getSql();
    await ensureOrderSchema(sql);
    const rows = await sql`SELECT order_id AS "orderId", service_id AS "serviceId",
      service_name AS "serviceName", price_eur AS "priceEur", currency, timestamp, status,
      telegram_user_id AS "telegramUserId", telegram_username AS "telegramUsername",
      paypal_order_id AS "paypalOrderId"
      FROM orders WHERE paypal_order_id = ${paypalOrderId} AND telegram_user_id = ${user.id} LIMIT 1`;
    const order = rows[0];
    if (!order) return response.status(404).json({ error: 'No se encontró ese pedido.' });
    if (order.status === 'paid') return response.status(200).json(order);
    if (order.status !== 'pending') return response.status(409).json({ error: 'Este pedido ya no se puede pagar.' });

    const capture = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
      method: 'POST',
      headers: { 'PayPal-Request-Id': `capture-${paypalOrderId}` },
      body: '{}',
    });
    const purchase = capture.purchase_units?.[0];
    const payment = purchase?.payments?.captures?.[0];
    if (capture.status !== 'COMPLETED' || payment?.status !== 'COMPLETED' ||
        purchase?.custom_id !== order.orderId || payment?.amount?.currency_code !== 'EUR' ||
        Number(payment?.amount?.value) !== Number(order.priceEur)) {
      console.error('PayPal capture did not match the pending order:', paypalOrderId);
      return response.status(409).json({ error: 'PayPal no confirmó el importe esperado. El pedido sigue pendiente.' });
    }
    await sql`UPDATE orders SET status = 'paid'
      WHERE order_id = ${order.orderId} AND paypal_order_id = ${paypalOrderId}
        AND telegram_user_id = ${user.id} AND status = 'pending'`;
    return response.status(200).json({ ...order, status: 'paid' });
  } catch (error) {
    console.error('PayPal capture failed:', error);
    return response.status(502).json({ error: error instanceof Error ? error.message : 'No se pudo confirmar el pago con PayPal.' });
  }
}
