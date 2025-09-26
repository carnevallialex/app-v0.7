import React from 'react';
import { Users, Briefcase, DollarSign, AlertTriangle, TrendingUp, Calendar, Activity } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { getDashboardStats } = useApp();
  const stats = getDashboardStats();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          <Activity className="h-4 w-4" />
          <span className="font-medium">Sistema Online</span>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Clientes"
          value={stats.totalClients}
          icon={Users}
          color="#8B4513"
          trend="+12% este mês"
        />
        <StatCard
          title="Projetos Ativos"
          value={stats.activeProjects}
          icon={Briefcase}
          color="#228B22"
        />
        <StatCard
          title="Faturamento Mensal"
          value={`R$ ${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="#DAA520"
          trend="+8% vs mês anterior"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value={`R$ ${stats.pendingPayments.toLocaleString()}`}
          icon={AlertTriangle}
          color="#DC2626"
        />
      </div>

      {/* Seção de Atividades Recentes e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-amber-600" />
              Atividades Recentes
            </h2>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'project' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status dos Projetos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-amber-600" />
              Status dos Projetos
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Orçamento</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Aprovado</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Em Produção</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Concluído</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas e Notificações */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800">Atenção Necessária</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-amber-700">
                • Projeto "Cozinha Sob Medida" deve ser finalizado em 10 dias
              </p>
              <p className="text-sm text-amber-700">
                • Aguardando aprovação do cliente Maria Santos
              </p>
              <p className="text-sm text-amber-700">
                • Falta material para 2 projetos - verificar estoque
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;