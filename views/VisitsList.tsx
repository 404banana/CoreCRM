
import React from 'react';
import { useCoreStore } from '../hooks/useCoreStore';
import { formatDate } from '../utils/format';

const VisitsList: React.FC = () => {
  const { data } = useCoreStore();

  const sortedVisits = [...data.visits].sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agenda de Visitas</h2>
          <p className="text-slate-500">Organize seu roteiro de atendimentos.</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all active:scale-95">
          Agendar Visita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Próximas Visitas
          </h3>
          {sortedVisits.filter(v => !v.isCompleted).map(visit => {
            const customer = data.customers.find(c => c.id === visit.customerId);
            return (
              <div key={visit.id} className="bg-white p-5 rounded-2xl border-l-4 border-indigo-500 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-600">{formatDate(visit.date)}</p>
                  <h4 className="font-bold text-slate-900 text-lg">{customer?.tradingName}</h4>
                  <p className="text-sm text-slate-500 mt-1 italic">"{visit.notes}"</p>
                </div>
                <button className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                  Check-in
                </button>
              </div>
            );
          })}
          {sortedVisits.filter(v => !v.isCompleted).length === 0 && (
             <div className="p-10 text-center bg-slate-100 rounded-2xl border border-dashed border-slate-300 text-slate-400">
                Nenhuma visita agendada.
             </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
             <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
             Histórico Recente
          </h3>
          <div className="space-y-4">
            {sortedVisits.filter(v => v.isCompleted).map(visit => {
              const customer = data.customers.find(c => c.id === visit.customerId);
              return (
                <div key={visit.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm opacity-75">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">CONCLUÍDA</span>
                    <span className="text-xs text-slate-400">{formatDate(visit.date)}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{customer?.tradingName}</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{visit.notes}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitsList;
