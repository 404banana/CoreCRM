
import React, { useState } from 'react';
import { useCoreStore } from '../hooks/useCoreStore';
import { calculateDaysPassed, formatCurrency, formatDate } from '../utils/format';
import { OrderStatus, NegotiationStatus } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { data, updateTargets } = useCoreStore();
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [targetForm, setTargetForm] = useState(data.targets);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Statistics for the current month
  const monthlyOrders = data.orders.filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status === OrderStatus.CLOSED;
  });
  
  const currentSalesTotal = monthlyOrders.reduce((acc, curr) => acc + curr.value, 0);
  
  const newCustomersThisMonth = data.customers.filter(c => {
    const d = new Date(c.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Simplified "Recovered" logic: Customer who bought this month and had their PREVIOUS purchase > 60 days before the current month
  // For the demo, we'll just check if their lastPurchaseDate is this month but they were considered inactive before.
  const recoveredCustomersThisMonth = data.customers.filter(c => {
    const d = new Date(c.lastPurchaseDate);
    const isThisMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    // Mocking logic: if lastPurchaseValue was > 0 and the gap was large
    // In a real app we'd look at order history.
    return isThisMonth && c.id === '2'; // Mocking ID 2 as recovered for visuals
  });

  const activeNegotiations = data.negotiations.filter(n => n.status === NegotiationStatus.OPEN);
  const totalNegotiationValue = activeNegotiations.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  
  const inactiveCustomers = data.customers.filter(c => calculateDaysPassed(c.lastPurchaseDate) > 60);

  const salesProgress = Math.min((currentSalesTotal / data.targets.salesValue) * 100, 100);
  const newCustProgress = Math.min((newCustomersThisMonth.length / data.targets.newCustomers) * 100, 100);
  const recovCustProgress = Math.min((recoveredCustomersThisMonth.length / data.targets.recoveredCustomers) * 100, 100);

  const handleSaveTargets = () => {
    updateTargets(targetForm);
    setIsEditingTargets(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Bom dia, Representante</h2>
          <p className="text-slate-500 mt-1">Status do mês de {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(now)}.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditingTargets(true)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-bullseye"></i> Ajustar Metas
          </button>
          <Link to="/negotiations" className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 font-medium transition-all shadow-md flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> Nova Negociação
          </Link>
        </div>
      </div>

      {/* Monthly Targets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Target Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Meta de Venda Mensal</h3>
              <span className="text-indigo-600 font-bold">{salesProgress.toFixed(0)}%</span>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(currentSalesTotal)}</p>
            <p className="text-slate-400 text-sm">de {formatCurrency(data.targets.salesValue)}</p>
          </div>
          <div className="mt-8">
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${salesProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* New Customers Target */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Novos Clientes</h3>
              <span className="text-emerald-600 font-bold">{newCustomersThisMonth.length}/{data.targets.newCustomers}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                    <i className="fa-solid fa-user-plus"></i>
                </div>
                <div>
                    <p className="text-3xl font-black text-slate-900">{newCustomersThisMonth.length}</p>
                    <p className="text-slate-400 text-sm">Convertidos este mês</p>
                </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${newCustProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recovered Customers Target */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recuperação de Inativos</h3>
              <span className="text-amber-600 font-bold">{recoveredCustomersThisMonth.length}/{data.targets.recoveredCustomers}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                    <i className="fa-solid fa-arrows-rotate"></i>
                </div>
                <div>
                    <p className="text-3xl font-black text-slate-900">{recoveredCustomersThisMonth.length}</p>
                    <p className="text-slate-400 text-sm">Reativados este mês</p>
                </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                style={{ width: `${recovCustProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts & Pipeline Summary */}
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
                <i className="fa-solid fa-bolt text-indigo-500"></i> Resumo de Oportunidades
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Em Negociação</p>
                    <p className="text-2xl font-black text-slate-900">{formatCurrency(totalNegotiationValue)}</p>
                    <p className="text-xs text-indigo-600 font-semibold mt-1">{activeNegotiations.length} propostas ativas</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Inativos no Radar</p>
                    <p className="text-2xl font-black text-slate-900">{inactiveCustomers.length}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1">Foco em recuperação</p>
                </div>
            </div>

            {/* Inactive Customers Alert */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <i className="fa-solid fa-clock-rotate-left text-amber-500"></i>
                    Prioridade de Recuperação
                    </h3>
                    <Link to="/customers" className="text-indigo-600 text-sm font-medium hover:underline">Ver todos</Link>
                </div>
                <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
                    {inactiveCustomers.slice(0, 4).map(customer => (
                    <div key={customer.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors">
                        <div>
                        <p className="font-semibold text-slate-900">{customer.tradingName}</p>
                        <p className="text-xs text-slate-400">Sem pedidos há {calculateDaysPassed(customer.lastPurchaseDate)} dias</p>
                        </div>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <i className="fa-solid fa-calendar-plus"></i>
                        </button>
                    </div>
                    ))}
                    {inactiveCustomers.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic">Ótimo trabalho! Sem clientes inativos.</div>
                    )}
                </div>
            </div>
        </div>

        {/* Recent Open Negotiations (Kanban Style Preview) */}
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
                <i className="fa-solid fa-handshake text-indigo-500"></i> Pipeline Ativo
            </h3>
            <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/60 min-h-[460px]">
                <div className="space-y-4">
                    {activeNegotiations.length > 0 ? activeNegotiations.map(neg => {
                        const customer = data.customers.find(c => c.id === neg.customerId);
                        return (
                            <div key={neg.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{customer?.tradingName}</h4>
                                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">ABERTA</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">"{neg.notes}"</p>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                    <p className="font-black text-slate-900">{formatCurrency(neg.estimatedValue)}</p>
                                    <Link to="/negotiations" className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Focar</Link>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                             <i className="fa-solid fa-folder-open text-4xl mb-4 opacity-20"></i>
                             <p>Nenhuma negociação em curso</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Targets Edit Modal */}
      {isEditingTargets && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Configurar Metas do Mês</h3>
              <button onClick={() => setIsEditingTargets(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Meta de Venda (R$)</label>
                    <input 
                        type="number" 
                        value={targetForm.salesValue} 
                        onChange={(e) => setTargetForm({ ...targetForm, salesValue: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Novos Clientes</label>
                        <input 
                            type="number" 
                            value={targetForm.newCustomers} 
                            onChange={(e) => setTargetForm({ ...targetForm, newCustomers: Number(e.target.value) })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Recuperados</label>
                        <input 
                            type="number" 
                            value={targetForm.recoveredCustomers} 
                            onChange={(e) => setTargetForm({ ...targetForm, recoveredCustomers: Number(e.target.value) })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                    </div>
                </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsEditingTargets(false)} className="px-6 py-2 text-slate-600 font-semibold">Cancelar</button>
              <button onClick={handleSaveTargets} className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">Salvar Configurações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
