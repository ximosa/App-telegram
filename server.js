import crypto from 'node:crypto';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import Database from 'better-sqlite3';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3001);
const databaseFile = path.resolve(process.env.DATABASE_PATH || path.join(root, 'data', 'orders.sqlite'));
fs.mkdirSync(path.dirname(databaseFile), { recursive: true });

const db = new Database(databaseFile);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    stars_paid INTEGER NOT NULL,
    price_eur REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL CHECK (currency = 'XTR'),
    timestamp INTEGER NOT NULL,
    status TEXT NOT NULL,
    telegram_user_id INTEGER NOT NULL,
    telegram_username TEXT,
    invoice_link TEXT
  );
  CREATE INDEX IF NOT EXISTS orders_user_timestamp
    ON orders (telegram_user_id, timestamp DESC);
`);
const orderColumns = db.pragma('table_info(orders)');
if (!orderColumns.some((column) => column.name === 'price_eur')) {
  db.exec('ALTER TABLE orders ADD COLUMN price_eur REAL NOT NULL DEFAULT 0');
}

app.use(express.json({ limit: '32kb' }));

const services = new Map([
  ['seo-audit-express', { name: 'Auditoría SEO y rendimiento', stars: 250, priceEur: 5 }],
  ['monthly-maintenance', { name: 'Mantenimiento web mensual', stars: 750, priceEur: 15 }],
  ['landing-page', { name: 'Landing page a medida', stars: 22500, priceEur: 450 }],
  ['woocommerce-store', { name: 'Tienda online con WooCommerce', stars: 42500, priceEur: 850 }],
]);

function getTelegramUser(initData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return null;
  if (typeof initData !== 'string' || !initData) return null;

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

function requestUser(req) {
  const telegramUser = getTelegramUser(req.get('x-telegram-init-data'));
  if (telegramUser) return telegramUser;
  if (process.env.NODE_ENV === 'production') return null;
  const id = Number(req.get('x-demo-user-id') || req.query.userId || req.body?.telegramUserId);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return { id, username: req.body?.telegramUsername };
}

app.get('/api/orders', (req, res) => {
  const user = requestUser(req);
  if (!user) return res.status(401).json({ error: 'Usuario de Telegram no válido.' });
  const rows = db.prepare(`
    SELECT order_id AS orderId, service_id AS serviceId, service_name AS serviceName,
      stars_paid AS starsPaid, price_eur AS priceEur, currency, timestamp, status,
      telegram_user_id AS telegramUserId, telegram_username AS telegramUsername,
      invoice_link AS invoiceLink
    FROM orders WHERE telegram_user_id = ? ORDER BY timestamp DESC
  `).all(user.id);
  return res.json(rows);
});

app.post('/api/orders', (req, res) => {
  const user = requestUser(req);
  if (!user) return res.status(401).json({ error: 'Usuario de Telegram no válido.' });
  const { orderId, serviceId, timestamp, status, invoiceLink } = req.body || {};
  const service = services.get(serviceId);
  if (typeof orderId !== 'string' || orderId.length > 100 || !service ||
      !Number.isSafeInteger(timestamp) || !['paid', 'cancelled', 'failed', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Datos del pedido no válidos.' });
  }

  db.prepare(`INSERT OR IGNORE INTO orders
    (order_id, service_id, service_name, stars_paid, price_eur, currency, timestamp, status,
     telegram_user_id, telegram_username, invoice_link)
    VALUES (@orderId, @serviceId, @serviceName, @starsPaid, @priceEur, 'XTR', @timestamp, @status,
     @telegramUserId, @telegramUsername, @invoiceLink)`)
    .run({
      orderId, serviceId, serviceName: service.name, starsPaid: service.stars, priceEur: service.priceEur,
      timestamp, status, telegramUserId: user.id,
      telegramUsername: typeof user.username === 'string' ? user.username : null,
      invoiceLink: typeof invoiceLink === 'string' ? invoiceLink : null,
    });
  return res.status(201).json({ ok: true });
});

app.delete('/api/orders', (req, res) => {
  const user = requestUser(req);
  if (!user) return res.status(401).json({ error: 'Usuario de Telegram no válido.' });
  db.prepare('DELETE FROM orders WHERE telegram_user_id = ?').run(user.id);
  return res.json({ ok: true });
});

const dist = path.join(root, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(port, '0.0.0.0', () => {
  console.log(`API and SQLite database ready on port ${port}`);
});
