import React, { useState } from 'react';
import { AgencyService, PurchaseOrder, TelegramUserData } from '../types';
import { Check, Shield, X, Loader2 } from 'lucide-react';

interface StarsPaymentModalProps {
  service: AgencyService;
  user: TelegramUserData;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: PurchaseOrder) => void;
  isRealTelegram: boolean;
}

type PaymentStep = 'confirm' | 'processing' | 'success' | 'failed' | 'pending';

export const StarsPaymentModal: React.FC<StarsPaymentModalProps> = ({
  service,
  user,
  isOpen,
  onClose,
  onPaymentSuccess,
  isRealTelegram,
}) => {
  const [step, setStep] = useState<PaymentStep>('confirm');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    const webApp = window.Telegram?.WebApp;
    if (!isRealTelegram || !webApp?.initData || !webApp.openInvoice) {
      setErrorMessage('Abre esta aplicación desde Telegram para pagar con Stars.');
      setStep('failed');
      return;
    }

    setStep('processing');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': webApp.initData,
        },
        body: JSON.stringify({ serviceId: service.id }),
      });
      const result = await response.json();
      if (!response.ok || !result.invoiceLink || !result.orderId) {
        throw new Error(result.error || 'No se pudo crear la factura de Telegram.');
      }

      webApp.openInvoice(result.invoiceLink, async (status) => {
        if (status === 'cancelled') {
          setStep('confirm');
          return;
        }
        if (status === 'failed') {
          setErrorMessage('Telegram no pudo procesar el pago. Puedes intentarlo de nuevo.');
          setStep('failed');
          return;
        }
        if (status === 'pending') {
          setStep('pending');
          return;
        }

        // Telegram's invoice callback is not our source of truth. Wait for the
        // successful_payment webhook to confirm the order in the database.
        setStep('processing');
        for (let attempt = 0; attempt < 12; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 1000));
          const ordersResponse = await fetch('/api/orders', {
            headers: { 'x-telegram-init-data': webApp.initData },
          });
          if (!ordersResponse.ok) continue;
          const orders: PurchaseOrder[] = await ordersResponse.json();
          const paidOrder = orders.find((order) => order.orderId === result.orderId && order.status === 'paid');
          if (paidOrder) {
            webApp.HapticFeedback?.notificationOccurred('success');
            setStep('success');
            window.setTimeout(() => onPaymentSuccess(paidOrder), 900);
            return;
          }
        }
        setStep('pending');
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar el pago.');
      setStep('failed');
    }
  };

  const formatPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(service.priceEur);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-xs">★</div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Confirma tu pedido</span>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 'confirm' && <>
            <div className="space-y-1">
              <span className="text-xs text-sky-400 font-medium">Resumen de compra</span>
              <h4 className="text-base font-semibold text-slate-100">{service.name}</h4>
              <p className="text-xs text-slate-400">{service.tagline}</p>
            </div>
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400"><span>Cliente:</span><span className="text-slate-200">{user.first_name}</span></div>
              <div className="flex justify-between items-center text-xs text-slate-400"><span>Plazo de entrega:</span><span className="text-slate-200">{service.deliveryTime}</span></div>
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-baseline"><span className="text-sm font-medium text-slate-200">Precio:</span><span className="text-2xl font-bold text-yellow-300">{service.pricePrefix ? `${service.pricePrefix} ` : ''}{formatPrice}</span></div>
                <p className="mt-1 text-right text-[11px] text-slate-400">Telegram cobrará {service.starsPrice} ⭐</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-sky-950/30 border border-sky-900/50 p-3 rounded-xl">
              <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Las Stars son la moneda virtual de Telegram. El precio del servicio es {formatPrice}; Telegram cobrará {service.starsPrice} ⭐ y te mostrará cómo obtenerlas si no tienes saldo. El coste de comprar Stars puede variar según Telegram, tu país y la tienda de tu dispositivo. El pedido solo se marcará como pagado cuando Telegram confirme el cobro.
              </p>
            </div>
            {!isRealTelegram && <p className="text-xs text-amber-200">Abre Webgae desde Telegram para pagar con Stars.</p>}
            <button onClick={handlePayment} disabled={!isRealTelegram} className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all">
              Continuar en Telegram · {service.starsPrice} ⭐
            </button>
          </>}

          {step === 'processing' && <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <h4 className="text-base font-semibold text-slate-200">Esperando confirmación de Telegram…</h4>
            <p className="text-xs text-slate-400 max-w-xs">No cierres la aplicación mientras confirmamos el pago.</p>
          </div>}

          {step === 'success' && <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Check className="w-6 h-6 stroke-[3]" /></div>
            <h4 className="text-base font-semibold text-emerald-300">¡Pago confirmado!</h4>
            <p className="text-xs text-slate-300 max-w-xs">Telegram ha confirmado el pago de <strong className="text-white">{service.name}</strong>.</p>
          </div>}

          {step === 'pending' && <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 text-amber-400" />
            <h4 className="text-base font-semibold text-amber-200">Pago pendiente de confirmación</h4>
            <p className="text-xs text-slate-300 max-w-xs">El pedido no se marcará como pagado hasta recibir la confirmación oficial de Telegram. Puedes revisar su estado en Mis pedidos.</p>
            <button onClick={onClose} className="mt-2 py-2 px-4 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700">Cerrar</button>
          </div>}

          {step === 'failed' && <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center"><X className="w-6 h-6 stroke-[3]" /></div>
            <h4 className="text-base font-semibold text-rose-300">No se pudo iniciar el pago</h4>
            <p className="text-xs text-slate-400 max-w-xs">{errorMessage || 'El pago no pudo procesarse.'}</p>
            <button onClick={() => { setErrorMessage(null); setStep('confirm'); }} className="mt-2 py-2 px-4 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700">Volver a intentar</button>
          </div>}
        </div>
      </div>
    </div>
  );
};
