import React, { useEffect, useRef, useState } from 'react';
import { AgencyService, PurchaseOrder, TelegramUserData } from '../types';
import { Check, Loader2, Shield, X } from 'lucide-react';

interface PayPalButtons {
  render: (container: HTMLElement) => Promise<void>;
  close?: () => void;
}
interface PayPalNamespace {
  Buttons: (options: {
    style?: { layout?: 'vertical' | 'horizontal'; color?: 'gold' | 'blue'; shape?: 'rect'; label?: 'paypal' };
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onCancel: () => void;
    onError: (error: Error) => void;
  }) => PayPalButtons;
}
declare global { interface Window { paypal?: PayPalNamespace } }

interface PayPalPaymentModalProps {
  service: AgencyService;
  user: TelegramUserData;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: PurchaseOrder) => void;
  isRealTelegram: boolean;
}

type PaymentStep = 'loading' | 'ready' | 'processing' | 'success' | 'failed';

export const PayPalPaymentModal: React.FC<PayPalPaymentModalProps> = ({ service, user, isOpen, onClose, onPaymentSuccess, isRealTelegram }) => {
  const buttonContainer = useRef<HTMLDivElement>(null);
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  const [step, setStep] = useState<PaymentStep>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const formatPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(service.priceEur);

  useEffect(() => { onPaymentSuccessRef.current = onPaymentSuccess; }, [onPaymentSuccess]);

  useEffect(() => {
    if (!isOpen) return;
    const initData = window.Telegram?.WebApp?.initData;
    if (!isRealTelegram || !initData) {
      setStep('failed');
      setErrorMessage('Abre Webgae desde Telegram para crear y consultar tu pedido.');
      return;
    }

    let active = true;
    let buttons: PayPalButtons | undefined;
    setStep('loading');
    setErrorMessage('');

    const initializePayPal = async () => {
      const configResponse = await fetch('/api/paypal-config');
      const config = await configResponse.json();
      if (!configResponse.ok || !config.clientId) throw new Error(config.error || 'PayPal no está configurado.');

      if (!window.paypal) {
        const scriptId = 'paypal-checkout-sdk';
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(config.clientId)}&currency=EUR&intent=capture&components=buttons`;
          script.async = true;
          document.head.appendChild(script);
        }
        await new Promise<void>((resolve, reject) => {
          if (window.paypal) return resolve();
          script!.addEventListener('load', () => resolve(), { once: true });
          script!.addEventListener('error', () => reject(new Error('No se pudo cargar el checkout de PayPal.')), { once: true });
        });
      }
      if (!active || !window.paypal || !buttonContainer.current) return;

      buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: async () => {
          const response = await fetch('/api/paypal-create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': initData },
            body: JSON.stringify({ serviceId: service.id }),
          });
          const result = await response.json();
          if (!response.ok || !result.id) throw new Error(result.error || 'No se pudo crear el pedido de PayPal.');
          return result.id;
        },
        onApprove: async ({ orderID }) => {
          setStep('processing');
          const response = await fetch('/api/paypal-capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': initData },
            body: JSON.stringify({ paypalOrderId: orderID }),
          });
          const order = await response.json();
          if (!response.ok || order.status !== 'paid') throw new Error(order.error || 'PayPal no confirmó el pago.');
          window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
          setStep('success');
          window.setTimeout(() => onPaymentSuccessRef.current(order as PurchaseOrder), 900);
        },
        onCancel: () => { if (active) setStep('ready'); },
        onError: (error) => { if (active) { setErrorMessage(error.message || 'PayPal no pudo procesar el pago.'); setStep('failed'); } },
      });
      await buttons.render(buttonContainer.current);
      if (active) setStep('ready');
    };

    initializePayPal().catch((error: unknown) => {
      if (!active) return;
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar PayPal.');
      setStep('failed');
    });
    return () => { active = false; buttons?.close?.(); };
  }, [isOpen, isRealTelegram, service.id]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-sky-400/15 text-sky-300 flex items-center justify-center text-sm font-bold">P</div><span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Confirma tu pedido</span></div>
          <button onClick={onClose} aria-label="Cerrar" className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><span className="text-xs text-sky-400 font-medium">Resumen de compra</span><h4 className="text-base font-semibold text-slate-100 mt-1">{service.name}</h4><p className="text-xs text-slate-400">{service.tagline}</p></div>
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400"><span>Cliente</span><span className="text-slate-200">{user.first_name}</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span>Plazo estimado</span><span className="text-slate-200">{service.deliveryTime}</span></div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800/80"><span className="text-sm text-slate-200">Total</span><span className="text-2xl font-bold text-yellow-300">{service.pricePrefix ? `${service.pricePrefix} ` : ''}{formatPrice}</span></div>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-sky-950/30 border border-sky-900/50 p-3 rounded-xl"><Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" /><p className="leading-relaxed">El pago se procesa de forma segura en PayPal. El pedido aparecerá como pagado cuando el servidor confirme el cobro.</p></div>
          {step === 'loading' && <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-300"><Loader2 className="w-4 h-4 animate-spin" /> Cargando PayPal…</div>}
          <div ref={buttonContainer} />
          {step === 'processing' && <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-300"><Loader2 className="w-4 h-4 animate-spin" /> Confirmando el pago con PayPal…</div>}
          {step === 'success' && <div className="flex flex-col items-center gap-2 py-4 text-center"><Check className="w-9 h-9 text-emerald-400" /><h4 className="font-semibold text-emerald-300">¡Pago confirmado!</h4><p className="text-xs text-slate-300">Tu pedido está guardado en Mis pedidos.</p></div>}
          {step === 'failed' && <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-3 text-center"><p className="text-xs text-rose-200">{errorMessage}</p><button onClick={() => window.location.reload()} className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-200">Volver a intentar</button></div>}
        </div>
      </div>
    </div>
  );
};
