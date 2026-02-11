
import React from 'react';
import { useCoreStore } from '../hooks/useCoreStore';
import { formatCurrency, formatDate } from '../utils/format';
import { OrderStatus } from '../types';

const OrdersList: React.FC = () => {
  const { data } = useCoreStore();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CLOSED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case OrderStatus.NEGOTIATION: return 'bg-blue-50 text-blue-700 border-blue-100';
      case OrderStatus.LOST: return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Histórico de Pedidos</h2>
          <p className="text-slate-500">Acompanhe todos os fechamentos e negociações.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-tighter">Total Acumulado:</span>
          <span className="text-lg font-bold text-indigo-600">{formatCurrency(data.orders.reduce((a, b) => a + b.value, 0))}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.orders.sort((a,b) => b.date.localeCompare(a.date)).map(order => {
          const customer = data.customers.find(c => c.id === order.customerId);
          return (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-xs font-mono text-slate-400">#{order.id.split('-')[0].toUpperCase()}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">{customer?.tradingName || 'Cliente Excluído'}</h4>
              <p className="text-sm text-slate-500 mb-4">{formatDate(order.date)}</p>
              
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Valor do Pedido</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(order.value)}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersList;
