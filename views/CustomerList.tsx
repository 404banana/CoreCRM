
import React, { useState, useMemo } from 'react';
import { useCoreStore } from '../hooks/useCoreStore';
import { formatCurrency, formatDate, calculateDaysPassed } from '../utils/format';
import { Customer } from '../types';

const CustomerList: React.FC = () => {
  const { data, addCustomer } = useCoreStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const industries = useMemo(() => {
    const list = Array.from(new Set(data.customers.map(c => c.industry)));
    return ['All', ...list];
  }, [data.customers]);

  const filteredCustomers = data.customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.tradingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.cnpj.includes(searchTerm);
    const matchesIndustry = industryFilter === 'All' || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h2>
          <p className="text-slate-500">Mantenha sua carteira sempre atualizada.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Buscar por nome, razão social ou CNPJ..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="w-full md:w-64 py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="All">Todos os Ramos</option>
          {industries.filter(i => i !== 'All').map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ramo / CNPJ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Última Compra</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map(customer => {
                const days = calculateDaysPassed(customer.lastPurchaseDate);
                const isInactive = days > 60;
                
                return (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isInactive ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {customer.tradingName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{customer.tradingName}</p>
                          <p className="text-xs text-slate-400">{customer.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-slate-600">{customer.industry}</p>
                      <p className="text-xs text-slate-400">{customer.cnpj}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {isInactive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-100">
                          <i className="fa-solid fa-circle text-[6px]"></i> Inativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <i className="fa-solid fa-circle text-[6px]"></i> Ativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{formatCurrency(customer.lastPurchaseValue)}</p>
                      <p className="text-xs text-slate-400">{formatDate(customer.lastPurchaseDate)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <i className="fa-brands fa-whatsapp"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-users-slash text-4xl"></i>
            </div>
            <h4 className="text-slate-600 font-bold text-lg">Nenhum cliente encontrado</h4>
            <p className="text-slate-400">Tente ajustar seus filtros ou realizar uma nova busca.</p>
          </div>
        )}
      </div>

      {/* Basic Mock Modal for Adding Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Novo Cadastro de Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
               <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Razão Social</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Silva ME" />
               </div>
               <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Fantasia</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Silva Têxtil" />
               </div>
               <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">CNPJ</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="00.000.000/0001-00" />
               </div>
               <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ramo de Atividade</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>Têxtil</option>
                  <option>Alimentos</option>
                  <option>Tecnologia</option>
                  <option>Varejo</option>
                </select>
               </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-all">Cancelar</button>
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-all">Salvar Cliente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
