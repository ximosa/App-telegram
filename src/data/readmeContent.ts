export const README_MARKDOWN = `# 🚀 Telegram Mini App (TMA) para Agencia Web · Pagos con Telegram Stars (XTR)

Una Telegram Mini App completa diseñada para agencias de desarrollo web. Permite a los clientes explorar servicios paquetizados y comprarlos directamente mediante Telegram Stars sin registros ni contraseñas.

---

## 📋 Índice Rápido
1. Paso 1: Configurar el Bot y la Mini App en @BotFather
2. Paso 2: Instalación y Configuración Local (.env)
3. Paso 3: Probar en Local con HTTPS (Ngrok / Cloudflare)
4. Paso 4: Despliegue en Producción (Vercel / Cloudflare / Node)
5. Paso 5: Configurar el Webhook y Manejo de Pagos Stars
6. Paso 6: Validación de Seguridad (HMAC-SHA256 de initData)

---

## 🤖 Paso 1: Configurar el Bot y la Mini App en @BotFather

1.1 Crear el Bot
- Abre Telegram y busca a @BotFather (https://t.me/BotFather).
- Envía: /newbot
- Asigna un nombre visible (ej. "Agencia Web Dev").
- Asigna un username que termine en bot (ej. "mi_agencia_dev_bot").
- Guarda el TELEGRAM_BOT_TOKEN que te entrega.

1.2 Crear la Mini App (WebApp)
- Envía: /newapp
- Selecciona tu bot.
- Título: "Servicios de Agencia".
- Descripción: "Auditorías web y mantenimiento con Telegram Stars".
- Sube una imagen cuadrada de 640x640px.
- Sube un GIF o escribe /empty para omitir.
- Web App URL: Introduce la URL HTTPS de tu app (ej. https://mi-agencia.vercel.app).
- Short name: "servicios" (Tu link será: https://t.me/mi_agencia_dev_bot/servicios).

1.3 Configurar el Botón de Menú Permanente
- En @BotFather: /mybots -> Tu Bot -> Bot Settings -> Menu Button -> Configure menu button.
- Envía la URL HTTPS y el texto del botón: "Ver Servicios 🚀".

---

## 💻 Paso 2: Variables de Entorno (.env)

Crea el archivo .env:
TELEGRAM_BOT_TOKEN="7123456789:AAHq_xxxxxxxxx"
APP_URL="https://tu-dominio.vercel.app"
ADMIN_TELEGRAM_CHAT_ID="123456789"

---

## 🌐 Paso 3: Probar en Local con HTTPS
Telegram bloquea conexiones HTTP sin SSL. Para probar en tu móvil:
npx ngrok http 3000
(Copia la URL https://xxxx.ngrok-free.app y configúrala en @BotFather con /myapps).

---

## 🚀 Paso 4: Despliegue en Producción (Vercel)
Astro soporta SSR con Vercel o Node.
Configura en tu panel de hosting las variables de entorno TELEGRAM_BOT_TOKEN y APP_URL.

---

## ⚡ Paso 5: Registrar el Webhook de Telegram
Para recibir las confirmaciones de Stars, registra tu webhook:
curl -X POST "https://api.telegram.org/bot<TU_TOKEN>/setWebhook" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://tu-dominio.vercel.app/api/webhook"}'

Eventos que procesa el backend:
1. pre_checkout_query: Responde answerPreCheckoutQuery(ok=true) en <10 seg.
2. message.successful_payment: Contiene total_amount (Stars), telegram_payment_charge_id e invoice_payload. Aquí entregas el servicio y avisas al cliente.

---

## 🔒 Parámetros de Factura con Telegram Stars (XTR):
- currency: "XTR" (¡Obligatorio para Telegram Stars!)
- provider_token: "" (¡Debe dejarse vacío en Telegram Stars!)
- prices: [{ label: "Auditoría SEO", amount: 250 }]`;
