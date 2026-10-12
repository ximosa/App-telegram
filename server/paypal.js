import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export const PAYPAL_SERVICES = new Map([
  ['seo-audit-express', { name: 'Auditoría SEO y rendimiento', description: 'Auditoría inicial de SEO técnico, rendimiento y seguridad.', price: '5.00' }],
  ['monthly-maintenance', { name: 'Mantenimiento web mensual', description: 'Servicio mensual de mantenimiento web. Renovación no automática.', price: '15.00' }],
  ['landing-page', { name: 'Landing page a medida', description: 'Diseño y desarrollo de una landing page profesional.', price: '450.00' }],
  ['woocommerce-store', { name: 'Tienda online con WooCommerce', description: 'Diseño y desarrollo de una tienda online con WooCommerce.', price: '850.00' }],
]);

export function getTelegramUser(initData) {
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
  } catch { return null; }
}

export function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('Falta conectar Neon mediante DATABASE_URL.');
  return neon(process.env.DATABASE_URL);
}

export async function ensureOrderSchema(sql) {
  await sql`CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY, service_id TEXT NOT NULL, service_name TEXT NOT NULL,
    stars_paid INTEGER NOT NULL DEFAULT 0, price_eur NUMERIC NOT NULL, currency TEXT NOT NULL DEFAULT 'EUR',
    timestamp BIGINT NOT NULL, status TEXT NOT NULL, telegram_user_id BIGINT NOT NULL,
    telegram_username TEXT, invoice_link TEXT, invoice_payload TEXT,
    telegram_payment_charge_id TEXT UNIQUE, paypal_order_id TEXT UNIQUE
  )`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paypal_order_id TEXT`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_paypal_order_id_unique ON orders (paypal_order_id) WHERE paypal_order_id IS NOT NULL`;
  await sql`CREATE INDEX IF NOT EXISTS orders_user_timestamp ON orders (telegram_user_id, timestamp DESC)`;
}

function paypalBaseUrl() {
  return process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

export async function paypalRequest(path, options = {}) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET.');
  const authResponse = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const auth = await authResponse.json();
  if (!authResponse.ok || !auth.access_token) throw new Error('PayPal no autorizó las credenciales configuradas.');
  const response = await fetch(`${paypalBaseUrl()}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${auth.access_token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body = await response.json();
  if (!response.ok) {
    console.error('PayPal API error:', body.name || response.status);
    throw new Error('PayPal no pudo procesar el pago. Inténtalo de nuevo.');
  }
  return body;
}
