import React, { useEffect, useState } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import { AGENCY_SERVICES } from './data/services';
import { PurchaseOrder, TelegramUserData } from './types';
import { ServiceCard } from './components/ServiceCard';
import { OrdersDrawer } from './components/OrdersDrawer';
import { PayPalPaymentModal } from './components/PayPalPaymentModal';

export default function App() {
  const [telegramUser, setTelegramUser] = useState<TelegramUserData>({ id: 0, first_name: 'Cliente', language_code: 'es' });
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const webApp = window.Telegram?.WebApp;
  const isRealTelegram = Boolean(webApp?.initData && webApp.initDataUnsafe?.user?.id);
  const selectedService = AGENCY_SERVICES.find((service) => service.id === selectedServiceId) || null;

  useEffect(() => {
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
    if (webApp.initDataUnsafe?.user) setTelegramUser(webApp.initDataUnsafe.user);
    if (webApp.backgroundColor) document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor);
  }, []);

  const showOrders = async () => {
    setOrdersOpen(true);
    setOrdersError('');
    if (!window.Telegram?.WebApp?.initData) {
      setOrdersError('Abre Webgae desde Telegram para consultar tus pedidos.');
      return;
    }
    setOrdersLoading(true);
    try {
      const response = await fetch('/api/orders', { headers: { 'x-telegram-init-data': window.Telegram.WebApp.initData } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar tus pedidos.');
      setOrders(result);
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : 'No se pudieron cargar tus pedidos.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const clearOrders = async () => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;
    const response = await fetch('/api/orders', { method: 'DELETE', headers: { 'x-telegram-init-data': initData } });
    if (response.ok) setOrders([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Webgae, inicio">
            <span className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300 font-bold">W</span>
            <span className="text-base font-bold tracking-tight text-white">Webgae</span>
          </a>
          <button onClick={showOrders} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-sky-400/10 border border-sky-300/25 text-sky-200 hover:bg-sky-400/20 transition-colors">
            <ClipboardList className="w-4 h-4" /> Mis pedidos
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto">
        <div id="inicio" className="w-full max-w-2xl py-2">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h1 className="text-2xl font-bold text-white tracking-tight">¡Hola, {telegramUser.first_name}!</h1>
              <p className="text-xs text-slate-400 mt-1">Elige un servicio, paga con PayPal y sigue el estado de tu pedido aquí.</p>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg shrink-0">€</div>
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-amber-200">Pago seguro con PayPal</h2>
                  <p className="text-xs text-amber-100/70 leading-relaxed">Paga en euros con tu cuenta PayPal o con tarjeta cuando PayPal lo permita. Encontrarás el pedido en “Mis pedidos”.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Servicios para tu negocio</span>
              <span className="text-slate-500">{AGENCY_SERVICES.length} opciones</span>
            </div>
            <div className="space-y-4">
              {AGENCY_SERVICES.map((service) => <ServiceCard key={service.id} service={service} onSelect={() => setSelectedServiceId(service.id)} />)}
            </div>
            <p className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">Los pagos de servicios con precio cerrado se confirman con PayPal y quedan guardados en tu historial.</p>
          </div>
        </div>
      </main>
      {selectedService && <PayPalPaymentModal key={selectedService.id} service={selectedService} user={telegramUser} isOpen isRealTelegram={isRealTelegram} onClose={() => setSelectedServiceId(null)} onPaymentSuccess={(order) => { setOrders((previous) => [order, ...previous.filter((item) => item.orderId !== order.orderId)]); setSelectedServiceId(null); }} />}
      {ordersOpen && (ordersError ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"><div className="max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center"><p className="text-sm text-slate-200">{ordersError}</p><button className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm" onClick={() => setOrdersOpen(false)}>Cerrar</button></div></div>
      ) : ordersLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80"><Loader2 className="h-8 w-8 animate-spin text-sky-400" aria-label="Cargando pedidos" /></div>
      ) : <OrdersDrawer isOpen onClose={() => setOrdersOpen(false)} orders={orders} onClear={clearOrders} />)}
    </div>
  );
}
