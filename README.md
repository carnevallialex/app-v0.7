# Sistema de Gerenciamento para Marcenaria

Um sistema completo de gerenciamento para empresas de marcenaria sob medida, com módulos integrados para clientes, projetos e finanças.

## 🚀 Funcionalidades

### Dashboard Executivo
- Métricas em tempo real
- Gráficos de status dos projetos
- Atividades recentes
- Alertas e notificações automáticas

### Gestão de Clientes
- Cadastro completo de clientes
- Histórico de projetos por cliente
- Busca avançada
- Estatísticas automáticas

### Controle de Projetos
- Gerenciamento completo do ciclo de vida
- Status automático (Orçamento → Aprovado → Em Produção → Concluído → Entregue)
- Cálculo automático de custos e margem de lucro
- Timeline e prazos

### Módulo Financeiro
- Controle de entradas e saídas
- Transações automáticas baseadas nos projetos
- Relatórios financeiros em tempo real
- Categorização inteligente

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para executar localmente:

1. **Clone ou baixe o projeto**
   ```bash
   # Se você clonou do repositório
   git clone [url-do-repositorio]
   cd sistema-marcenaria
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Abra no navegador**
   - O sistema estará disponível em: `http://localhost:5173`
   - O terminal mostrará a URL exata

### Comandos disponíveis:

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎯 Como usar o sistema

### 1. Dashboard
- Visualize métricas gerais do negócio
- Acompanhe atividades recentes
- Monitore alertas importantes

### 2. Gestão de Clientes
- Clique em "Novo Cliente" para adicionar
- Use a barra de busca para encontrar clientes
- Edite ou exclua clientes conforme necessário

### 3. Projetos
- Crie novos projetos vinculados aos clientes
- O sistema automaticamente:
  - Gera transação de sinal (50% do valor)
  - Atualiza estatísticas do cliente
  - Cria timeline do projeto

### 4. Finanças
- Visualize o fluxo de caixa em tempo real
- Adicione transações manuais quando necessário
- Use filtros para análises específicas

## 🔄 Automações do Sistema

### Ao criar um projeto:
- ✅ Gera automaticamente transação de entrada (sinal de 50%)
- ✅ Atualiza contador de projetos do cliente
- ✅ Atualiza valor total do cliente
- ✅ Adiciona à atividade recente

### Ao alterar status do projeto:
- ✅ Quando marcado como "Concluído": gera transação do pagamento final (50% restante)
- ✅ Atualiza métricas do dashboard
- ✅ Registra na atividade recente

### Ao excluir cliente:
- ✅ Remove automaticamente todos os projetos relacionados
- ✅ Remove transações vinculadas aos projetos

## 🎨 Personalização

O sistema usa uma paleta de cores inspirada em madeira:
- **Primária**: Tons de âmbar/marrom (#8B4513)
- **Secundária**: Verde para valores positivos (#22C55E)
- **Terciária**: Vermelho para valores negativos (#EF4444)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Sidebar.tsx     # Menu lateral
│   ├── ClientModal.tsx # Modal de clientes
│   ├── ProjectModal.tsx # Modal de projetos
│   └── TransactionModal.tsx # Modal de transações
├── contexts/           # Context API
│   └── AppContext.tsx  # Estado global da aplicação
├── pages/              # Páginas principais
│   ├── Dashboard.tsx   # Dashboard executivo
│   ├── Clients.tsx     # Gestão de clientes
│   ├── Projects.tsx    # Gestão de projetos
│   └── Finance.tsx     # Módulo financeiro
├── App.tsx             # Componente principal
└── main.tsx           # Ponto de entrada
```

## 📊 Dados de Demonstração

O sistema vem com dados de exemplo para facilitar os testes:
- 2 clientes cadastrados
- 2 projetos em andamento
- Transações de exemplo
- Métricas calculadas automaticamente

## 🆘 Suporte

Se encontrar algum problema:
1. Verifique se todas as dependências foram instaladas
2. Certifique-se de que está usando Node.js 16+
3. Tente limpar o cache: `npm run build` e depois `npm run dev`

## 📈 Próximas Funcionalidades

- [ ] Relatórios em PDF
- [ ] Backup automático
- [ ] Integração com WhatsApp
- [ ] Sistema de orçamentos
- [ ] Controle de estoque
- [ ] App mobile

---

**Desenvolvido para otimizar a gestão de marcenarias sob medida** 🪵