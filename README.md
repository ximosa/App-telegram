# 🚀 Telegram Mini App (TMA) para Agencia Web · Pagos con Telegram Stars (XTR)

[![Astro](https://img.shields.io/badge/Framework-Astro_5.x-BC52EE?style=flat&logo=astro)](https://astro.build)
[![Telegram Stars](https://img.shields.io/badge/Payments-Telegram_Stars_(XTR)-2AABEE?style=flat&logo=telegram)](https://core.telegram.org/bots/payments-stars)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind_CSS_v4-38BDF8?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una **Telegram Mini App (TMA)** completa, rápida y moderna diseñada para agencias de desarrollo web, software y marketing. Permite a los clientes explorar servicios paquetizados (auditorías técnicas, planes de mantenimiento, optimización Core Web Vitals) y contratarlos al instante con **1-Tap Checkout** mediante **Telegram Stars (XTR)**, sin necesidad de registros, contraseñas ni pasarelas externas tradicionales.

---

## 📋 Índice

1. [Características Principales](#-características-principales)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Requisitos Previos](#-requisitos-previos)
4. [Paso 1: Configurar el Bot y la Mini App en @BotFather](#-paso-1-configurar-el-bot-y-la-mini-app-en-botfather)
5. [Paso 2: Instalación y Configuración Local](#-paso-2-instalación-y-configuración-local)
6. [Paso 3: Probar en Local con HTTPS (Ngrok / Cloudflare Tunnel)](#-paso-3-probar-en-local-con-https-ngrok--cloudflare-tunnel)
7. [Paso 4: Despliegue en Producción (Vercel / Cloudflare / Node)](#-paso-4-despliegue-en-producción-vercel--cloudflare--node)
8. [Paso 5: Configurar el Webhook y Manejo de Pagos Stars](#-paso-5-configurar-el-webhook-y-manejo-de-pagos-stars)
9. [Paso 6: Validación de Seguridad (HMAC-SHA256 de initData)](#-paso-6-validación-de-seguridad-hmac-sha256-de-initdata)
10. [Solución de Problemas Frecuentes (FAQ)](#-solución-de-problemas-frecuentes-faq)

---

## ✨ Características Principales

- **Zero-Login**: Detección y extracción transparente del usuario (`ID`, `nombre`, `username`) desde `window.Telegram.WebApp.initDataUnsafe?.user`.
- **Pagos Nativos con Telegram Stars (`XTR`)**: Los usuarios pagan con su saldo de estrellas acumuladas o compradas directamente a través de Apple Pay, Google Play o Fragment.
- **Sin Comisiones Externas Bancarias**: Sin cuentas de Stripe ni intermediarios adicionales para cobrar bienes y servicios digitales en Telegram.
- **Pantalla Completa Automática**: Invocación de `tg.expand()` y adaptación dinámica a los colores del tema del cliente (`dark` / `light`).
- **Haptic Feedback**: Vibración háptica nativa en confirmaciones de compra, errores y toques de interfaz.
- **Mobile-First & Ultra Ligero**: Construido sobre Astro con Tailwind CSS para una carga instantánea dentro del WebView de Telegram.

---

## 🏛 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                 CLIENTE (Telegram Mini App)                 │
│  - Astro Frontend + Telegram WebApp SDK                     │
│  - Extracción de usuario (Zero-Login)                       │
│  - Catálogo de servicios & tg.openInvoice()                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1. POST /api/create-invoice
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 TU BACKEND (Astro SSR / Node)               │
│  - Valida initData con HMAC-SHA256                          │
│  - Llama a Bot API: /createInvoiceLink (currency: XTR)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ 2. Devuelve invoiceLink
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 TELEGRAM NATIVE STARS SHEET                 │
│  - Se abre tg.openInvoice(link)                             │
│  - El usuario confirma el débito de Stars                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ 3. pre_checkout_query & successful_payment
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             WEBHOOK (POST /api/webhook)                     │
│  - answerPreCheckoutQuery(ok: true)                         │
│  - Registra pedido en DB y notifica a agencia por Telegram │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠 Requisitos Previos

- **Node.js** v18.17.0 o superior (recomendado Node 20 LTS o 22 LTS).
- **Cuenta de Telegram** activa.
- Un servidor o plataforma de hosting con soporte **HTTPS obligatorio** (Vercel, Cloudflare Pages, Netlify, Railway, Render o VPS con Nginx y Let's Encrypt). *Telegram bloquea Mini Apps que no utilicen HTTPS.*

---

## 🤖 Paso 1: Configurar el Bot y la Mini App en @BotFather

### 1.1 Crear el Bot
1. Abre Telegram y busca a [@BotFather](https://t.me/BotFather).
2. Envía el comando:
   ```text
   /newbot
   ```
3. Asigna un nombre visible (ej. `Agencia Web Dev`).
4. Asigna un nombre de usuario que termine en `bot` (ej. `mi_agencia_dev_bot`).
5. **Copia el Token HTTP API** que te entrega BotFather (ej. `7123456789:AAHq_xxxxxxxxx`). Guárdalo de forma segura; será tu variable `TELEGRAM_BOT_TOKEN`.

### 1.2 Habilitar Pagos con Telegram Stars
Telegram Stars está habilitado por defecto para todos los bots. Para configuraciones de cobro de estrellas y retiro posterior:
1. En `@BotFather`, envía `/mybots` y selecciona tu bot.
2. Selecciona **Payments**.
3. Verás la opción **Telegram Stars**. No requieres conectar Stripe ni proveedores bancarios externos para operar con Stars.

### 1.3 Crear la Mini App (WebApp)
1. En `@BotFather`, envía el comando:
   ```text
   /newapp
   ```
2. Selecciona el bot que creaste en el paso anterior.
3. Ingresa el título de la Mini App: `Servicios de Agencia`.
4. Ingresa una descripción corta: `Contrata auditorías y mantenimiento web con Telegram Stars`.
5. Sube una imagen de vista previa cuadrada (640x640 px).
6. Sube un GIF animado de demostración (o escribe `/empty` para omitir).
7. **URL de la Mini App**: Introduce la URL pública con HTTPS de tu aplicación (ej. `https://mi-agencia-miniapp.vercel.app` o tu túnel ngrok de desarrollo).
8. Asigna un nombre corto para el enlace directo (ej. `tienda`). Tu app será accesible en `https://t.me/mi_agencia_dev_bot/tienda`.

### 1.4 Configurar el Botón de Menú (Menu Button)
Para que los clientes vean un botón permanente de acceso a la Mini App al chatear con tu bot:
1. En `@BotFather`, ejecuta `/mybots` -> Selecciona tu bot.
2. Pulsa en **Bot Settings** -> **Menu Button** -> **Configure menu button**.
3. Envía la URL HTTPS de tu Mini App.
4. Envía el texto del botón: `Ver Servicios 🚀`.

---

## 💻 Paso 2: Instalación y Configuración Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/telegram-agency-miniapp.git
   cd telegram-agency-miniapp
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno `.env` en la raíz del proyecto:
   ```env
   # Token obtenido de @BotFather
   TELEGRAM_BOT_TOKEN="7123456789:AAHq_xxxxxxxxx"

   # URL pública de tu aplicación (para webhooks y redirecciones)
   APP_URL="https://tu-dominio.vercel.app"

   # ID de chat de Telegram donde la agencia recibirá avisos de nuevas compras
   ADMIN_TELEGRAM_CHAT_ID="123456789"
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Tu aplicación estará corriendo en `http://localhost:3000` (o `http://localhost:4321` si usas Astro puro).

---

## 🌐 Paso 3: Probar en Local con HTTPS (Ngrok / Cloudflare Tunnel)

Telegram requiere **estrictamente HTTPS**. No puedes probar `http://localhost` dentro de la app móvil de Telegram directamente. Utiliza un túnel seguro:

### Opción A: Usando Ngrok
```bash
# En una terminal separada:
npx ngrok http 3000
```
Copia la URL segura que termina en `https://xxxx.ngrok-free.app`.

### Opción B: Usando Cloudflare Tunnels (gratuito sin registro)
```bash
npx untun tunnel --port 3000
```

Actualiza temporalmente la URL de tu Mini App en `@BotFather` (`/myapps` -> Selecciona tu App -> **Edit Web App URL**) con la URL generada por el túnel. ¡Abre tu bot en Telegram y prueba la app en tiempo real!

---

## 🚀 Paso 4: Despliegue en Producción (Vercel / Cloudflare / Node)

Dado que la Mini App necesita endpoints dinámicos (`/api/create-invoice` y `/api/webhook`), configuramos Astro en modo **Server-Side Rendering (SSR)**.

### 4.1 Configuración de Astro (`astro.config.mjs`)
Si despliegas en **Vercel**:
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server', // Habilita API Routes dinámicas
  adapter: vercel(),
  integrations: [tailwind()],
});
```

Si despliegas en **Node.js / Docker**:
```javascript
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

### 4.2 Despliegue en Vercel
```bash
npm install -g vercel
vercel
```
Configura en el panel de Vercel la variable de entorno:
- `TELEGRAM_BOT_TOKEN` = `tu_token_de_bot`
- `APP_URL` = `https://tu-app-en-vercel.app`
- `ADMIN_TELEGRAM_CHAT_ID` = `tu_id_de_telegram`

Una vez desplegado, vuelve a `@BotFather` y actualiza la URL definitiva en `/myapps`.

---

## ⚡ Paso 5: Configurar el Webhook y Manejo de Pagos Stars

### 5.1 Registrar el Webhook con Telegram
Telegram debe notificar a tu servidor cuando un usuario inicia o finaliza un pago de Stars. Ejecuta una petición HTTP para registrar tu endpoint:

```bash
curl -X POST "https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://tu-dominio.vercel.app/api/webhook"}'
```

Telegram responderá:
```json
{"ok": true, "result": true, "description": "Webhook was set"}
```

### 5.2 Implementación del Webhook (`src/pages/api/webhook.ts`)

Crea el archivo para procesar los dos eventos clave de Telegram Stars:

```typescript
// src/pages/api/webhook.ts
import type { APIRoute } from 'astro';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

export const POST: APIRoute = async ({ request }) => {
  try {
    const update = await request.json();

    // 1. EVENTO OBLIGATORIO: pre_checkout_query
    // Telegram consulta si el producto sigue disponible antes de cobrar las Stars.
    if (update.pre_checkout_query) {
      const queryId = update.pre_checkout_query.id;
      
      // Debes responder en menos de 10 segundos
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: queryId,
          ok: true // true para aprobar el cobro; false si no hay stock
        })
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // 2. EVENTO DE PAGO EXITOSO: successful_payment
    // Las Stars ya han sido deducidas de la cuenta del usuario.
    const message = update.message;
    if (message?.successful_payment) {
      const payment = message.successful_payment;
      const payload = JSON.parse(payment.invoice_payload || '{}');
      const userId = message.from.id;
      const userName = message.from.first_name || message.from.username;

      console.log(`✅ Pago recibido: ${payment.total_amount} Stars de ${userName} (${userId})`);
      console.log(`Charge ID: ${payment.telegram_payment_charge_id}`);

      // A) Aquí guardas el pedido en tu Base de Datos (PostgreSQL, Supabase, etc.)

      // B) Notificar al cliente por el bot con un mensaje de bienvenida
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          text: `🎉 ¡Gracias por tu compra, ${userName}!\n\nHemos recibido tu pago de ${payment.total_amount} Stars por el servicio "${payload.serviceId}".\n\nNuestro equipo se pondrá en contacto contigo en breve para coordinar la entrega técnica.`,
          parse_mode: 'HTML'
        })
      });

      // C) Notificar al administrador de la agencia
      if (ADMIN_CHAT_ID) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: `🚨 <b>NUEVA VENTA DE SERVICIO</b>\n\n• Cliente: ${userName} (ID: ${userId})\n• Servicio: ${payload.serviceId}\n• Cobrado: ${payment.total_amount} Stars (XTR)\n• Charge ID: <code>${payment.telegram_payment_charge_id}</code>`,
            parse_mode: 'HTML'
          })
        });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error: any) {
    console.error('Error en webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
```

---

## 🔒 Paso 6: Validación de Seguridad (HMAC-SHA256 de initData)

Para evitar que usuarios malintencionados llamen a tu API simulando ser otros clientes, valida siempre la firma de `tg.initData` en el servidor:

```typescript
// src/utils/telegramAuth.ts
import crypto from 'node:crypto';

export function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  if (!hash) return false;

  // Ordenar alfabéticamente las claves en formato clave=valor\n
  const dataCheckString = Array.from(urlParams.entries())
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join('\n');

  // Clave secreta generada con HMAC-SHA256 usando "WebAppData" como clave
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  
  // Calcular hash resultante
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
}
```

---

## ❓ Solución de Problemas Frecuentes (FAQ)

### 1. `openInvoice` no abre nada o da error "INVOICE_NOT_FOUND"
- **Causa**: La factura no se creó con la moneda `XTR` o se especificó un `provider_token`.
- **Solución**: Para Telegram Stars, el campo `currency` **debe ser exactamente `"XTR"`** y el campo `provider_token` **debe dejarse vacío (`""`)**.

### 2. La Mini App muestra pantalla blanca en móvil
- **Causa**: Error de certificado SSL o contenido no HTTPS (Mixed Content).
- **Solución**: Asegúrate de que todos los assets (imágenes, fuentes, scripts) usen rutas relativas o `https://`.

### 3. El teclado oculta campos o la app se achica
- **Causa**: Falta invocar `tg.expand()` o faltan meta-etiquetas de viewport.
- **Solución**: Llama a `window.Telegram.WebApp.expand()` inmediatamente en el evento `DOMContentLoaded` y usa:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  ```

### 4. ¿Cómo retirar las Telegram Stars acumuladas por la agencia?
1. Las Stars recaudadas por tu bot aparecen en **BotFather** -> `/mybots` -> Tu Bot -> **Balance**.
2. Tras un periodo de retención de seguridad de 21 días, puedes retirar tus Stars hacia **Toncoin (TON)** mediante la plataforma descentralizada [Fragment.com](https://fragment.com) o utilizarlas para pagar anuncios en Telegram Ads.

---

## 📄 Licencia

MIT © Tu Agencia Digital. Código abierto para uso comercial y personal.
