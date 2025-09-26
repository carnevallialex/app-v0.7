import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Wrench, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useApp, Material } from '../contexts/AppContext';
import MaterialModal from '../components/MaterialModal';

const Materials: React.FC = () => {
  const { materials, deleteMaterial } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const categories = [...new Set(materials.map(m => m.category))];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = (materialId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      deleteMaterial(materialId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
  };

  const getPriceVariation = (material: Material) => {
    if (material.price_history.length < 2) return null;
    
    const currentPrice = material.current_price;
    const previousPrice = material.price_history[material.price_history.length - 2].price;
    const variation = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    return {
      percentage: variation,
      isIncrease: variation > 0
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Materiais</h1>
          <p className="text-gray-600 mt-1">Controle seus materiais e componentes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Material</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar materiais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const priceVariation = getPriceVariation(material);
          const isLowStock = material.current_stock <= material.min_stock;
          
          return (
            <div key={material.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{material.name}</h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      {material.category}
                    </span>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{material.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estoque Atual:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                        {material.current_stock} {material.unit}
                      </span>
                      {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estoque Mínimo:</span>
                    <span className="font-medium text-gray-800">
                      {material.min_stock} {material.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Preço Atual:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-green-600">
                        R$ {material.current_price.toFixed(2)}
                      </span>
                      {priceVariation && (
                        <div className={`flex items-center space-x-1 ${
                          priceVariation.isIncrease ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {priceVariation.isIncrease ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="text-xs font-medium">
                            {Math.abs(priceVariation.percentage).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isLowStock && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Estoque Baixo</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Considere reabastecer este material
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-gray-400 mb-4">
              <Wrench className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchTerm || categoryFilter !== 'all' ? 'Nenhum material encontrado' : 'Nenhum material cadastrado'}
            </h3>
            <p className="text-gray-400">
              {searchTerm || categoryFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro material'
              }
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <MaterialModal
          material={editingMaterial}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Materials;