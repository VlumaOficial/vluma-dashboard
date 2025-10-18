# 📊 VLUMA Dashboard - Manual de Uso Completo

## 🎯 Visão Geral

O VLUMA Dashboard é um sistema interno para gestão e controle de leads, desenvolvido em Next.js com integração ao Supabase. Este manual fornece instruções detalhadas para utilizar todas as funcionalidades do sistema.

---

## 🚀 Acesso ao Sistema

### URLs de Acesso:
- **Desenvolvimento:** http://localhost:3000
- **Preview:** http://127.0.0.1:37385

### Requisitos:
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para Supabase)
- Resolução mínima: 1024x768

---

## 📋 Estrutura do Sistema

### 🏠 **1. Dashboard Principal**
**Localização:** `/` (página inicial)

#### Funcionalidades:
- **Cards de Métricas:**
  - Total de Leads
  - Leads Convertidos
  - Agendamentos
  - Taxa de Conversão

- **Leads Recentes:**
  - Lista dos 5 leads mais recentes
  - Informações: Nome, email, WhatsApp, data/hora
  - Badge de status colorido

- **Próximos Agendamentos:**
  - Leads com status "agendado"
  - Data e hora do agendamento
  - Informações de contato

#### Como Usar:
1. Acesse a página inicial
2. Visualize as métricas em tempo real
3. Clique em "Ver Todos" para ir à gestão de leads
4. Monitore agendamentos próximos

---

### 👥 **2. Gestão de Leads**
**Localização:** `/leads`

#### Funcionalidades:
- **Visualização em Tabela:**
  - Lista completa de todos os leads
  - Colunas: Nome, Email, WhatsApp, Data, Status, Ações

- **Filtros e Busca:**
  - Busca por nome ou email
  - Filtro por status (Todos, Pendente, Agendado, Convertido, Perdido)

- **Gerenciamento de Status:**
  - Alterar status diretamente na tabela
  - Status disponíveis:
    - 🟡 **Pendente:** Lead cadastrado, aguardando contato
    - 🟣 **Agendado:** Reunião agendada
    - 🟢 **Convertido:** Lead virou cliente
    - 🔴 **Perdido:** Lead não converteu

- **Ações por Lead:**
  - Visualizar detalhes completos
  - Editar informações
  - Excluir lead
  - Agendar reunião

#### Como Usar:

##### **Visualizar Leads:**
1. Acesse `/leads`
2. Use a barra de busca para encontrar leads específicos
3. Use o filtro de status para segmentar visualização

##### **Alterar Status de um Lead:**
1. Localize o lead na tabela
2. Clique no badge de status atual
3. Selecione o novo status no dropdown
4. O sistema atualiza automaticamente

##### **Visualizar Detalhes:**
1. Clique no ícone de olho (👁️) na coluna "Ações"
2. Modal abrirá com informações completas:
   - Dados pessoais
   - Respostas do questionário
   - Histórico de interações

##### **Excluir Lead:**
1. Clique no ícone de lixeira (🗑️)
2. Confirme a exclusão no popup
3. Lead será removido permanentemente

---

### 📅 **3. Sistema de Agendamentos**
**Localização:** `/calendar`

#### Funcionalidades:
- **Calendário Visual:**
  - Visualização mensal
  - Dias com agendamentos destacados
  - Interface intuitiva

- **Lista de Agendamentos:**
  - Próximos agendamentos
  - Informações do lead
  - Data e hora
  - Ações rápidas

- **Ações Disponíveis:**
  - Reagendar reunião
  - Confirmar agendamento
  - Novo agendamento

#### Como Usar:

##### **Visualizar Agendamentos:**
1. Acesse `/calendar`
2. Visualize o calendário à esquerda
3. Veja a lista de próximos agendamentos à direita

##### **Criar Novo Agendamento:**
1. Vá para `/leads`
2. Altere o status do lead para "Agendado"
3. O lead aparecerá automaticamente no calendário

##### **Gerenciar Agendamento:**
1. No calendário, localize o agendamento
2. Use os botões "Reagendar" ou "Confirmar"
3. Para reagendar: altere a data/hora
4. Para confirmar: mude status para "Convertido"

---

### 📧 **4. Email Marketing**
**Localização:** `/emails`
**Status:** Em desenvolvimento

#### Funcionalidades Planejadas:
- Templates de email personalizáveis
- Disparos automatizados
- Acompanhamento de abertura
- Segmentação de leads

---

### 📊 **5. Analytics**
**Localização:** `/analytics`
**Status:** Em desenvolvimento

#### Funcionalidades Planejadas:
- Relatórios detalhados
- Gráficos de performance
- Análise de conversão
- Export de dados

---

### ⚙️ **6. Configurações**
**Localização:** `/settings`
**Status:** Em desenvolvimento

#### Funcionalidades Planejadas:
- Configurações de usuário
- Integrações
- Notificações
- Backup de dados

---

## 🔄 Fluxo de Trabalho Recomendado

### **Fluxo Padrão de Lead:**

1. **📝 Lead Cadastrado** (via formulário externo)
   - Status inicial: "Pendente"
   - Aparece no dashboard

2. **📞 Primeiro Contato**
   - Alterar status para "Contatado" (se implementado)
   - Ou manter "Pendente" até agendar

3. **📅 Agendamento**
   - Alterar status para "Agendado"
   - Definir data/hora da reunião
   - Lead aparece no calendário

4. **✅ Reunião Realizada**
   - Status "Convertido" (virou cliente)
   - Ou "Perdido" (não converteu)

### **Exemplo Prático:**

```
João Silva (Pendente) 
    ↓ [Contato via WhatsApp]
João Silva (Agendado - 25/10 às 14h)
    ↓ [Reunião realizada]
João Silva (Convertido) ✅
```

---

## 🎨 Interface e Navegação

### **Sidebar (Menu Lateral):**
- 🏠 Dashboard
- 👥 Leads  
- 📅 Agendamentos
- 📧 E-mails
- 📊 Analytics
- ⚙️ Configurações

### **Header (Cabeçalho):**
- Título da página atual
- Barra de busca global
- Notificações (🔔)
- Menu do usuário (👤)

### **Tema e Cores:**
- **Tema:** Dark mode por padrão
- **Cores principais:**
  - 🟣 Roxo: Ações principais
  - 🔵 Azul/Ciano: Links e destaques
  - 🟢 Verde: Sucesso/Convertido
  - 🟡 Amarelo: Pendente/Atenção
  - 🔴 Vermelho: Erro/Perdido

---

## 🔧 Funcionalidades Técnicas

### **Status dos Leads:**
```typescript
type Status = 'pendente' | 'agendado' | 'convertido' | 'perdido'
```

### **Estrutura de Dados:**
```typescript
interface Lead {
  id: string
  nome: string
  email: string
  whatsapp: string
  mensagem?: string
  status: 'pendente' | 'agendado' | 'convertido' | 'perdido'
  created_at: string
  data_agendamento?: string
  aceite_privacidade_em: string
}
```

### **Integrações:**
- **Supabase:** Banco de dados e autenticação
- **React Query:** Cache e sincronização de dados
- **Framer Motion:** Animações
- **Date-fns:** Manipulação de datas

---

## 🧪 Como Testar o Sistema

### **Teste 1: Visualização de Dados**
1. Acesse o dashboard principal
2. Verifique se as métricas estão carregando
3. Confirme se os leads recentes aparecem

### **Teste 2: Alteração de Status**
1. Vá para `/leads`
2. Localize um lead com status "Pendente"
3. Clique no badge de status
4. Altere para "Agendado"
5. Verifique se a mudança foi salva
6. Vá para `/calendar` e confirme que aparece lá

### **Teste 3: Busca e Filtros**
1. Na página de leads, digite um nome na busca
2. Teste o filtro por status
3. Verifique se os resultados estão corretos

### **Teste 4: Detalhes do Lead**
1. Clique no ícone de visualizar (👁️)
2. Confirme que o modal abre
3. Verifique se todas as informações estão corretas

### **Teste 5: Responsividade**
1. Teste em diferentes tamanhos de tela
2. Verifique mobile, tablet e desktop
3. Confirme que a navegação funciona

---

## 🐛 Resolução de Problemas

### **Problema: Leads não carregam**
**Solução:**
1. Verifique a conexão com internet
2. Confirme se o Supabase está acessível
3. Recarregue a página (F5)

### **Problema: Não consigo alterar status**
**Solução:**
1. Verifique se há conexão com o banco
2. Confirme se o lead existe
3. Tente recarregar a página

### **Problema: Interface quebrada**
**Solução:**
1. Limpe o cache do navegador
2. Desabilite extensões
3. Teste em modo incógnito

### **Problema: Dados desatualizados**
**Solução:**
1. Recarregue a página
2. O sistema usa cache inteligente
3. Dados são atualizados automaticamente

---

## 📱 Compatibilidade

### **Navegadores Suportados:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Dispositivos:**
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024+)
- ✅ Mobile (375x667+)

---

## 🔐 Segurança e Privacidade

### **Dados Protegidos:**
- Todas as comunicações são criptografadas (HTTPS)
- Dados pessoais protegidos conforme LGPD
- Registro de aceite de privacidade
- Backup automático no Supabase

### **Controle de Acesso:**
- Sistema interno da VLUMA
- Acesso restrito à equipe autorizada
- Logs de atividade (em desenvolvimento)

---

## 🚀 Atualizações e Melhorias

### **Versão Atual:** 1.0.0
### **Última Atualização:** Outubro 2025

### **Próximas Funcionalidades:**
- [ ] Integração com Google Calendar
- [ ] Templates de email personalizáveis
- [ ] Relatórios avançados com gráficos
- [ ] Notificações em tempo real
- [ ] Export de dados (PDF/Excel)
- [ ] App mobile
- [ ] Integração com WhatsApp Business

---

## 📞 Suporte

### **Para Dúvidas Técnicas:**
- **Email:** dev@vluma.com.br
- **Documentação:** Este manual
- **Repositório:** GitHub interno

### **Para Problemas Urgentes:**
1. Recarregue a página
2. Limpe o cache
3. Teste em outro navegador
4. Entre em contato com o suporte

---

## 📝 Changelog

### **v1.0.0 - Outubro 2025**
- ✅ Dashboard principal implementado
- ✅ Gestão completa de leads
- ✅ Sistema de agendamentos básico
- ✅ Filtros e busca
- ✅ Interface responsiva
- ✅ Integração com Supabase
- ✅ Correção de bugs de status

### **Bugs Corrigidos:**
- ✅ Erro PGRST204 ao alterar status
- ✅ Inconsistência entre interface e banco
- ✅ Problemas de TypeScript
- ✅ Filtros não funcionando

---

**© 2025 VLUMA - Dashboard Interno de Gestão de Leads**

*Desenvolvido com ❤️ pela equipe VLUMA*
