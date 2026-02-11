
import React from 'react';
import { useCoreStore } from '../hooks/useCoreStore';
import { formatCurrency, formatDate } from '../utils/format';
import { NegotiationStatus } from '../types';

const NegotiationsList: React.FC = () => {
  const { data, closeNegotiation } = useCoreStore();

  const handleCloseDeal = (id: string, value: number) => {
    if (confirm('Deseja converter esta negociação em um pedido fechado?')) {
      closeNegotiation(id, value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pipeline de Negociações</h2>
          <p className="text-slate-500">Acompanhe e converta seus prospects em vendas.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-emerald-700 flex items-center gap-2">
              <i className="fa-solid fa-trophy"></i>
              <span className="text-lg font-bold">
                {formatCurrency(data.negotiations.filter(n => n.status === NegotiationStatus.WON).reduce((a,b) => a+b.estimatedValue, 0))}
              </span>
              <span className="text-[10px] font-bold uppercase ml-1">Ganhos</span>
           </div>
        </div>
      </div>

      <div className="bg-slate-100 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Opened */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600 uppercase tracking-widest text-xs">Em Aberto</h3>
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {data.negotiations.filter(n => n.status === NegotiationStatus.OPEN).length}
            </span>
          </div>
          {data.negotiations.filter(n => n.status === NegotiationStatus.OPEN).map(neg => {
             const customer = data.customers.find(c => c.id === neg.customerId);
             return (
               <div key={neg.id} className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-blue-400 group animate-slideIn">
                 <h4 className="font-bold text-slate-900 mb-1">{customer?.tradingName}</h4>
                 <p className="text-xs text-slate-400 mb-4">{neg.notes}</p>
                 <div className="flex items-center justify-between">
                   <p className="text-lg font-bold text-slate-900">{formatCurrency(neg.estimatedValue)}</p>
                   <button 
                    onClick={() => handleCloseDeal(neg.id, neg.estimatedValue)}
                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-md transition-all active:scale-95"
                   >
                     <i className="fa-solid fa-check"></i>
                   </button>
                 </div>
               </div>
             );
          })}
        </div>

        {/* Column 2: Won (Simplified History) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600 uppercase tracking-widest text-xs">Convertidas</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {data.negotiations.filter(n => n.status === NegotiationStatus.WON).length}
            </span>
          </div>
          {data.negotiations.filter(n => n.status === NegotiationStatus.WON).map(neg => {
             const customer = data.customers.find(c => c.id === neg.customerId);
             return (
               <div key={neg.id} className="bg-white/60 p-5 rounded-2xl border border-emerald-100 grayscale-[0.5]">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-slate-700">{customer?.tradingName}</h4>
                   <i className="fa-solid fa-circle-check text-emerald-500"></i>
                 </div>
                 <p className="text-lg font-bold text-slate-900 opacity-60">{formatCurrency(neg.estimatedValue)}</p>
                 <p className="text-[10px] text-slate-400 mt-2">Ganha em {formatDate(neg.date)}</p>
               </div>
             );
          })}
        </div>

        {/* Column 3: Lost */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600 uppercase tracking-widest text-xs">Perdidas</h3>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {data.negotiations.filter(n => n.status === NegotiationStatus.LOST).length}
            </span>
          </div>
          {data.negotiations.filter(n => n.status === NegotiationStatus.LOST).map(neg => {
             const customer = data.customers.find(c => c.id === neg.customerId);
             return (
               <div key={neg.id} className="bg-white/40 p-5 rounded-2xl border border-red-50 grayscale">
                 <h4 className="font-bold text-slate-500 line-through">{customer?.tradingName}</h4>
                 <p className="text-lg font-bold text-slate-400">{formatCurrency(neg.estimatedValue)}</p>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default NegotiationsList;
