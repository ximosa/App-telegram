import React, { useState, useEffect } from 'react';
import { AGENCY_SERVICES } from './data/services';
import { AgencyService, PurchaseOrder, TelegramUserData } from './types';
import { ServiceCard } from './components/ServiceCard';
import { StarsPaymentModal } from './components/StarsPaymentModal';
import { AstroCodeViewer } from './components/AstroCodeViewer';
import { OrdersDrawer } from './components/OrdersDrawer';
import { TelegramHeaderBar } from './components/TelegramHeaderBar';
import { 
  Star, 
  Smartphone, 
  Code, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  Laptop, 
  RefreshCw, 
  UserCheck, 
  SlidersHorizontal,
  ExternalLink,
  Info
} from 'lucide-react';

export default function App() {
  // App views
  const [activeTab, setActiveTab] = useState<'miniapp' | 'astro-code'>('miniapp');
  const [deviceView, setDeviceView] = useState<'mobile-frame' | 'responsive'>('responsive');

  // Telegram User & Environment State
  const [isRealTelegram, setIsRealTelegram] = useState<boolean>(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUserData>({
    id: 948210332,
    first_name: 'Alejandro',
    last_name: 'Gómez',
    username: 'alex_growth',
    language_code: 'es',
    is_premium: true,
  });

  // Services & Category Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<AgencyService | null>(null);

  // Orders State
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tma_agency_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isUserEditorOpen, setIsUserEditorOpen] = useState(false);

  // Detection and Initialization of Telegram WebApp SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // 1. Mark app as ready
      tg.ready();

      // 2. Expand to full viewport height
      tg.expand();

      // 3. Extract user from initDataUnsafe if present
      if (tg.initDataUnsafe?.user) {
        setIsRealTelegram(true);
        setTelegramUser(tg.initDataUnsafe.user);
      }

      // Check header color capability
      if (tg.backgroundColor) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
      }
    }
  }, []);

  const handleBuyService = (service: AgencyService) => {
    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    setSelectedServiceForPayment(service);
  };

  const handlePaymentSuccess = (newOrder: PurchaseOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem('tma_agency_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setSelectedServiceForPayment(null);
    setIsOrdersOpen(true);
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem('tma_agency_orders');
  };

  const filteredServices = selectedCategory === 'all' 
    ? AGENCY_SERVICES 
    : AGENCY_SERVICES.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Universal Toolbar (Development & Navigation) */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Mode switch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm">
                ✈️
              </div>
              <div>
                <span className="text-xs font-semibold text-white tracking-tight">
                  TMA Agency · Stars
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-1.5 font-normal">
                  (Astro + Telegram WebApp)
                </span>
              </div>
            </div>

            {/* Navigation Switch */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('miniapp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'miniapp'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mini App en Vivo</span>
              </button>
              <button
                onClick={() => setActiveTab('astro-code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'astro-code'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Código Astro & Backend</span>
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {activeTab === 'miniapp' && (
              <>
                {/* Device Frame Toggle */}
                <button
                  onClick={() => setDeviceView(v => v === 'mobile-frame' ? 'responsive' : 'mobile-frame')}
                  className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    deviceView === 'mobile-frame'
                      ? 'bg-slate-800 border-sky-500/50 text-sky-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Alternar vista de marco móvil"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{deviceView === 'mobile-frame' ? 'Marco Móvil' : 'Pantalla Completa'}</span>
                </button>

                {/* Edit simulated user */}
                <button
                  onClick={() => setIsUserEditorOpen(!isUserEditorOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Simular usuario Telegram (Zero-Login)"
                >
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Perfil TG:</span>
                  <span className="font-semibold text-sky-300">@{telegramUser.username || telegramUser.first_name}</span>
                </button>
              </>
            )}

            {/* Orders Drawer Button */}
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mis Pedidos</span>
              {orders.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Simulated User Profile Drawer / Popover */}
      {isUserEditorOpen && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 animate-in slide-in-from-top-2">
          <div className="max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-semibold text-slate-200">
                  Simulador de Identidad Telegram (initDataUnsafe)
                </h4>
              </div>
              <button
                onClick={() => setIsUserEditorOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Modifica estos datos para verificar cómo la Mini App extrae la identidad del cliente en tiempo real sin pedir usuario ni contraseña:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-medium">Nombre</label>
                <input
                  type="text"
                  value={telegramUser.first_name}
                  onChange={(e) => setTelegramUser({ ...telegramUser, first_name: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-medium">Username</label>
                <input
                  type="text"
                  value={telegramUser.username || ''}
                  onChange={(e) => setTelegramUser({ ...telegramUser, username: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-medium">Telegram User ID</label>
                <input
                  type="number"
                  value={telegramUser.id}
                  onChange={(e) => setTelegramUser({ ...telegramUser, id: Number(e.target.value) || 0 })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto">
        {activeTab === 'astro-code' ? (
          <div className="w-full max-w-4xl py-2 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Arquitectura y Código Fuente en Astro
              </h2>
              <p className="text-xs text-slate-400">
                Archivos listos para copiar y pegar en tu proyecto Astro. Incluye integración del SDK, interfaz reactiva, creación de enlaces de pago con Telegram Stars (XTR) y configuración de webhooks.
              </p>
            </div>
            <AstroCodeViewer />
          </div>
        ) : (
          /* Mini App Tab */
          <div className={`w-full transition-all ${
            deviceView === 'mobile-frame' 
              ? 'max-w-[420px] rounded-[38px] border-[8px] border-slate-800 shadow-2xl bg-slate-950 overflow-hidden my-4 ring-1 ring-slate-700/50' 
              : 'max-w-2xl py-2'
          }`}>
            {/* Telegram Client Header Bar */}
            <TelegramHeaderBar
              user={telegramUser}
              isRealTelegram={isRealTelegram}
              onClose={() => {
                if (window.Telegram?.WebApp?.close) {
                  window.Telegram.WebApp.close();
                } else {
                  alert('Llamada a tg.close(): En Telegram nativo, esto cierra la Mini App.');
                }
              }}
            />

            {/* Mini App Inner Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Zero-Login Greeting Card */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Agencia Web
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    ¡Hola, {telegramUser.first_name}! 👋
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Servicios de desarrollo contratados con <span className="text-amber-300 font-medium">Telegram Stars</span>
                  </p>
                </div>

                {/* Extracted User Identity Card */}
                <div className="flex flex-col items-end text-right bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-sky-400">
                      {telegramUser.username ? `@${telegramUser.username}` : telegramUser.first_name}
                    </span>
                    {telegramUser.is_premium && (
                      <span className="text-[10px] text-amber-300" title="Telegram Premium">★</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    ID: {telegramUser.id}
                  </span>
                </div>
              </div>

              {/* Zero-Password & Zero-Registration Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-inner star-glow">
                    ★
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-amber-200">
                        1-Tap Checkout con Telegram Stars (XTR)
                      </h3>
                    </div>
                    <p className="text-xs text-amber-100/70 leading-relaxed">
                      Sin pasarelas externas ni necesidad de crear cuenta. Selecciona el servicio, confirma con tus Stars y nuestro equipo comenzará a trabajar al instante.
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Segmented Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Catálogo de Servicios</span>
                  <span className="text-slate-500">{filteredServices.length} servicios disponibles</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {[
                    { id: 'all', label: 'Todos los servicios' },
                    { id: 'audit', label: 'Auditorías' },
                    { id: 'maintenance', label: 'Mantenimiento' },
                    { id: 'performance', label: 'Velocidad' },
                    { id: 'development', label: 'Telegram Mini Apps' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services List */}
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBuy={handleBuyService}
                  />
                ))}
              </div>

              {/* Agency Guarantee Footer */}
              <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Garantía de satisfacción</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Factura oficial</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Desarrollado con Astro 5.x + Telegram WebApp SDK + Tailwind CSS.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Stars Payment Modal (tg.openInvoice flow) */}
      {selectedServiceForPayment && (
        <StarsPaymentModal
          service={selectedServiceForPayment}
          user={telegramUser}
          isOpen={!!selectedServiceForPayment}
          onClose={() => setSelectedServiceForPayment(null)}
          onPaymentSuccess={handlePaymentSuccess}
          isRealTelegram={isRealTelegram}
        />
      )}

      {/* Orders History Drawer */}
      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onClear={handleClearOrders}
      />
    </div>
  );
}
