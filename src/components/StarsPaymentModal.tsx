import React, { useState } from 'react';
import { AgencyService, PurchaseOrder, TelegramUserData } from '../types';
import { Star, Shield, Check, X, Loader2, ArrowRight, Zap, ExternalLink } from 'lucide-react';

interface StarsPaymentModalProps {
  service: AgencyService;
  user: TelegramUserData;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: PurchaseOrder) => void;
  isRealTelegram: boolean;
}

export const StarsPaymentModal: React.FC<StarsPaymentModalProps> = ({
  service,
  user,
  isOpen,
  onClose,
  onPaymentSuccess,
  isRealTelegram,
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'failed'>('confirm');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePayment = (outcome: 'paid' | 'cancelled' | 'failed') => {
    // Trigger Telegram haptic feedback if available
    if (window.Telegram?.WebApp?.HapticFeedback) {
      if (outcome === 'paid') {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      } else {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    }

    setStep('processing');
    setTimeout(() => {
      if (outcome === 'paid') {
        const order: PurchaseOrder = {
          orderId: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
          serviceId: service.id,
          serviceName: service.name,
          starsPaid: service.starsPrice,
          currency: 'XTR',
          timestamp: Date.now(),
          status: 'paid',
          telegramUserId: user.id,
          telegramUsername: user.username,
          invoiceLink: `https://t.me/$${service.id}_demo_invoice`,
        };
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(order);
        }, 1200);
      } else if (outcome === 'cancelled') {
        setStep('confirm');
        onClose();
      } else {
        setStep('failed');
        setErrorMessage('La transacción fue rechazada o el usuario canceló el pago.');
      }
    }, 1100);
  };

  const handleRealTelegramOpenInvoice = () => {
    // If running in real Telegram with openInvoice support:
    const mockInvoiceUrl = `https://t.me/$agency_stars_${service.id}`;
    if (window.Telegram?.WebApp?.openInvoice) {
      try {
        window.Telegram.WebApp.openInvoice(mockInvoiceUrl, (status) => {
          if (status === 'paid') {
            const order: PurchaseOrder = {
              orderId: `TG-${Date.now().toString(36).toUpperCase()}`,
              serviceId: service.id,
              serviceName: service.name,
              starsPaid: service.starsPrice,
              currency: 'XTR',
              timestamp: Date.now(),
              status: 'paid',
              telegramUserId: user.id,
              telegramUsername: user.username,
            };
            onPaymentSuccess(order);
          } else {
            setErrorMessage(`Factura cerrada con estado: ${status}`);
          }
        });
      } catch (e) {
        console.warn('Real openInvoice failed, falling back to simulated invoice', e);
        handleSimulatePayment('paid');
      }
    } else {
      handleSimulatePayment('paid');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-xs">
              ★
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Telegram Stars Invoice (XTR)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {step === 'confirm' && (
            <>
              {/* Product Summary */}
              <div className="space-y-1">
                <span className="text-xs text-sky-400 font-medium">Factura de servicio</span>
                <h4 className="text-base font-semibold text-slate-100">{service.name}</h4>
                <p className="text-xs text-slate-400">{service.tagline}</p>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Comprador (Telegram):</span>
                  <span className="text-slate-200 font-mono">
                    {user.first_name} {user.username ? `(@${user.username})` : `(ID: ${user.id})`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Moneda de pago:</span>
                  <span className="text-amber-300 font-medium">Telegram Stars (XTR)</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Plazo de entrega:</span>
                  <span className="text-slate-200">{service.deliveryTime}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                  <span className="text-sm font-medium text-slate-200">Total a pagar:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold text-yellow-300">
                      {service.starsPrice}
                    </span>
                    <span className="text-xs font-bold text-yellow-400">★ STARS</span>
                  </div>
                </div>
              </div>

              {/* Telegram Stars Explanatory Note */}
              <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-sky-950/30 border border-sky-900/50 p-3 rounded-xl">
                <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Las compras con <strong className="text-sky-300 font-medium">Telegram Stars</strong> no requieren ingresar tarjetas ni registros. Se debitan directamente del saldo de Stars de tu cuenta de Telegram o de la App Store / Google Play.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSimulatePayment('paid')}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 hover:opacity-95 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Pagar {service.starsPrice} Stars (XTR)</span>
                  <span className="text-xs font-bold">★</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleSimulatePayment('cancelled')}
                    className="flex-1 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Simular Cancelación
                  </button>
                  <span className="text-slate-700">·</span>
                  <button
                    onClick={() => handleSimulatePayment('failed')}
                    className="flex-1 py-2 text-xs text-rose-400/80 hover:text-rose-300 transition-colors"
                  >
                    Simular Error / Fallo
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
              <h4 className="text-base font-semibold text-slate-200">
                Procesando factura con Telegram...
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Invocando <code className="text-sky-300 font-mono">Telegram.WebApp.openInvoice()</code> y confirmando transferencia de {service.starsPrice} Stars.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-semibold text-emerald-300">
                ¡Pago Confirmado con Éxito!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs">
                Has adquirido <strong className="text-white">{service.name}</strong> por {service.starsPrice} Stars. El equipo de la agencia se pondrá en contacto por Telegram.
              </p>
            </div>
          )}

          {step === 'failed' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <X className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-semibold text-rose-300">
                Transacción no completada
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                {errorMessage || 'El pago no pudo procesarse.'}
              </p>
              <button
                onClick={() => setStep('confirm')}
                className="mt-2 py-2 px-4 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
