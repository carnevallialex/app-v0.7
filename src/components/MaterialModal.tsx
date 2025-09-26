import React, { useState, useEffect } from 'react';
import { X, Wrench, FileText, Tag, DollarSign, Package } from 'lucide-react';
import { useApp, Material } from '../contexts/AppContext';

interface MaterialModalProps {
  material?: Material | null;
  onClose: () => void;
}

const MaterialModal: React.FC<MaterialModalProps> = ({ material, onClose }) => {
  const { addMaterial, updateMaterial } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'UN',
    current_stock: '',
    min_stock: '',
    current_price: ''
  });

  const units = ['UN', 'M', 'M²', 'M³', 'KG', 'L', 'PC'];
  const categories = ['Painéis', 'Ferragens', 'Madeiras', 'Vernizes', 'Colas', 'Parafusos', 'Outros'];

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        description: material.description,
        category: material.category,
        unit: material.unit,
        current_stock: material.current_stock.toString(),
        min_stock: material.min_stock.toString(),
        current_price: material.current_price.toString()
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const materialData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      unit: formData.unit,
      current_stock: parseFloat(formData.current_stock),
      min_stock: parseFloat(formData.min_stock),
      current_price: parseFloat(formData.current_price),
      price_history: material?.price_history || [
        {
          date: new Date().toISOString().split('T')[0],
          price: parseFloat(formData.current_price)
        }
      ]
    };
    
    if (material) {
      // Se o preço mudou, adiciona ao histórico
      if (material.current_price !== parseFloat(formData.current_price)) {
        materialData.price_history = [
          ...material.price_history,
          {
            date: new Date().toISOString().split('T')[0],
            price: parseFloat(formData.current_price)
          }
        ];
      }
      updateMaterial(material.id, materialData);
    } else {
      addMaterial(materialData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-xl">
          <h2 className="text-2xl font-bold">
            {material ? 'Editar Material' : 'Novo Material'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wrench className="h-4 w-4 inline mr-2 text-amber-600" />
                Nome do Material
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: MDF 15mm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-2 text-amber-600" />
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2 text-amber-600" />
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Descreva o material..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-2 text-amber-600" />
                Unidade
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque Atual
              </label>
              <input
                type="number"
                name="current_stock"
                value={formData.current_stock}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque Mínimo
              </label>
              <input
                type="number"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-2 text-green-600" />
              Preço Atual (R$)
            </label>
            <input
              type="number"
              name="current_price"
              value={formData.current_price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="0,00"
            />
          </div>

          {material && material.price_history.length > 1 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Histórico de Preços</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {material.price_history.slice(-5).reverse().map((history, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {new Date(history.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="font-medium text-gray-800">
                      R$ {history.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {material ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;