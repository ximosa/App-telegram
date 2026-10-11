# Ã°Å¸Å¡â‚¬ Telegram Mini App (TMA) para Agencia Web Ã‚Â· Pagos con Telegram Stars (XTR)

[![Astro](https://img.shields.io/badge/Framework-Astro_5.x-BC52EE?style=flat&logo=astro)](https://astro.build)
[![Telegram Stars](https://img.shields.io/badge/Payments-Telegram_Stars_(XTR)-2AABEE?style=flat&logo=telegram)](https://core.telegram.org/bots/payments-stars)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind_CSS_v4-38BDF8?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una **Telegram Mini App (TMA)** completa, rÃƒÂ¡pida y moderna diseÃƒÂ±ada para agencias de desarrollo web, software y marketing. Permite a los clientes explorar servicios paquetizados (auditorÃƒÂ­as tÃƒÂ©cnicas, planes de mantenimiento, optimizaciÃƒÂ³n Core Web Vitals) y contratarlos al instante con **1-Tap Checkout** mediante **Telegram Stars (XTR)**, sin necesidad de registros, contraseÃƒÂ±as ni pasarelas externas tradicionales.

---

## Ã°Å¸â€œâ€¹ ÃƒÂndice

1. [CaracterÃƒÂ­sticas Principales](#-caracterÃƒÂ­sticas-principales)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Requisitos Previos](#-requisitos-previos)
4. [Paso 1: Configurar el Bot y la Mini App en @BotFather](#-paso-1-configurar-el-bot-y-la-mini-app-en-botfather)
5. [Paso 2: InstalaciÃƒÂ³n y ConfiguraciÃƒÂ³n Local](#-paso-2-instalaciÃƒÂ³n-y-configuraciÃƒÂ³n-local)
6. [Paso 3: Probar en Local con HTTPS (Ngrok / Cloudflare Tunnel)](#-paso-3-probar-en-local-con-https-ngrok--cloudflare-tunnel)
7. [Paso 4: Despliegue en ProducciÃƒÂ³n (Vercel / Cloudflare / Node)](#-paso-4-despliegue-en-producciÃƒÂ³n-vercel--cloudflare--node)
8. [Paso 5: Configurar el Webhook y Manejo de Pagos Stars](#-paso-5-configurar-el-webhook-y-manejo-de-pagos-stars)
9. [Paso 6: ValidaciÃƒÂ³n de Seguridad (HMAC-SHA256 de initData)](#-paso-6-validaciÃƒÂ³n-de-seguridad-hmac-sha256-de-initdata)
10. [SoluciÃƒÂ³n de Problemas Frecuentes (FAQ)](#-soluciÃƒÂ³n-de-problemas-frecuentes-faq)

---

## Ã¢Å“Â¨ CaracterÃƒÂ­sticas Principales

- **Zero-Login**: DetecciÃƒÂ³n y extracciÃƒÂ³n transparente del usuario (`ID`, `nombre`, `username`) desde `window.Telegram.WebApp.initDataUnsafe?.user`.
- **Pagos Nativos con Telegram Stars (`XTR`)**: Los usuarios pagan con su saldo de estrellas acumuladas o compradas directamente a travÃƒÂ©s de Apple Pay, Google Play o Fragment.
- **Sin Comisiones Externas Bancarias**: Sin cuentas de Stripe ni intermediarios adicionales para cobrar bienes y servicios digitales en Telegram.
- **Pantalla Completa AutomÃƒÂ¡tica**: InvocaciÃƒÂ³n de `tg.expand()` y adaptaciÃƒÂ³n dinÃƒÂ¡mica a los colores del tema del cliente (`dark` / `light`).
- **Haptic Feedback**: VibraciÃƒÂ³n hÃƒÂ¡ptica nativa en confirmaciones de compra, errores y toques de interfaz.
- **Mobile-First & Ultra Ligero**: Construido sobre Astro con Tailwind CSS para una carga instantÃƒÂ¡nea dentro del WebView de Telegram.

---

## Ã°Å¸Ââ€º Arquitectura del Sistema

```
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š                 CLIENTE (Telegram Mini App)                 Ã¢â€â€š
Ã¢â€â€š  - Astro Frontend + Telegram WebApp SDK                     Ã¢â€â€š
Ã¢â€â€š  - ExtracciÃƒÂ³n de usuario (Zero-Login)                       Ã¢â€â€š
Ã¢â€â€š  - CatÃƒÂ¡logo de servicios & tg.openInvoice()                 Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                               Ã¢â€â€š 1. POST /api/create-invoice
                               Ã¢â€“Â¼
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š                 TU BACKEND (Astro SSR / Node)               Ã¢â€â€š
Ã¢â€â€š  - Valida initData con HMAC-SHA256                          Ã¢â€â€š
Ã¢â€â€š  - Llama a Bot API: /createInvoiceLink (currency: XTR)      Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                               Ã¢â€â€š 2. Devuelve invoiceLink
                               Ã¢â€“Â¼
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š                 TELEGRAM NATIVE STARS SHEET                 Ã¢â€â€š
Ã¢â€â€š  - Se abre tg.openInvoice(link)                             Ã¢â€â€š
Ã¢â€â€š  - El usuario confirma el dÃƒÂ©bito de Stars                   Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                               Ã¢â€â€š 3. pre_checkout_query & successful_payment
                               Ã¢â€“Â¼
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š             WEBHOOK (POST /api/webhook)                     Ã¢â€â€š
Ã¢â€â€š  - answerPreCheckoutQuery(ok: true)                         Ã¢â€â€š
Ã¢â€â€š  - Registra pedido en DB y notifica a agencia por Telegram Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
```

---

## Ã°Å¸â€ºÂ  Requisitos Previos

- **Node.js** v18.17.0 o superior (recomendado Node 20 LTS o 22 LTS).
- **Cuenta de Telegram** activa.
- Un servidor o plataforma de hosting con soporte **HTTPS obligatorio** (Vercel, Cloudflare Pages, Netlify, Railway, Render o VPS con Nginx y Let's Encrypt). *Telegram bloquea Mini Apps que no utilicen HTTPS.*

---

## Ã°Å¸Â¤â€“ Paso 1: Configurar el Bot y la Mini App en @BotFather

### 1.1 Crear el Bot
1. Abre Telegram y busca a [@BotFather](https://t.me/BotFather).
2. EnvÃƒÂ­a el comando:
   ```text
   /newbot
   ```
3. Asigna un nombre visible (ej. `Agencia Web Dev`).
4. Asigna un nombre de usuario que termine en `bot` (ej. `mi_agencia_dev_bot`).
5. **Copia el Token HTTP API** que te entrega BotFather (ej. `7123456789:AAHq_xxxxxxxxx`). GuÃƒÂ¡rdalo de forma segura; serÃƒÂ¡ tu variable `TELEGRAM_BOT_TOKEN`.

### 1.2 Habilitar Pagos con Telegram Stars
Telegram Stars estÃƒÂ¡ habilitado por defecto para todos los bots. Para configuraciones de cobro de estrellas y retiro posterior:
1. En `@BotFather`, envÃƒÂ­a `/mybots` y selecciona tu bot.
2. Selecciona **Payments**.
3. VerÃƒÂ¡s la opciÃƒÂ³n **Telegram Stars**. No requieres conectar Stripe ni proveedores bancarios externos para operar con Stars.

### 1.3 Crear la Mini App (WebApp)
1. En `@BotFather`, envÃƒÂ­a el comando:
   ```text
   /newapp
   ```
2. Selecciona el bot que creaste en el paso anterior.
3. Ingresa el tÃƒÂ­tulo de la Mini App: `Servicios de Agencia`.
4. Ingresa una descripciÃƒÂ³n corta: `Contrata auditorÃƒÂ­as y mantenimiento web con Telegram Stars`.
5. Sube una imagen de vista previa cuadrada (640x640 px).
6. Sube un GIF animado de demostraciÃƒÂ³n (o escribe `/empty` para omitir).
7. **URL de la Mini App**: Introduce la URL pÃƒÂºblica con HTTPS de tu aplicaciÃƒÂ³n (ej. `https://mi-agencia-miniapp.vercel.app` o tu tÃƒÂºnel ngrok de desarrollo).
8. Asigna un nombre corto para el enlace directo (ej. `tienda`). Tu app serÃƒÂ¡ accesible en `https://t.me/mi_agencia_dev_bot/tienda`.

### 1.4 Configurar el BotÃƒÂ³n de MenÃƒÂº (Menu Button)
Para que los clientes vean un botÃƒÂ³n permanente de acceso a la Mini App al chatear con tu bot:
1. En `@BotFather`, ejecuta `/mybots` -> Selecciona tu bot.
2. Pulsa en **Bot Settings** -> **Menu Button** -> **Configure menu button**.
3. EnvÃƒÂ­a la URL HTTPS de tu Mini App.
4. EnvÃƒÂ­a el texto del botÃƒÂ³n: `Ver Servicios Ã°Å¸Å¡â‚¬`.

---

## Ã°Å¸â€™Â» Paso 2: InstalaciÃƒÂ³n y ConfiguraciÃƒÂ³n Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/telegram-agency-miniapp.git
   cd telegram-agency-miniapp
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno `.env` en la raÃƒÂ­z del proyecto:
   ```env
   # Token obtenido de @BotFather
   TELEGRAM_BOT_TOKEN="7123456789:AAHq_xxxxxxxxx"

   # URL pÃƒÂºblica de tu aplicaciÃƒÂ³n (para webhooks y redirecciones)
   APP_URL="https://tu-dominio.vercel.app"

   # ID de chat de Telegram donde la agencia recibirÃƒÂ¡ avisos de nuevas compras
   ADMIN_TELEGRAM_CHAT_ID="123456789"
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Tu aplicaciÃƒÂ³n estarÃƒÂ¡ corriendo en `http://localhost:3000` (o `http://localhost:4321` si usas Astro puro).

---

## Ã°Å¸Å’Â Paso 3: Probar en Local con HTTPS (Ngrok / Cloudflare Tunnel)

Telegram requiere **estrictamente HTTPS**. No puedes probar `http://localhost` dentro de la app mÃƒÂ³vil de Telegram directamente. Utiliza un tÃƒÂºnel seguro:

### OpciÃƒÂ³n A: Usando Ngrok
```bash
# En una terminal separada:
npx ngrok http 3000
```
Copia la URL segura que termina en `https://xxxx.ngrok-free.app`.

### OpciÃƒÂ³n B: Usando Cloudflare Tunnels (gratuito sin registro)
```bash
npx untun tunnel --port 3000
```

Actualiza temporalmente la URL de tu Mini App en `@BotFather` (`/myapps` -> Selecciona tu App -> **Edit Web App URL**) con la URL generada por el tÃƒÂºnel. Ã‚Â¡Abre tu bot en Telegram y prueba la app en tiempo real!

---

## Ã°Å¸Å¡â‚¬ Paso 4: Despliegue en ProducciÃƒÂ³n (Vercel / Cloudflare / Node)

Dado que la Mini App necesita endpoints dinÃƒÂ¡micos (`/api/create-invoice` y `/api/webhook`), configuramos Astro en modo **Server-Side Rendering (SSR)**.

### 4.1 ConfiguraciÃƒÂ³n de Astro (`astro.config.mjs`)
Si despliegas en **Vercel**:
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server', // Habilita API Routes dinÃƒÂ¡micas
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

## Ã¢Å¡Â¡ Paso 5: Configurar el Webhook y Manejo de Pagos Stars

### 5.1 Registrar el Webhook con Telegram
Telegram debe notificar a tu servidor cuando un usuario inicia o finaliza un pago de Stars. Ejecuta una peticiÃƒÂ³n HTTP para registrar tu endpoint:

```bash
curl -X POST "https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://tu-dominio.vercel.app/api/webhook"}'
```

Telegram responderÃƒÂ¡:
```json
{"ok": true, "result": true, "description": "Webhook was set"}
```

### 5.2 ImplementaciÃƒÂ³n del Webhook (`src/pages/api/webhook.ts`)

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

      console.log(`Ã¢Å“â€¦ Pago recibido: ${payment.total_amount} Stars de ${userName} (${userId})`);
      console.log(`Charge ID: ${payment.telegram_payment_charge_id}`);

      // A) AquÃƒÂ­ guardas el pedido en tu Base de Datos (PostgreSQL, Supabase, etc.)

      // B) Notificar al cliente por el bot con un mensaje de bienvenida
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          text: `Ã°Å¸Å½â€° Ã‚Â¡Gracias por tu compra, ${userName}!\n\nHemos recibido tu pago de ${payment.total_amount} Stars por el servicio "${payload.serviceId}".\n\nNuestro equipo se pondrÃƒÂ¡ en contacto contigo en breve para coordinar la entrega tÃƒÂ©cnica.`,
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
            text: `Ã°Å¸Å¡Â¨ <b>NUEVA VENTA DE SERVICIO</b>\n\nÃ¢â‚¬Â¢ Cliente: ${userName} (ID: ${userId})\nÃ¢â‚¬Â¢ Servicio: ${payload.serviceId}\nÃ¢â‚¬Â¢ Cobrado: ${payment.total_amount} Stars (XTR)\nÃ¢â‚¬Â¢ Charge ID: <code>${payment.telegram_payment_charge_id}</code>`,
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

## Ã°Å¸â€â€™ Paso 6: ValidaciÃƒÂ³n de Seguridad (HMAC-SHA256 de initData)

Para evitar que usuarios malintencionados llamen a tu API simulando ser otros clientes, valida siempre la firma de `tg.initData` en el servidor:

```typescript
// src/utils/telegramAuth.ts
import crypto from 'node:crypto';

export function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  if (!hash) return false;

  // Ordenar alfabÃƒÂ©ticamente las claves en formato clave=valor\n
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

## Ã¢Ââ€œ SoluciÃƒÂ³n de Problemas Frecuentes (FAQ)

### 1. `openInvoice` no abre nada o da error "INVOICE_NOT_FOUND"
- **Causa**: La factura no se creÃƒÂ³ con la moneda `XTR` o se especificÃƒÂ³ un `provider_token`.
- **SoluciÃƒÂ³n**: Para Telegram Stars, el campo `currency` **debe ser exactamente `"XTR"`** y el campo `provider_token` **debe dejarse vacÃƒÂ­o (`""`)**.

### 2. La Mini App muestra pantalla blanca en mÃƒÂ³vil
- **Causa**: Error de certificado SSL o contenido no HTTPS (Mixed Content).
- **SoluciÃƒÂ³n**: AsegÃƒÂºrate de que todos los assets (imÃƒÂ¡genes, fuentes, scripts) usen rutas relativas o `https://`.

### 3. El teclado oculta campos o la app se achica
- **Causa**: Falta invocar `tg.expand()` o faltan meta-etiquetas de viewport.
- **SoluciÃƒÂ³n**: Llama a `window.Telegram.WebApp.expand()` inmediatamente en el evento `DOMContentLoaded` y usa:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  ```

### 4. Ã‚Â¿CÃƒÂ³mo retirar las Telegram Stars acumuladas por la agencia?
1. Las Stars recaudadas por tu bot aparecen en **BotFather** -> `/mybots` -> Tu Bot -> **Balance**.
2. Tras un periodo de retenciÃƒÂ³n de seguridad de 21 dÃƒÂ­as, puedes retirar tus Stars hacia **Toncoin (TON)** mediante la plataforma descentralizada [Fragment.com](https://fragment.com) o utilizarlas para pagar anuncios en Telegram Ads.

---

## Ã°Å¸â€œâ€ž Licencia

MIT Ã‚Â© Tu Agencia Digital. CÃƒÂ³digo abierto para uso comercial y personal.

## Almacenamiento de pedidos

En desarrollo local, `npm run dev` usa SQLite en `data/orders.sqlite`. En Vercel, la API usa Neon Postgres mediante `DATABASE_URL`, ya que el disco de una funciÃ³n serverless no ofrece almacenamiento persistente.

El historial de pedidos se obtiene a partir de `initData` validado por el servidor. El token del bot y las cadenas de conexiÃ³n son secretos: no los publiques ni los incluyas en Git.

## Despliegue en Vercel

El proyecto compila Vite como sitio estÃ¡tico y usa las funciones de `api/` para crear facturas, recibir confirmaciones oficiales de Telegram y guardar los pedidos en Neon.

1. Sube el repositorio a GitHub e importa `ximosa/App-telegram` desde Vercel. El comando de compilaciÃ³n es `npm run build` y la salida es `dist`.
2. Instala Neon desde el Marketplace de Vercel y vincÃºlalo al proyecto para crear `DATABASE_URL`.
3. En **Settings â†’ Environment Variables**, configura `TELEGRAM_BOT_TOKEN` para Production. No uses el prefijo `VITE_` para secretos.
4. Configura `TELEGRAM_WEBHOOK_SECRET`, registra el webhook y despliega de nuevo. Los pasos detallados estÃ¡n abajo.

`GEMINI_API_KEY` es opcional si no activas la funcionalidad Gemini. El archivo `.env` local no se sube al repositorio; `.env.example` contiene marcadores, nunca secretos reales.
## Pagos reales con Telegram Stars en Vercel

La aplicaciÃƒÂ³n crea facturas reales en Telegram Stars. El pedido solo cambia a `paid` cuando Telegram envÃƒÂ­a `successful_payment` al webhook; el navegador no puede marcar pedidos como pagados.

1. En Vercel, configura `TELEGRAM_BOT_TOKEN`, `DATABASE_URL` (Neon) y `TELEGRAM_WEBHOOK_SECRET` para Production. `TELEGRAM_WEBHOOK_SECRET` debe ser un secreto aleatorio largo; no lo compartas ni lo pongas en el repositorio.
2. Despliega la aplicaciÃƒÂ³n y usa el dominio HTTPS que te asigna Vercel.
3. Registra el webhook del bot en Telegram con `setWebhook`, usando la URL `https://TU-DOMINIO.vercel.app/api/telegram-webhook` y el mismo `TELEGRAM_WEBHOOK_SECRET` como `secret_token`. Conserva el token del bot en una variable local al ejecutar la llamada; no lo pongas en el cÃƒÂ³digo ni lo publiques.
4. Configura la URL de la Mini App en BotFather y pruÃƒÂ©bala dentro de Telegram. Telegram debe entregar las actualizaciones `pre_checkout_query` y `message` al webhook.

La factura usa `XTR` (Stars). Telegram exige validar el pre-checkout y esperar el evento `successful_payment` antes de entregar el servicio. Si el webhook no estÃƒÂ¡ registrado o el secreto no coincide, el pedido permanecerÃƒÂ¡ pendiente y nunca aparecerÃƒÂ¡ como pagado.
