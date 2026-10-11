import React from 'react';
import { AgencyService } from '../types';
import { Star, CheckCircle, Clock, ShieldCheck, Zap, Code } from 'lucide-react';

interface ServiceCardProps {
  service: AgencyService;
}

const categoryNames = {
  audit: 'Auditoría',
  maintenance: 'Mantenimiento',
  performance: 'Rendimiento',
  development: 'Desarrollo web',
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const categoryIcon = {
    audit: <Zap className="w-4 h-4 text-amber-400" />,
    maintenance: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    performance: <Clock className="w-4 h-4 text-sky-400" />,
    development: <Code className="w-4 h-4 text-indigo-400" />,
  }[service.category];

  return (
    <article className={`relative flex flex-col rounded-2xl transition-all duration-200 border ${
      service.popular
        ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 border-sky-500/40 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500/20'
        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
    } p-5`}>
      {service.popular && (
        <div className="absolute -top-3 right-4 bg-sky-500 text-white font-medium text-[11px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          <span>Más solicitado</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          {categoryIcon}
          <span>{categoryNames[service.category]}</span>
          <span aria-hidden="true">·</span>
          <span>{service.deliveryTime}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-100 tracking-tight leading-snug mb-1">{service.name}</h3>
      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{service.tagline}</p>

      <div className="mb-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-bold tracking-tight text-yellow-300">
            {service.pricePrefix && <span className="mr-1 text-sm font-medium">{service.pricePrefix}</span>}
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(service.priceEur)}
          </span>
          {service.priceUnit && <span className="text-xs text-slate-400">{service.priceUnit}</span>}
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">Solicita el servicio y confirma el alcance antes de empezar.</p>
      </div>

      <div className="space-y-2 mb-5 flex-1">
        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Incluye:</p>
        <ul className="space-y-1.5">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-300 leading-tight">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <a href={service.contactUrl || 'https://webgae.com/contact'} target="_blank" rel="noopener noreferrer" className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
        service.popular
          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-600/25 hover:from-sky-400 hover:to-blue-500'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
      }`}>
        Solicitar este servicio
      </a>
    </article>
  );
};
