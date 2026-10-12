import React from 'react';
import { PurchaseOrder } from '../types';
import { X, CheckCircle2, ClipboardList } from 'lucide-react';

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
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Mis pedidos</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">Todavía no tienes pedidos.</p>
              <p className="text-[11px] text-slate-500">Selecciona un servicio del catálogo para consultar y contratarlo.</p>
            </div>
          ) : orders.map((order) => (
            <div key={order.orderId} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{order.serviceName}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{order.orderId}</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  order.status === 'paid' ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/60' :
                  order.status === 'pending' ? 'text-amber-300 bg-amber-950/40 border border-amber-800/50' :
                  'text-rose-300 bg-rose-950/40 border border-rose-800/50'
                }`}>
                  {order.status === 'paid' ? '✓ Pagado' : order.status === 'pending' ? 'Pendiente de confirmación' : 'No completado'}
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-800/50">
                <div>
                  <p className="text-lg font-bold text-yellow-300">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(order.priceEur || order.starsPaid / 50)}
                  </p>
                  <p className="text-[10px] text-slate-500">{order.currency === 'XTR' ? `${order.starsPaid} Stars de Telegram` : 'Pago procesado por PayPal'}</p>
                </div>
                <span className="text-[11px] text-slate-500 text-right">
                  {new Date(order.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(order.timestamp).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {orders.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
            <span className="text-slate-400 text-[11px]">Total pagado: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(orders.filter((order) => order.status === 'paid').reduce((acc, order) => acc + (order.priceEur || order.starsPaid / 50), 0))}</span>
            <button onClick={onClear} className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors">Borrar historial</button>
          </div>
        )}
      </div>
    </div>
  );
};
