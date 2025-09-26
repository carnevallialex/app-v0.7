import React, { useState, useEffect } from 'react';
import { X, Package, FileText, Tag, Plus, Trash2, Search } from 'lucide-react';
import { useApp, Product, ProductComponent } from '../contexts/AppContext';

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct, materials } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'UN'
  });
  const [components, setComponents] = useState<ProductComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMaterialSearch, setShowMaterialSearch] = useState(false);

  const units = ['UN', 'M', 'M²', 'M³', 'KG', 'L', 'PC'];
  const categories = ['Portas', 'Gavetas', 'Prateleiras', 'Estruturas', 'Acessórios', 'Outros'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        unit: product.unit
      });
      setComponents(product.components);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      components
    };
    
    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addComponent = (materialId: string, materialName: string) => {
    const existingComponent = components.find(c => c.material_id === materialId);
    
    if (existingComponent) {
      setComponents(prev => prev.map(c => 
        c.material_id === materialId 
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      const material = materials.find(m => m.id === materialId);
      setComponents(prev => [...prev, {
        material_id: materialId,
        material_name: materialName,
        quantity: 1,
        unit: material?.unit || 'UN'
      }]);
    }
    
    setShowMaterialSearch(false);
    setSearchTerm('');
  };

  const updateComponentQuantity = (materialId: string, quantity: number) => {
    if (quantity <= 0) {
      removeComponent(materialId);
      return;
    }
    
    setComponents(prev => prev.map(c => 
      c.material_id === materialId 
        ? { ...c, quantity }
        : c
    ));
  };

  const removeComponent = (materialId: string) => {
    setComponents(prev => prev.filter(c => c.material_id !== materialId));
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-xl">
          <h2 className="text-2xl font-bold">
            {product ? 'Editar Produto' : 'Novo Produto'}
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
                <Package className="h-4 w-4 inline mr-2 text-amber-600" />
                Nome do Produto
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: Porta de Armário 40x60cm"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Descreva o produto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade de Medida
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
          </div>

          {/* Componentes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Componentes do Produto</h3>
              <button
                type="button"
                onClick={() => setShowMaterialSearch(true)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Material</span>
              </button>
            </div>

            {/* Lista de Componentes */}
            <div className="space-y-3">
              {components.map((component) => (
                <div key={component.material_id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{component.material_name}</h4>
                    <p className="text-sm text-gray-600">Unidade: {component.unit}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Qtd:</label>
                      <input
                        type="number"
                        value={component.quantity}
                        onChange={(e) => updateComponentQuantity(component.material_id, parseFloat(e.target.value))}
                        min="0.01"
                        step="0.01"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeComponent(component.material_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {components.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum componente adicionado</p>
                <p className="text-sm">Clique em "Adicionar Material" para começar</p>
              </div>
            )}
          </div>

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
              {product ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Busca de Materiais */}
      {showMaterialSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Selecionar Material</h3>
                <button
                  onClick={() => {
                    setShowMaterialSearch(false);
                    setSearchTerm('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
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
            </div>
            
            <div className="max-h-96 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredMaterials.map((material) => (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => addComponent(material.id, material.name)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{material.name}</h4>
                        <p className="text-sm text-gray-600">{material.description}</p>
                        <p className="text-xs text-gray-500">Categoria: {material.category} | Unidade: {material.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          Estoque: {material.current_stock} {material.unit}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredMaterials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum material encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;