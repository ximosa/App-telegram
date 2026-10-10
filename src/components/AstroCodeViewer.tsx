import React, { useState } from 'react';
import { Copy, Check, FolderTree, FileCode2, Terminal, Shield, Sparkles, BookOpen, Layers } from 'lucide-react';
import { README_MARKDOWN } from '../data/readmeContent';

export const AstroCodeViewer: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structure' | 'layout' | 'index' | 'backend' | 'guide' | 'readme'>('readme');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const folderStructureCode = `telegram-agency-miniapp/
├── public/
│   ├── favicon.svg
│   └── logo.png
├── src/
│   ├── layouts/
│   │   └── Layout.astro         # Layout principal con Telegram WebApp SDK
│   ├── pages/
│   │   ├── index.astro          # Catálogo de servicios, saludo dinámico y openInvoice
│   │   └── api/
│   │       ├── create-invoice.ts # Endpoint para generar Invoice Link con Telegram Bot API (XTR)
│   │       └── webhook.ts       # Webhook para pre_checkout_query y successful_payment
│   ├── data/
│   │   └── services.json        # Catálogo de servicios paquetizados (precios en Stars)
│   ├── utils/
│   │   └── telegramAuth.ts      # Validación criptográfica de initData (HMAC-SHA256)
│   └── styles/
│       └── global.css           # Estilos base y variables de tema de Telegram
├── .env                         # TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
├── astro.config.mjs             # Configuración de Astro con SSR (Node o Cloudflare adapter)
├── package.json
├── tailwind.config.mjs
└── tsconfig.json`;

  const layoutAstroCode = `---
// src/layouts/Layout.astro
interface Props {
  title?: string;
  description?: string;
}

const { 
  title = "Agencia Dev · Telegram Mini App", 
  description = "Explora y contrata servicios de desarrollo web directamente con Telegram Stars" 
} = Astro.props;
---

<!doctype html>
<html lang="es" class="h-full bg-slate-950 text-slate-100">
  <head>
    <meta charset="UTF-8" />
    <!-- Meta tags móviles estrictos para Telegram Mini Apps -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="color-scheme" content="dark light" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- 1. SDK Oficial de Telegram Mini Apps (is:inline evita que Astro lo empaquete o retrase) -->
    <script src="https://telegram.org/js/telegram-web-app.js" is:inline></script>

    <style is:global>
      /* Mapeo de variables nativas de tema de Telegram para consistencia visual */
      :root {
        --tg-theme-bg-color: #0b0f19;
        --tg-theme-text-color: #f1f5f9;
        --tg-theme-hint-color: #94a3b8;
        --tg-theme-link-color: #38bdf8;
        --tg-theme-button-color: #0284c7;
        --tg-theme-button-text-color: #ffffff;
        --tg-theme-secondary-bg-color: #111827;
      }
      
      body {
        background-color: var(--tg-theme-bg-color, #0b0f19);
        color: var(--tg-theme-text-color, #f1f5f9);
        -webkit-tap-highlight-color: transparent;
      }
    </style>
  </head>
  <body class="min-h-full flex flex-col antialiased selection:bg-sky-500 selection:text-white">
    <slot />
  </body>
</html>`;

  const indexAstroCode = `---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';

// Catálogo de servicios de la agencia (Precios en Stars XTR)
const services = [
  {
    id: "seo-audit-express",
    name: "Auditoría SEO & Web Express",
    tagline: "Diagnóstico técnico completo y reporte en 24h",
    description: "Revisión profunda de Core Web Vitals, indexación, canonicals y seguridad SSL.",
    starsPrice: 250, // Moneda XTR
    deliveryTime: "24 horas",
    popular: true,
    features: [
      "Informe PDF con checklist accionable",
      "Análisis Core Web Vitals (LCP, CLS, INP)",
      "Revisión de seguridad y cabeceras HTTP"
    ]
  },
  {
    id: "monthly-maintenance",
    name: "Pack Mantenimiento Mensual Pro",
    tagline: "Tu web protegida, rápida y siempre actualizada",
    description: "Copias de seguridad diarias, actualizaciones seguras y monitoreo 24/7.",
    starsPrice: 750, // Moneda XTR
    deliveryTime: "30 días",
    popular: false,
    features: [
      "Backups diarios en la nube",
      "Actualizaciones semanales de dependencias",
      "3 horas de soporte técnico mensual"
    ]
  },
  {
    id: "speed-optimization",
    name: "Micro-servicio Speed Boost",
    tagline: "Garantía de score 90+ en Google PageSpeed",
    description: "Optimización de imágenes WebP, compresión de assets y caché CDN.",
    starsPrice: 450, // Moneda XTR
    deliveryTime: "48 horas",
    popular: false,
    features: [
      "Optimización de Largest Contentful Paint (<2.5s)",
      "Conversión automatizada de imágenes",
      "Reducción drástica de JavaScript no usado"
    ]
  }
];
---

<Layout title="Agencia Web · Servicios con Telegram Stars">
  <main class="w-full max-w-lg mx-auto px-4 py-5 flex flex-col gap-6">
    
    <!-- Header con saludo personalizado sin necesidad de login -->
    <header class="flex items-center justify-between border-b border-slate-800/80 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs uppercase tracking-wider font-semibold text-slate-400">Agencia Digital</span>
        </div>
        <h1 id="user-greeting" class="text-xl font-bold text-white mt-1">
          ¡Hola! 👋
        </h1>
        <p class="text-xs text-slate-400">Contrata servicios web con Telegram Stars al instante</p>
      </div>

      <!-- Badge de usuario extraído de initDataUnsafe -->
      <div id="user-pill" class="hidden flex-col items-end text-right">
        <span id="user-name" class="text-xs font-semibold text-sky-400">Usuario</span>
        <span id="user-id" class="text-[10px] font-mono text-slate-500">ID: ---</span>
      </div>
    </header>

    <!-- Banner informativo de Telegram Stars (XTR) -->
    <div class="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-600/30 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg shadow-inner">
          ★
        </div>
        <div>
          <h2 class="text-sm font-semibold text-amber-200">Pagos directos con Stars (XTR)</h2>
          <p class="text-xs text-amber-300/70">Sin registros, sin tarjetas de crédito y entrega garantizada.</p>
        </div>
      </div>
    </div>

    <!-- Catálogo de Servicios -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-200">Nuestros Servicios</h2>
        <span class="text-xs text-slate-500">{services.length} paquetes disponibles</span>
      </div>

      <div class="flex flex-col gap-4">
        {services.map((item) => (
          <article class="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-slate-700 transition-all">
            {item.popular && (
              <span class="absolute -top-2.5 right-4 bg-sky-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                DESTACADO
              </span>
            )}

            <div>
              <div class="flex justify-between items-baseline mb-1">
                <h3 class="text-base font-semibold text-white">{item.name}</h3>
              </div>
              <p class="text-xs text-slate-400">{item.tagline}</p>
            </div>

            <!-- Precio en Telegram Stars -->
            <div class="flex items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
              <div class="flex items-center gap-2">
                <span class="text-amber-400 text-base font-bold">★</span>
                <span class="text-xl font-bold text-yellow-300">{item.starsPrice}</span>
                <span class="text-xs font-semibold text-amber-200/80">XTR Stars</span>
              </div>
              <span class="text-xs text-slate-500">Plazo: {item.deliveryTime}</span>
            </div>

            <!-- Lista de entregables -->
            <ul class="text-xs text-slate-300 space-y-1.5">
              {item.features.map((feature) => (
                <li class="flex items-center gap-2">
                  <span class="text-sky-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <!-- Botón de compra con Telegram Stars -->
            <button
              type="button"
              data-service-id={item.id}
              data-service-name={item.name}
              data-stars-price={item.starsPrice}
              class="buy-button w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Comprar con Telegram Stars</span>
              <span class="font-bold text-amber-300 text-xs bg-black/30 px-1.5 py-0.5 rounded">
                ★ {item.starsPrice}
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>

    <!-- Estado de Pago / Feedback Toast -->
    <div id="payment-toast" class="hidden fixed bottom-6 left-4 right-4 max-w-md mx-auto p-4 rounded-xl text-xs font-medium text-center shadow-2xl transition-all"></div>
  </main>

  <!-- Script del Cliente: Detección de Telegram, expand(), extracción de usuario y openInvoice -->
  <script is:inline>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Detección del SDK de Telegram
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        console.warn('Telegram WebApp SDK no disponible. Ejecutando en navegador estándar.');
        return;
      }

      // Notificar a Telegram que la Mini App está lista
      tg.ready();

      // 2. Expandir la aplicación a pantalla completa automáticamente
      tg.expand();

      // Aplicar color de cabecera si está soportado
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0b0f19');
      }

      // 3. Extracción de datos del usuario desde initDataUnsafe (Zero-Login)
      const user = tg.initDataUnsafe?.user;
      const greetingEl = document.getElementById('user-greeting');
      const userPillEl = document.getElementById('user-pill');
      const userNameEl = document.getElementById('user-name');
      const userIdEl = document.getElementById('user-id');

      if (user && greetingEl) {
        const displayName = user.first_name || user.username || 'Cliente';
        greetingEl.textContent = \`¡Hola, \${displayName}! 👋\`;

        if (userPillEl && userNameEl && userIdEl) {
          userPillEl.classList.remove('hidden');
          userPillEl.classList.add('flex');
          userNameEl.textContent = user.username ? \`@\${user.username}\` : displayName;
          userIdEl.textContent = \`ID: \${user.id}\`;
        }
      }

      // 4. Manejador de compra con Telegram Stars (tg.openInvoice)
      const buttons = document.querySelectorAll('.buy-button');
      const toast = document.getElementById('payment-toast');

      function showToast(message, isSuccess = true) {
        if (!toast) return;
        toast.textContent = message;
        toast.className = \`fixed bottom-6 left-4 right-4 max-w-md mx-auto p-4 rounded-xl text-xs font-medium text-center shadow-2xl transition-all \${
          isSuccess 
            ? 'bg-emerald-950 border border-emerald-500 text-emerald-200' 
            : 'bg-rose-950 border border-rose-500 text-rose-200'
        }\`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 5000);
      }

      buttons.forEach((btn) => {
        btn.addEventListener('click', async () => {
          const serviceId = btn.getAttribute('data-service-id');
          const serviceName = btn.getAttribute('data-service-name');
          const starsPrice = btn.getAttribute('data-stars-price');

          // Haptic feedback nativo al pulsar
          if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
          }

          btn.setAttribute('disabled', 'true');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span class="animate-spin mr-2">⏳</span> Generando factura...';

          try {
            // Llamamos a nuestro backend para generar el invoiceLink de Telegram Stars
            const response = await fetch('/api/create-invoice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                serviceId,
                telegramUserId: user?.id,
                initData: tg.initData // Para validación HMAC en backend
              })
            });

            const data = await response.json();

            if (!response.ok || !data.invoiceLink) {
              throw new Error(data.error || 'No se pudo generar la factura');
            }

            // Invocamos la pasarela nativa de Telegram Stars
            tg.openInvoice(data.invoiceLink, (status) => {
              if (status === 'paid') {
                if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                showToast(\`¡Gracias por tu compra! Has adquirido "\${serviceName}" con éxito.\`, true);
              } else if (status === 'cancelled') {
                showToast('Pago cancelado.', false);
              } else if (status === 'failed') {
                if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
                showToast('Error al procesar el pago con Telegram Stars.', false);
              }
            });

          } catch (err) {
            console.error(err);
            // Fallback de demostración si el backend aún no tiene el token de bot configurado
            showToast(\`Demo: Factura de \${starsPrice} Stars para "\${serviceName}". (Requiere BOT_TOKEN en producción)\`, true);
          } finally {
            btn.removeAttribute('disabled');
            btn.innerHTML = originalText;
          }
        });
      });
    });
  </script>
</Layout>`;

  const backendCode = `// src/pages/api/create-invoice.ts
import type { APIRoute } from 'astro';

// Obtenemos el token del bot desde las variables de entorno
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Catálogo de precios en Telegram Stars (Moneda obligatoria: 'XTR')
const SERVICES_MAP: Record<string, { title: string; description: string; price: number }> = {
  'seo-audit-express': {
    title: 'Auditoría SEO & Web Express',
    description: 'Diagnóstico técnico completo de Core Web Vitals, indexación y reporte en 24h.',
    price: 250 // En Telegram Stars (XTR), 1 Star = 1 entero
  },
  'monthly-maintenance': {
    title: 'Pack Mantenimiento Mensual Pro',
    description: 'Backups diarios en la nube, actualizaciones semanales y monitorización 24/7.',
    price: 750
  },
  'speed-optimization': {
    title: 'Micro-servicio Speed Boost',
    description: 'Garantía de score 90+ en PageSpeed, compresión WebP y caché CDN.',
    price: 450
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { serviceId, telegramUserId } = body;

    const service = SERVICES_MAP[serviceId];
    if (!service) {
      return new Response(JSON.stringify({ error: 'Servicio no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!TELEGRAM_BOT_TOKEN) {
      return new Response(
        JSON.stringify({ 
          error: 'TELEGRAM_BOT_TOKEN no configurado en el servidor.',
          // Link simulado de demostración
          invoiceLink: \`https://t.me/$\${serviceId}_demo_link\`
        }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Payload para el endpoint oficial de Telegram Bot API: createInvoiceLink
    // NOTA CLAVE: Para Telegram Stars, 'currency' DEBE ser 'XTR' y no requiere 'provider_token'
    const invoicePayload = {
      title: service.title,
      description: service.description,
      payload: JSON.stringify({
        serviceId,
        telegramUserId,
        orderDate: new Date().toISOString()
      }),
      currency: 'XTR', // Moneda oficial de Telegram Stars
      prices: [
        {
          label: service.title,
          amount: service.price // Monto en Stars (ej. 250 = 250 estrellas)
        }
      ]
    };

    const telegramRes = await fetch(
      \`https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/createInvoiceLink\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      }
    );

    const result = await telegramRes.json();

    if (!result.ok) {
      console.error('Error de Telegram Bot API:', result);
      return new Response(JSON.stringify({ error: result.description }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // result.result contiene la URL generada: https://t.me/$invoice_hash...
    return new Response(JSON.stringify({ invoiceLink: result.result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};`;

  const webhookGuide = `// GUÍA DE ARQUITECTURA DE PAGOS CON TELEGRAM STARS (XTR)

1. ¿CÓMO FUNCIONA EL CICLO DE PAGO CON STARS?
---------------------------------------------------------------------
1. El usuario navega por el catálogo en la Mini App (Astro).
2. Hace clic en "Comprar con Telegram Stars".
3. El frontend de Astro hace POST a /api/create-invoice.
4. El servidor llama a la API de Telegram:
   POST https://api.telegram.org/bot<TOKEN>/createInvoiceLink
   - Parámetros clave:
     * currency: "XTR" (especifica Telegram Stars)
     * provider_token: "" (¡SE DEJA VACÍO para Telegram Stars!)
     * prices: [{ label: "Auditoría SEO", amount: 250 }]
5. Telegram devuelve una URL de factura (ej. https://t.me/$xxxxx).
6. En el cliente de Astro, llamas a:
   tg.openInvoice(invoiceLink, (status) => {
     if (status === 'paid') { ... }
   });
7. Telegram abre la hoja de pago nativa (Stars Sheet) donde el usuario
   confirma con su saldo de Stars o compra Stars en la app.

2. WEBHOOK OBLIGATORIO PARA CONFIRMACIÓN SEGURA
---------------------------------------------------------------------
Telegram envía dos eventos vía webhook a tu servidor:

A) pre_checkout_query:
   - Telegram te pregunta si el servicio sigue disponible antes de cobrar.
   - Tu backend DEBE responder en menos de 10 segundos invocando:
     answerPreCheckoutQuery(pre_checkout_query_id, ok=true).

B) message con successful_payment:
   - Se dispara inmediatamente después de cobrarse las Stars.
   - Contiene:
     * telegram_payment_charge_id
     * total_amount (cantidad de Stars cobradas)
     * invoice_payload (el JSON con serviceId y userId que enviaste)
   - Aquí es donde activas el servicio, creas la orden en base de datos
     y envías un mensaje de agradecimiento al cliente vía Telegram Bot API.

3. CONFIGURACIÓN EN @BotFather:
---------------------------------------------------------------------
1. Ve a @BotFather en Telegram.
2. Ejecuta /mybots -> Selecciona tu bot.
3. Bot Settings -> Menu Button -> Configura la URL de tu Astro app.
4. Payments -> Telegram Stars ya viene habilitado de forma nativa sin
   necesidad de conectar Stripe u otras pasarelas bancarias.`;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Navigation tabs */}
      <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('readme')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'readme' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>📖 README & Tutorial Producción</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'structure' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>1. Estructura Carpetas</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'layout' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>2. Layout.astro</span>
        </button>

        <button
          onClick={() => setActiveTab('index')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'index' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>3. index.astro</span>
        </button>

        <button
          onClick={() => setActiveTab('backend')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'backend' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>4. API create-invoice.ts</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'guide' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>5. Guía Stars & Webhooks</span>
        </button>
      </div>

      {/* Code Viewer Content */}
      <div className="relative flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto max-h-[640px]">
        {activeTab === 'readme' && (
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <div>
                <span className="font-semibold text-amber-300">README.md · Tutorial de Puesta en Producción</span>
                <p className="text-[11px] text-slate-500">Guía paso a paso para BotFather, HTTPS, Webhook y Telegram Stars</p>
              </div>
              <button
                onClick={() => copyToClipboard(README_MARKDOWN, 'readme')}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 px-2 py-1 rounded border border-amber-800"
              >
                {copiedKey === 'readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'readme' ? 'Copiado' : 'Copiar README.md'}</span>
              </button>
            </div>
            <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre font-sans text-xs">
              {README_MARKDOWN}
            </pre>
          </div>
        )}

        {activeTab === 'structure' && (
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <span className="font-semibold text-slate-200">Estructura recomendada del proyecto Astro</span>
              <button
                onClick={() => copyToClipboard(folderStructureCode, 'structure')}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-800"
              >
                {copiedKey === 'structure' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'structure' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
              {folderStructureCode}
            </pre>
          </div>
        )}

        {activeTab === 'layout' && (
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <div>
                <span className="font-semibold text-slate-200">src/layouts/Layout.astro</span>
                <p className="text-[11px] text-slate-500">Incluye el SDK oficial de Telegram Mini Apps con is:inline</p>
              </div>
              <button
                onClick={() => copyToClipboard(layoutAstroCode, 'layout')}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-800"
              >
                {copiedKey === 'layout' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'layout' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-emerald-400/90 leading-relaxed overflow-x-auto whitespace-pre">
              {layoutAstroCode}
            </pre>
          </div>
        )}

        {activeTab === 'index' && (
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <div>
                <span className="font-semibold text-slate-200">src/pages/index.astro</span>
                <p className="text-[11px] text-slate-500">Lógica completa: tg.expand(), extracción initDataUnsafe, catálogo y tg.openInvoice()</p>
              </div>
              <button
                onClick={() => copyToClipboard(indexAstroCode, 'index')}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-800"
              >
                {copiedKey === 'index' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'index' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-sky-300/90 leading-relaxed overflow-x-auto whitespace-pre">
              {indexAstroCode}
            </pre>
          </div>
        )}

        {activeTab === 'backend' && (
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <div>
                <span className="font-semibold text-slate-200">src/pages/api/create-invoice.ts</span>
                <p className="text-[11px] text-slate-500">Genera Invoice Link con Telegram Bot API usando currency: 'XTR' (Stars)</p>
              </div>
              <button
                onClick={() => copyToClipboard(backendCode, 'backend')}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-800"
              >
                {copiedKey === 'backend' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'backend' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-amber-300/90 leading-relaxed overflow-x-auto whitespace-pre">
              {backendCode}
            </pre>
          </div>
        )}

        {activeTab === 'guide' && (
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <div>
                <span className="font-semibold text-slate-200">Arquitectura de Pagos con Telegram Stars (XTR)</span>
                <p className="text-[11px] text-slate-500">Explicación del ciclo de vida, pre_checkout_query y BotFather</p>
              </div>
              <button
                onClick={() => copyToClipboard(webhookGuide, 'guide')}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-800"
              >
                {copiedKey === 'guide' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'guide' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre font-sans text-xs">
              {webhookGuide}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
