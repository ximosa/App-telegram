import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AGENCY_SERVICES } from './data/services';
import { TelegramUserData } from './types';
import { ServiceCard } from './components/ServiceCard';

export default function App() {
  const [telegramUser, setTelegramUser] = useState<TelegramUserData>({
    id: 0,
    first_name: 'Cliente',
    language_code: 'es',
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    if (webApp.initDataUnsafe?.user) setTelegramUser(webApp.initDataUnsafe.user);
    if (webApp.backgroundColor) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Webgae, inicio">
            <span className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300 font-bold">W</span>
            <span className="text-base font-bold tracking-tight text-white">Webgae</span>
          </a>
          <a href="https://webgae.com/contact" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-amber-400/10 border border-amber-300/25 text-amber-200 hover:bg-amber-400/20 transition-colors">
            Contactar <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto">
        <div id="inicio" className="w-full max-w-2xl py-2">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h1 className="text-2xl font-bold text-white tracking-tight">¡Hola, {telegramUser.first_name}! 👋</h1>
              <p className="text-xs text-slate-400 mt-1">Soluciones digitales para hacer crecer tu negocio.</p>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg shrink-0">€</div>
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-amber-200">Precios claros en euros</h2>
                  <p className="text-xs text-amber-100/70 leading-relaxed">Solicita el servicio y confirmaremos contigo el alcance, la disponibilidad y el pago en euros.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Servicios para tu negocio</span>
              <span className="text-slate-500">{AGENCY_SERVICES.length} opciones</span>
            </div>

            <div className="space-y-4">
              {AGENCY_SERVICES.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>

            <p className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
              Antes de empezar, acordaremos el alcance y el precio final contigo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
