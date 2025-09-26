import React from 'react';
import { Home, Users, Briefcase, DollarSign, Hammer, Package, Wrench, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'materials', label: 'Materiais', icon: Wrench },
    { id: 'stock', label: 'Estoque', icon: BarChart3 },
    { id: 'finance', label: 'Finanças', icon: DollarSign },
    ...(user?.role === 'admin' ? [{ id: 'settings', label: 'Configurações', icon: Settings }] : []),
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-amber-900 via-amber-800 to-orange-900 text-white shadow-2xl backdrop-blur-sm">
      <div className="p-6 border-b border-amber-700/50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl p-3 shadow-lg">
            <Hammer className="h-7 w-7 text-amber-800" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white drop-shadow-sm">MarcenariaPro</h1>
            <p className="text-sm text-amber-200/90">Gestão Completa</p>
          </div>
        </div>
        
        {/* Informações do usuário */}
        <div className="mt-4 pt-4 border-t border-amber-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-amber-200/80">
                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 text-left transition-all duration-300 rounded-xl hover:bg-amber-700/70 hover:shadow-lg hover:translate-x-1 ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-amber-700 to-orange-600 text-white shadow-lg transform translate-x-1'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-amber-700/50 bg-gradient-to-t from-amber-900/50 space-y-3">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-300 rounded-xl hover:bg-red-600/70 hover:shadow-lg text-amber-100 hover:text-white"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium text-sm">Sair do Sistema</span>
        </button>
        
        <div className="text-center text-amber-200/80">
          <p className="text-xs">Sistema de Gestão</p>
          <p className="text-xs">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;