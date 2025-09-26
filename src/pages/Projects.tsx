import React, { useState } from 'react';
import { Plus, Search, Calendar, User, DollarSign, Clock, CreditCard as Edit2, Trash2, FileText, Download, Filter } from 'lucide-react';
import { useApp, Project } from '../contexts/AppContext';
import ProjectModal from '../components/ProjectModal';

const Projects: React.FC = () => {
  const { projects, deleteProject } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      orcamento: 'bg-blue-100 text-blue-800',
      aprovado: 'bg-yellow-100 text-yellow-800',
      em_producao: 'bg-orange-100 text-orange-800',
      concluido: 'bg-green-100 text-green-800',
      entregue: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      orcamento: 'Orçamento',
      aprovado: 'Aprovado',
      em_producao: 'Em Produção',
      concluido: 'Concluído',
      entregue: 'Entregue'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeColor = (type: string) => {
    return type === 'orcamento' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getTypeText = (type: string) => {
    return type === 'orcamento' ? 'Orçamento' : 'Venda';
  };

  const generatePDF = async (project: Project) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Configurações da empresa
    const companyInfo = {
      name: 'CARNEVALLI ESQUADRIAS LTDA',
      address: 'BUARQUE DE MACEDO, 2735 - PAVILHÃO - CENTRO',
      city: 'Nova Prata - RS - CEP: 95320-000',
      phone: '(54) 3242-2072',
      email: 'carnevalli.esquadrias@gmail.com',
      cnpj: '88.235.288/0001-24',
      ie: '0850011930'
    };
    
    // Adicionar marca d'água (logo transparente no fundo)
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/Logo2.png';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          // Criar canvas para processar a imagem
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = logoImg.width;
          canvas.height = logoImg.height;
          
          // Desenhar a imagem com transparência
          ctx.globalAlpha = 0.08;
          ctx.drawImage(logoImg, 0, 0);
          
          // Converter para base64
          const watermarkData = canvas.toDataURL('image/png');
          
          // Adicionar marca d'água centralizada
          const imgWidth = 80;
          const imgHeight = 80;
          const x = (210 - imgWidth) / 2;
          const y = (297 - imgHeight) / 2;
          
          doc.addImage(watermarkData, 'PNG', x, y, imgWidth, imgHeight);
          resolve(true);
        };
        logoImg.onerror = () => resolve(false);
      });
    } catch (error) {
      console.log('Logo não encontrado, continuando sem marca d\'água');
    }
    
    // Cabeçalho com fundo azul
    doc.setFillColor(70, 130, 180);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Adicionar logo no cabeçalho
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/Logo2.png';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          doc.addImage(logoImg, 'PNG', 15, 5, 25, 25);
          resolve(true);
        };
        logoImg.onerror = () => resolve(false);
      });
    } catch (error) {
      console.log('Logo não encontrado no cabeçalho');
    }
    
    // Nome da empresa
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, 45, 18);
    
    // Informações de contato
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.address, 45, 24);
    doc.text(companyInfo.city, 45, 28);
    
    // Informações de contato no lado direito
    doc.text(companyInfo.phone, 140, 18);
    doc.text(companyInfo.email, 140, 22);
    doc.text(`CNPJ: ${companyInfo.cnpj}`, 140, 26);
    doc.text(`IE: ${companyInfo.ie}`, 140, 30);
    
    // Título do documento
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const docTitle = project.type === 'orcamento' ? 'ORÇAMENTO' : 'PROPOSTA COMERCIAL';
    doc.text(docTitle, 20, 48);
    
    // Número do projeto
    doc.setFontSize(11);
    doc.text(`Nº ${project.number.toString().padStart(4, '0')}`, 160, 48);
    
    // Informações do cliente (mais compacto)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', 20, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${project.client_name}`, 20, 68);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 140, 68);
    
    // Descrição do projeto (mais compacto)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIÇÃO', 20, 78);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${project.title}`, 20, 86);
    
    // Quebra de linha para descrição longa
    const splitDescription = doc.splitTextToSize(project.description, 170);
    doc.text(splitDescription, 20, 92);
    
    let yPosition = 92 + (splitDescription.length * 4) + 10;
    
    // Produtos/Serviços
    if (project.products && project.products.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PRODUTOS/SERVIÇOS', 20, yPosition);
      yPosition += 10;
      
      // Cabeçalho da tabela
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Qt.', 20, yPosition);
      doc.text('Produto/Serviço', 35, yPosition);
      doc.text('Detalhe do item', 90, yPosition);
      doc.text('Valor unitário', 140, yPosition);
      doc.text('Subtotal', 175, yPosition);
      yPosition += 4;
      
      // Linha separadora
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;
      
      // Itens
      doc.setFont('helvetica', 'normal');
      project.products.forEach((product) => {
        doc.text(product.quantity.toString(), 20, yPosition);
        doc.text(product.product_name, 35, yPosition);
        // Descrição do produto (se houver)
        doc.setFontSize(7);
        doc.text('Produto personalizado conforme especificação', 35, yPosition + 3);
        doc.setFontSize(9);
        doc.text(`${product.unit_price.toFixed(2).replace('.', ',')}`, 140, yPosition);
        doc.text(`${product.total_price.toFixed(2).replace('.', ',')}`, 175, yPosition);
        yPosition += 7;
      });
      
      // Totais
      yPosition += 8;
      doc.line(140, yPosition, 190, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Total', 140, yPosition);
      doc.text(`${project.budget.toFixed(2).replace('.', ',')}`, 175, yPosition);
      yPosition += 5;
      
      if (project.payment_terms?.discount_percentage && project.payment_terms.discount_percentage > 0) {
        doc.text('Descontos', 140, yPosition);
        const discountAmount = project.budget * (project.payment_terms.discount_percentage / 100);
        doc.text(`${discountAmount.toFixed(2).replace('.', ',')}`, 175, yPosition);
        yPosition += 5;
        
        doc.text('Valor líquido', 140, yPosition);
        const finalValue = project.payment_terms.total_with_discount || (project.budget - discountAmount);
        doc.text(`${finalValue.toFixed(2).replace('.', ',')}`, 175, yPosition);
        yPosition += 5;
      }
    }
    
    // Condições de pagamento
    yPosition += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Condição de pagamento:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (project.payment_terms) {
      const paymentMethodLabels: { [key: string]: string } = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'cartao_credito': 'Cartão de Crédito',
        'cartao_debito': 'Cartão de Débito',
        'boleto': 'Boleto',
        'transferencia': 'Transferência'
      };
      
      doc.text(`Forma de Pagamento: ${paymentMethodLabels[project.payment_terms.payment_method]}`, 20, yPosition);
      yPosition += 6;
      
      // Tabela de parcelas
      if (project.payment_terms.installments > 1) {
        yPosition += 4;
        doc.setFont('helvetica', 'bold');
        doc.text('Nº', 20, yPosition);
        doc.text('Vencimento', 50, yPosition);
        doc.text('Valor (R$)', 120, yPosition);
        yPosition += 6;
        
        doc.setFont('helvetica', 'normal');
        for (let i = 1; i <= project.payment_terms.installments; i++) {
          const installmentDate = new Date();
          installmentDate.setMonth(installmentDate.getMonth() + (i - 1));
          
          doc.text(`${i}º`, 20, yPosition);
          doc.text(installmentDate.toLocaleDateString('pt-BR'), 50, yPosition);
          doc.text(`${(project.payment_terms.installment_value || 0).toFixed(2).replace('.', ',')}`, 120, yPosition);
          yPosition += 5;
        }
      } else {
        yPosition += 4;
        doc.setFont('helvetica', 'bold');
        doc.text('Nº', 20, yPosition);
        doc.text('Vencimento', 50, yPosition);
        doc.text('Valor (R$)', 120, yPosition);
        yPosition += 6;
        
        doc.setFont('helvetica', 'normal');
        doc.text('1º', 20, yPosition);
        doc.text(new Date().toLocaleDateString('pt-BR'), 50, yPosition);
        const finalAmount = project.payment_terms.total_with_discount || project.budget;
        doc.text(`${finalAmount.toFixed(2).replace('.', ',')}`, 120, yPosition);
      }
    }
    
    // Rodapé
    yPosition = 275; // Posição fixa para o rodapé
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Este orçamento tem validade de 30 dias.', 20, yPosition);
    doc.text('Agradecemos a preferência!', 20, yPosition + 4);
    
    // Linha no rodapé
    doc.line(20, yPosition + 12, 190, yPosition + 12);
    doc.text('Página 1 de 1', 170, yPosition + 16);
    
    // Salvar o PDF
    const docType = project.type === 'orcamento' ? 'Orcamento' : 'Venda';
    const fileName = `${project.client_name?.replace(/\s+/g, '_')} - ${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')} - ${docType}${project.number}.pdf`;
    doc.save(fileName);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(projectId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Projetos</h1>
          <p className="text-gray-600 mt-1">Acompanhe todos os seus projetos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filtros:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">Todos os Tipos</option>
            <option value="orcamento">Orçamentos</option>
            <option value="venda">Vendas</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value="orcamento">Orçamento</option>
            <option value="aprovado">Aprovado</option>
            <option value="em_producao">Em Produção</option>
            <option value="concluido">Concluído</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                    <span className="text-sm text-gray-500">#{project.number.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(project.type)}`}>
                      {getTypeText(project.type)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => generatePDF(project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Gerar PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">{project.client_name}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">R$ {project.budget.toLocaleString()}</span>
                    {project.payment_terms && project.payment_terms.discount_percentage > 0 && (
                      <span className="text-xs text-green-600">
                        Com desconto: R$ {project.payment_terms.total_with_discount?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                {project.payment_terms && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {project.payment_terms.installments}x de R$ {project.payment_terms.installment_value?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">
                      {new Date(project.start_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">
                      até {new Date(project.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de progresso baseada no status */}
            <div className="px-6 pb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    project.status === 'orcamento' ? 'bg-blue-500 w-1/5' :
                    project.status === 'aprovado' ? 'bg-yellow-500 w-2/5' :
                    project.status === 'em_producao' ? 'bg-orange-500 w-3/5' :
                    project.status === 'concluido' ? 'bg-green-500 w-4/5' :
                    'bg-purple-500 w-full'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro projeto'
              }
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Projects;