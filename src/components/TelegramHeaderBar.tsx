import React from 'react';
import { X, MoreVertical } from 'lucide-react';

interface TelegramHeaderBarProps {
  isRealTelegram: boolean;
  onClose?: () => void;
}

export const TelegramHeaderBar: React.FC<TelegramHeaderBarProps> = ({
  isRealTelegram,
  onClose,
}) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between select-none">
      {/* Native Telegram Close / Cancel */}
      <button
        onClick={onClose}
        className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 active:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Cerrar</span>
      </button>

      {/* Bot Info Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-100 tracking-tight">
            Webgae
          </span>
          <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-bold">
            ✓
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {isRealTelegram ? 'Telegram Mini App (Nativo)' : 'Mini App · bot de agencia'}
        </span>
      </div>

      {/* 3-dots Menu */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (window.Telegram?.WebApp?.showPopup) {
              window.Telegram.WebApp.showPopup({
                title: 'Webgae',
                message: 'Explora nuestros servicios digitales y revisa tus pedidos.',
                buttons: [{ type: 'ok', text: 'Entendido' }]
              });
            } else {
              alert('Menú de Telegram: Agencia de Desarrollo Web.');
            }
          }}
          className="p-1 rounded-full text-slate-400 hover:text-slate-200 active:opacity-70 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
