import { AgencyService } from '../types';

export const AGENCY_SERVICES: AgencyService[] = [
  {
    id: 'seo-audit-express',
    name: 'Auditoría SEO & Web Express',
    tagline: 'Diagnóstico técnico completo en 24 horas',
    description: 'Revisión exhaustiva de arquitectura web, velocidad de carga, indexación en motores de búsqueda, seguridad SSL y reporte ejecutivo con checklist de acciones inmediatas.',
    starsPrice: 250, // 250 Telegram Stars
    fiatEstimate: '~$5.00 USD',
    deliveryTime: '24 horas',
    category: 'audit',
    popular: true,
    features: [
      'Análisis de Core Web Vitals en móvil y escritorio',
      'Auditoría SEO On-Page (metaetiquetas, canonicals, sitemap)',
      'Chequeo de seguridad HTTPS, cabeceras y vulnerabilidades',
      'Informe PDF accionable prioritario (Urgente / Medio / Bajo)'
    ],
    scope: [
      '1 dominio web',
      'Hasta 50 URLs rastreadas',
      'Sesión de preguntas y respuestas vía Telegram'
    ]
  },
  {
    id: 'monthly-maintenance',
    name: 'Pack Mantenimiento Mensual Pro',
    tagline: 'Tu web protegida, rápida y siempre actualizada',
    description: 'Tranquilidad total para tu negocio. Nos encargamos de las copias de seguridad diarias, actualización segura de plugins y librerías, monitorización de caídas en tiempo real y soporte prioritario.',
    starsPrice: 750, // 750 Telegram Stars
    fiatEstimate: '~$15.00 USD / mes',
    deliveryTime: 'Servicio continuo (30 días)',
    category: 'maintenance',
    features: [
      'Backups diarios automatizados en almacenamiento externo',
      'Actualizaciones semanales testeadas en entorno staging',
      'Monitorización de uptime 24/7 con alertas instantáneas',
      '3 horas mensuales de soporte técnico o ajustes de contenido'
    ],
    scope: [
      'Monitoreo activo cada 5 minutos',
      'Restauración de emergencia incluida sin coste extra',
      'Canal privado de Telegram con desarrollador asignado'
    ]
  },
  {
    id: 'speed-optimization',
    name: 'Micro-servicio Core Web Vitals Boost',
    tagline: 'Optimización radical de velocidad para superar 90+ PageSpeed',
    description: 'Mejora inmediata de tiempos de respuesta, reducción de rebote y aumento de conversiones. Minificación de assets, conversión de imágenes a formatos de última generación y optimización de render blocking scripts.',
    starsPrice: 450, // 450 Telegram Stars
    fiatEstimate: '~$9.00 USD',
    deliveryTime: '48 horas',
    category: 'performance',
    features: [
      'Optimización de LCP (Largest Contentful Paint) < 2.5s',
      'Eliminación de Cumulative Layout Shift (CLS) < 0.1',
      'Compresión y redimensionado WebP/AVIF automatizado',
      'Configuración de caché HTTP y headers CDN'
    ],
    scope: [
      'Home + 2 páginas clave (ej. checkout o servicios)',
      'Garantía de aumento medible en Google PageSpeed Insights'
    ]
  },
  {
    id: 'tma-custom-setup',
    name: 'Integración Telegram Mini App & Bot',
    tagline: 'Arquitectura lista para vender en Telegram con Stars',
    description: 'Desarrollamos e integramos tu propia Mini App en Astro o React conectada a tu backend con validación criptográfica de initData y pasarela de Stars.',
    starsPrice: 1200, // 1200 Telegram Stars
    fiatEstimate: '~$24.00 USD',
    deliveryTime: '3-5 días hábiles',
    category: 'development',
    features: [
      'Setup en @BotFather con menú interactivo y botón WebApp',
      'Integración del SDK @telegram-apps/sdk o telegram-web-app.js',
      'Generación de Invoice Links de Stars en tu servidor',
      'Validación de pagos con webhook y base de datos'
    ],
    scope: [
      'Repositorio de código listo para despliegue en Vercel/Cloudflare',
      'Soporte de homologación y testing en Testnet/Producción'
    ]
  }
];
