import crypto from 'node:crypto';
import { ensureOrderSchema, getSql, getTelegramUser, PAYPAL_SERVICES, paypalRequest } from '../server/paypal.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método no permitido.' });
  }
  const user = getTelegramUser(request.headers['x-telegram-init-data']);
  if (!user) return response.status(401).json({ error: 'Abre la aplicación desde Telegram para continuar.' });
  const service = PAYPAL_SERVICES.get(request.body?.serviceId);
  if (!service) return response.status(400).json({ error: 'El servicio seleccionado no tiene un precio cerrado.' });

  const orderId = `wg_${crypto.randomBytes(18).toString('hex')}`;
  try {
    const sql = getSql();
    await ensureOrderSchema(sql);
    const paypalOrder = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      headers: { 'PayPal-Request-Id': orderId },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId,
          custom_id: orderId,
          invoice_id: orderId,
          description: service.description,
          amount: { currency_code: 'EUR', value: service.price },
        }],
        application_context: { user_action: 'PAY_NOW', shipping_preference: 'NO_SHIPPING' },
      }),
    });
    if (paypalOrder.status !== 'CREATED' || !paypalOrder.id) throw new Error('PayPal no creó el pedido.');
    await sql`INSERT INTO orders
      (order_id, service_id, service_name, stars_paid, price_eur, currency, timestamp, status,
       telegram_user_id, telegram_username, paypal_order_id)
      VALUES (${orderId}, ${request.body.serviceId}, ${service.name}, 0, ${service.price}, 'EUR',
        ${Date.now()}, 'pending', ${user.id}, ${user.username || null}, ${paypalOrder.id})`;
    return response.status(201).json({ id: paypalOrder.id });
  } catch (error) {
    console.error('PayPal order creation failed:', error);
    return response.status(502).json({ error: error instanceof Error ? error.message : 'No se pudo preparar el pago con PayPal.' });
  }
}
