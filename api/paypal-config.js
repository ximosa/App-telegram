import { getPaypalClientId } from '../server/paypal.js';

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Método no permitido.' });
  }
  const clientId = getPaypalClientId();
  if (!clientId || !process.env.PAYPAL_CLIENT_SECRET?.trim()) return response.status(503).json({ error: 'Faltan las credenciales de PayPal en el servidor.' });
  return response.status(200).json({ clientId, currency: 'EUR' });
}
