import React, { useState, useEffect } from 'react';
import { AGENCY_SERVICES } from './data/services';
import { AgencyService, PurchaseOrder, TelegramUserData } from './types';
import { ServiceCard } from './components/ServiceCard';
import { StarsPaymentModal } from './components/StarsPaymentModal';
import { OrdersDrawer } from './components/OrdersDrawer';
import { ShoppingBag } from 'lucide-react';

export default function App() {

  // Telegram User & Environment State
  const [isRealTelegram, setIsRealTelegram] = useState<boolean>(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUserData>({
    id: 948210332,
    first_name: 'Cliente',
    language_code: 'es',
    is_premium: true,
  });

  // Services & Category Filtering
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<AgencyService | null>(null);

  // Orders State
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

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

  useEffect(() => {
    const headers = new Headers({ 'x-demo-user-id': String(telegramUser.id) });
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) headers.set('x-telegram-init-data', initData);
    fetch('/api/orders', { headers })
      .then(async (response) => {
        if (!response.ok) throw new Error(`No se pudieron cargar los pedidos (${response.status})`);
        setOrders(await response.json());
      })
      .catch((error) => console.error('Error cargando pedidos:', error));
  }, [telegramUser.id]);

  const handleBuyService = (service: AgencyService) => {
    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    setSelectedServiceForPayment(service);
  };

  const handlePaymentSuccess = async (_newOrder: PurchaseOrder) => {
    const headers = new Headers({ 'x-demo-user-id': String(telegramUser.id) });
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) headers.set('x-telegram-init-data', initData);
    try {
      const response = await fetch('/api/orders', { headers });
      if (!response.ok) throw new Error(`No se pudo actualizar el historial (${response.status})`);
      setOrders(await response.json());
      setSelectedServiceForPayment(null);
      setIsOrdersOpen(true);
    } catch (error) {
      console.error('Error actualizando pedidos:', error);
      window.alert('El pago se confirmó, pero no se pudo actualizar el historial. Vuelve a abrir Mis pedidos.');
    }
  };

  const handleClosePayment = async () => {
    setSelectedServiceForPayment(null);
    const headers = new Headers({ 'x-demo-user-id': String(telegramUser.id) });
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) headers.set('x-telegram-init-data', initData);
    try {
      const response = await fetch('/api/orders', { headers });
      if (response.ok) setOrders(await response.json());
    } catch (error) {
      console.error('Error actualizando pedidos:', error);
    }
  };
  const handleClearOrders = async () => {
    const headers = new Headers({ 'x-demo-user-id': String(telegramUser.id) });
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) headers.set('x-telegram-init-data', initData);
    const response = await fetch('/api/orders', { method: 'DELETE', headers });
    if (!response.ok) throw new Error(`No se pudieron borrar los pedidos (${response.status})`);
    setOrders([]);
  };



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Webgae, inicio">
            <span className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300 font-bold">W</span>
            <span className="text-base font-bold tracking-tight text-white">Webgae</span>
          </a>
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-amber-400/10 border border-amber-300/25 text-amber-200 hover:bg-amber-400/20 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mis pedidos</span>
            {orders.length > 0 && <span className="min-w-5 h-5 px-1 rounded-full bg-amber-300 text-slate-950 text-xs flex items-center justify-center">{orders.length}</span>}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto">
        <div id="inicio" className="w-full max-w-2xl py-2">
            {/* Mini App Inner Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Zero-Login Greeting Card */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Â¡Hola, {telegramUser.first_name}! ðŸ‘‹
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Soluciones digitales para hacer crecer tu negocio.
                  </p>
                </div>

              </div>

              {/* Zero-Password & Zero-Registration Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-inner star-glow">
                    â˜…
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-amber-200">
                        Pago sencillo con Telegram Stars
                      </h3>
                    </div>
                    <p className="text-xs text-amber-100/70 leading-relaxed">
                      Consulta cada servicio, revisa su precio y solicita la contrataciÃ³n desde Telegram.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Servicios para tu negocio</span>
                <span className="text-slate-500">{AGENCY_SERVICES.length} opciones</span>
              </div>

              {/* Services List */}
              <div className="space-y-4">
                {AGENCY_SERVICES.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBuy={handleBuyService}
                  />
                ))}
              </div>

              <p className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
                Revisa el alcance y el plazo de entrega antes de contratar.
              </p>
            </div>
        </div>
      </main>

      {/* Stars Payment Modal (tg.openInvoice flow) */}
      {selectedServiceForPayment && (
        <StarsPaymentModal
          service={selectedServiceForPayment}
          user={telegramUser}
          isOpen={!!selectedServiceForPayment}
          onClose={handleClosePayment}
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
