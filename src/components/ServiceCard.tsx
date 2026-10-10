import React from 'react';
import { AgencyService } from '../types';
import { Star, CheckCircle, Clock, ShieldCheck, Zap, Code, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: AgencyService;
  onBuy: (service: AgencyService) => void;
  isProcessing?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBuy, isProcessing = false }) => {
  const getCategoryIcon = () => {
    switch (service.category) {
      case 'audit':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'maintenance':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'performance':
        return <Clock className="w-4 h-4 text-sky-400" />;
      case 'development':
        return <Code className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className={`relative flex flex-col rounded-2xl transition-all duration-200 border ${
      service.popular 
        ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 border-sky-500/40 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500/20' 
        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
    } p-5`}>
      {/* Popular Highlight Badge */}
      {service.popular && (
        <div className="absolute -top-3 right-4 bg-sky-500 text-white font-medium text-[11px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          <span>Más solicitado</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          {getCategoryIcon()}
          <span className="capitalize">{service.category}</span>
          <span aria-hidden="true">·</span>
          <span>{service.deliveryTime}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-100 tracking-tight leading-snug mb-1">
        {service.name}
      </h3>
      <p className="text-xs text-slate-400 mb-4 line-clamp-2">
        {service.tagline}
      </p>

      {/* Price tag with Telegram Stars */}
      <div className="flex items-baseline gap-2 mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-bold text-xs shadow-inner star-glow">
            ★
          </div>
          <span className="text-2xl font-bold tracking-tight text-yellow-300">
            {service.starsPrice.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-amber-200/90 tracking-wide">
            STARS (XTR)
          </span>
        </div>
        <span className="text-xs text-slate-500 ml-auto">
          {service.fiatEstimate}
        </span>
      </div>

      {/* Features list */}
      <div className="space-y-2 mb-5 flex-1">
        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          Incluye en el entregable:
        </p>
        <ul className="space-y-1.5">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-tight">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to action button */}
      <button
        onClick={() => onBuy(service)}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          service.popular
            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-600/25 hover:from-sky-400 hover:to-blue-500'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>Comprar con Telegram Stars</span>
        <div className="flex items-center gap-0.5 font-bold text-amber-300 text-xs bg-black/20 px-1.5 py-0.5 rounded">
          <span>★</span>
          <span>{service.starsPrice}</span>
        </div>
      </button>
    </div>
  );
};
