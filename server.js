import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import ordersHandler from './api/orders.js';
import paypalConfigHandler from './api/paypal-config.js';
import paypalCreateOrderHandler from './api/paypal-create-order.js';
import paypalCaptureOrderHandler from './api/paypal-capture-order.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '32kb' }));
app.all('/api/orders', ordersHandler);
app.all('/api/paypal-config', paypalConfigHandler);
app.all('/api/paypal-create-order', paypalCreateOrderHandler);
app.all('/api/paypal-capture-order', paypalCaptureOrderHandler);

const dist = path.join(root, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_request, response) => response.sendFile(path.join(dist, 'index.html')));
}

app.listen(port, '0.0.0.0', () => console.log(`Webgae API ready on port ${port}`));
