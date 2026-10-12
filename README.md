# Webgae — aplicación de pedidos y pagos

Mini App de Telegram para contratar servicios digitales, pagar con PayPal en euros y consultar el historial de pedidos. La aplicación está construida con React, Vite, TypeScript y Tailwind CSS; Neon almacena los pedidos y Vercel publica la web y las funciones de API.

## Índice

- [Qué incluye](#qué-incluye)
- [Cómo funciona el pago](#cómo-funciona-el-pago)
- [Requisitos](#requisitos)
- [Configuración local](#configuración-local)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Configurar PayPal](#configurar-paypal)
- [Configurar Telegram](#configurar-telegram)
- [Variables de entorno](#variables-de-entorno)
- [Solución de problemas](#solución-de-problemas)

## Qué incluye

- Catálogo de servicios con precio cerrado y flujo de compra con PayPal.
- Historial privado de pedidos, asociado al usuario de Telegram y almacenado en Neon.
- Verificación de `initData` de Telegram en el servidor.
- Confirmación del pago mediante la API de PayPal antes de cambiar el pedido a `paid`.
- Consulta de presupuesto para servicios cuyo precio depende del alcance.

## Cómo funciona el pago

1. El cliente elige un servicio con precio cerrado.
2. El servidor valida la identidad de Telegram, crea un pedido `pending` en Neon y solicita una orden a PayPal.
3. El cliente aprueba el pago en el checkout seguro de PayPal.
4. El servidor captura el pago usando sus credenciales privadas y comprueba el estado, el importe y la moneda.
5. Solo después de esa comprobación el pedido pasa a `paid` y aparece en **Mis pedidos**.

La clave secreta de PayPal nunca se envía al navegador. La integración no depende de Telegram Stars ni de un webhook de pagos de Telegram.

## Requisitos

- Node.js 20 o posterior y npm.
- Un bot de Telegram configurado con una Mini App.
- Una base de datos PostgreSQL de Neon.
- Una aplicación REST de PayPal con credenciales de Sandbox para pruebas y Live para cobros reales.
- Un despliegue con HTTPS para que Telegram pueda abrir la Mini App.

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y completa las variables descritas abajo. Usa primero las credenciales Sandbox de PayPal.

3. Inicia la aplicación:

   ```bash
   npm run dev
   ```

La web se sirve en `http://localhost:3000` y la API local en el puerto `3001`. Para probar el pago desde Telegram, expón el puerto web mediante un túnel HTTPS y configura esa URL como Mini App. La API requiere una conexión real a Neon y `initData` válido de Telegram.

## Despliegue en Vercel

1. Importa el repositorio en Vercel y configura el proyecto como aplicación Vite.
2. Conecta Neon al proyecto o define `DATABASE_URL` con la cadena de conexión PostgreSQL.
3. Añade las variables de entorno de producción indicadas en [Variables de entorno](#variables-de-entorno).
4. Configura la URL de producción de la Mini App en BotFather.
5. Despliega y completa una compra de prueba en Sandbox antes de cambiar PayPal a Live.

Vercel publica los archivos de `api/` como funciones y el directorio `dist/` como frontend estático.

## Configurar PayPal

1. En el [panel de desarrolladores de PayPal](https://developer.paypal.com/), crea una aplicación REST.
2. Copia el **Client ID** y el **Secret** de Sandbox a tu entorno local. Usa compradores de prueba de Sandbox para verificar el checkout.
3. En Vercel, configura `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` con las credenciales Live de la cuenta que recibirá el dinero, y establece `PAYPAL_MODE=live`.
4. No reutilices credenciales Sandbox en producción ni subas secretos al repositorio.

El endpoint `/api/paypal-config` entrega únicamente el Client ID, que PayPal necesita para cargar su SDK público. El Secret solo se utiliza desde el servidor para obtener credenciales OAuth y crear o capturar órdenes mediante PayPal Orders v2.

## Configurar Telegram

1. Crea el bot o selecciona el existente en [@BotFather](https://t.me/BotFather) y guarda su token como `TELEGRAM_BOT_TOKEN`.
2. Configura la URL HTTPS de la aplicación como Mini App del bot.
3. Abre la aplicación desde Telegram. Las compras y el historial requieren `initData` válido; abrir la web directamente no permite crear ni consultar pedidos.

No hace falta configurar un webhook de Telegram para confirmar PayPal. El servidor verifica cada captura directamente con PayPal antes de guardar el estado pagado.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de Neon/PostgreSQL. |
| `TELEGRAM_BOT_TOKEN` | Verifica la identidad incluida en `initData`. |
| `PAYPAL_CLIENT_ID` | Client ID de la aplicación REST de PayPal. Es público para cargar el SDK. |
| `PAYPAL_CLIENT_SECRET` | Secreto de PayPal; solo servidor. |
| `PAYPAL_MODE` | `sandbox` para pruebas; `live` para cobros reales. |

Guarda los secretos en `.env` local o en la configuración de variables de Vercel. No los publiques en GitHub.

## Solución de problemas

- **PayPal no está configurado**: revisa `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` y el entorno Sandbox/Live.
- **No se pudo cargar el historial**: revisa `DATABASE_URL` y abre la app dentro de Telegram.
- **La app pide abrirse desde Telegram**: el servidor necesita validar el `initData` firmado; no acepta el nombre o ID de usuario enviado por el navegador.
- **El pedido queda pendiente**: el pedido solo se marca pagado después de una captura completada por PayPal. Revisa el estado de la orden en el entorno de PayPal que configuraste.

## Scripts

- `npm run dev` — inicia Vite y la API local.
- `npm run build` — genera la aplicación estática en `dist/`.
- `npm run preview` — previsualiza la compilación de Vite.
- `npm run lint` — comprueba los tipos de TypeScript.
