import React from 'react';
import { PurchaseOrder } from '../types';
import { X, CheckCircle2, Clock, Star, ExternalLink, ShieldAlert } from 'lucide-react';

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PurchaseOrder[];
  onClear: () => void;
}

export const OrdersDrawer: React.FC<OrdersDrawerProps> = ({ isOpen, onClose, orders, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Mis Contrataciones (Stars)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Star className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No has realizado ninguna compra aún.</p>
              <p className="text-[11px] text-slate-500">
                Selecciona un servicio del catálogo y prueba el pago con Telegram Stars.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{order.serviceName}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{order.orderId}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>✓ Pagado</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50 text-slate-400">
                  <div className="flex items-center gap-1 text-amber-300 font-semibold">
                    <span>★ {order.starsPaid} XTR</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(order.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
            <span className="text-slate-400 text-[11px]">Total acumulado: {orders.reduce((acc, o) => acc + o.starsPaid, 0)} Stars</span>
            <button
              onClick={onClear}
              className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
            >
              Borrar historial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
