
import React from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const menuItems = [
    { path: '/', icon: 'fa-gauge-high', label: 'Dashboard' },
    { path: '/customers', icon: 'fa-users', label: 'Clientes' },
    { path: '/orders', icon: 'fa-receipt', label: 'Pedidos' },
    { path: '/visits', icon: 'fa-calendar-check', label: 'Visitas' },
    { path: '/negotiations', icon: 'fa-handshake', label: 'Negociações' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800">
      {/* Tablet Optimized Sidebar (Drawer style) */}
      <nav className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-rocket text-xl"></i>
          </div>
          <span className="hidden md:block font-bold text-xl text-slate-900 tracking-tight">CoreCRM</span>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 transition-colors
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              <i className={`fa-solid ${item.icon} w-6 text-lg text-center`}></i>
              <span className="hidden md:block">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="hidden md:flex items-center gap-3 mb-4">
            <img src="https://picsum.photos/seed/rep1/100" className="w-10 h-10 rounded-full border border-slate-200" alt="Rep Profile" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">Vendedor Senior</span>
              <span className="text-xs text-slate-400">Offline Ready</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="hidden md:block">Sair</span>
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-600">Representante Comercial</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <i className="fa-solid fa-bell text-slate-400 text-lg cursor-pointer"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Sincronizado
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
