# 📊 VLUMA Dashboard

Dashboard interno para gestão e controle de leads da VLUMA. Sistema completo para visualizar métricas, gerenciar leads, agendar reuniões e enviar e-mails.

## 🎯 Funcionalidades

- **📈 Dashboard Principal** - Métricas e KPIs em tempo real
- **👥 Gestão de Leads** - Visualizar, editar, excluir e gerenciar leads
- **📅 Sistema de Agendamento** - Calendário integrado para reuniões
- **📧 Email Marketing** - Templates e disparos automatizados
- **📊 Analytics** - Relatórios detalhados e insights
- **⚙️ Configurações** - Personalização do sistema

## 🚀 Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **UI Library:** Shadcn/ui + Radix UI
- **Styling:** TailwindCSS com paleta VLUMA
- **Animações:** Framer Motion
- **Database:** Supabase
- **State Management:** TanStack Query
- **Charts:** Recharts
- **Icons:** Lucide React

## 🎨 Design System

- **Paleta de Cores:** Identidade visual VLUMA
- **Tema:** Dark mode por padrão
- **Tipografia:** Inter
- **Logo:** Integrada com animações
- **Componentes:** Consistentes com projetos VLUMA

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/VlumaOficial/vluma-dashboard.git

# Instalar dependências
cd vluma-dashboard
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais do Supabase

# Executar em desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── page.tsx           # Dashboard principal
│   ├── leads/             # Gestão de leads
│   ├── calendar/          # Agendamentos
│   ├── emails/            # Email marketing
│   └── analytics/         # Relatórios
├── components/
│   ├── ui/                # Componentes Shadcn/ui
│   └── dashboard/         # Componentes específicos
├── lib/
│   ├── supabase.ts        # Configuração do banco
│   └── utils.ts           # Utilitários
└── hooks/                 # Custom hooks
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema

O dashboard utiliza as mesmas tabelas do projeto leads:
- `contatos` - Dados dos leads
- `respostas_questionario` - Respostas do formulário

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Build do projeto
npm run build

# Deploy automático via GitHub
# Conecte o repositório no Vercel Dashboard
```

### Outras Plataformas

```bash
# Build de produção
npm run build

# Iniciar servidor
npm start
```

## 📊 Componentes Principais

### StatsCard
Cards de métricas com animações e gradientes

### Sidebar
Navegação lateral com logo VLUMA animado

### Header
Cabeçalho com busca e notificações

### DashboardLayout
Layout wrapper para todas as páginas

## 🔗 Integração com Supabase

- **Real-time:** Updates automáticos
- **Auth:** Sistema de autenticação (opcional)
- **Database:** Consultas otimizadas
- **Storage:** Upload de arquivos

## 📈 Métricas Disponíveis

- Total de leads
- Taxa de conversão
- Agendamentos realizados
- Leads por origem
- Performance temporal

## 🎯 Roadmap

- [ ] Conectar dados reais do Supabase
- [ ] Implementar CRUD completo de leads
- [ ] Sistema de agendamento com Google Calendar
- [ ] Templates de email personalizáveis
- [ ] Relatórios avançados com filtros
- [ ] Notificações em tempo real
- [ ] Export de dados (PDF/Excel)
- [ ] Dashboard mobile responsivo

## 👥 Contribuição

Este é um projeto interno da VLUMA. Para contribuições:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Projeto interno da VLUMA. Todos os direitos reservados.

## 🆘 Suporte

Para dúvidas e suporte:
- **Email:** dev@vluma.com.br
- **Documentação:** [docs.vluma.com.br](https://docs.vluma.com.br)

---

**Desenvolvido com ❤️ pela equipe VLUMA**
