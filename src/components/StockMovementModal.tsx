import React, { useState } from 'react';
import { X, Package, Calendar, DollarSign, Search, Briefcase } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface StockMovementModalProps {
  onClose: () => void;
}

const StockMovementModal: React.FC<StockMovementModalProps> = ({ onClose }) => {
  const { materials, projects, addStockMovement } = useApp();
  const [formData, setFormData] = useState({
    material_id: '',
    type: 'entrada' as 'entrada' | 'saida',
    quantity: '',
    unit_price: '',
    project_id: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [materialSearch, setMaterialSearch] = useState('');

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
    material.description.toLowerCase().includes(materialSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const material = materials.find(m => m.id === formData.material_id);
    const project = projects.find(p => p.id === formData.project_id);
    
    if (!material) return;
    
    const quantity = parseFloat(formData.quantity);
    const unitPrice = formData.unit_price ? parseFloat(formData.unit_price) : undefined;
    
    const movementData = {
      material_id: formData.material_id,
      material_name: material.name,
      type: formData.type,
      quantity,
      unit_price: unitPrice,
      total_value: unitPrice ? quantity * unitPrice : undefined,
      project_id: formData.project_id || undefined,
      project_title: project?.title,
      date: formData.date
    };
    
    addStockMovement(movementData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectedMaterial = materials.find(m => m.id === formData.material_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <h2 className="text-2xl font-bold">Nova Movimentação de Estoque</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Movimentação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Movimentação
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="entrada"
                  checked={formData.type === 'entrada'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-green-700">Entrada</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="saida"
                  checked={formData.type === 'saida'}
                  onChange={handleChange}
                  className="mr-2 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-red-700">Saída</span>
              </label>
            </div>
          </div>

          {/* Seleção de Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-2 text-blue-600" />
              Material
            </label>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar material..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                name="material_id"
                value={formData.material_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um material</option>
                {filteredMaterials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name} - Estoque: {material.current_stock} {material.unit}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedMaterial && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Estoque atual:</strong> {selectedMaterial.current_stock} {selectedMaterial.unit}
                </p>
                <p className="text-sm text-blue-600">{selectedMaterial.description}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2 text-blue-600" />
                Data
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {formData.type === 'entrada' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2 text-green-600" />
                Preço Unitário (R$) - Opcional
              </label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="h-4 w-4 inline mr-2 text-blue-600" />
              Projeto (opcional)
            </label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um projeto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  #{project.number} - {project.title}
                </option>
              ))}
            </select>
          </div>

          {formData.quantity && formData.unit_price && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Valor Total:</span>
                <span className="font-bold text-green-800">
                  R$ {(parseFloat(formData.quantity) * parseFloat(formData.unit_price)).toFixed(2)}
                </span>
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
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                formData.type === 'entrada'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              }`}
            >
              Registrar Movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementModal;