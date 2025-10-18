# 🧪 VLUMA Dashboard - Guia Completo de Testes

## 🎯 Objetivo dos Testes

Este guia fornece instruções detalhadas para testar todas as funcionalidades do VLUMA Dashboard, garantindo que o sistema funcione corretamente após correções e atualizações.

---

## ⚡ Testes Rápidos (5 minutos)

### ✅ **Teste 1: Acesso e Carregamento**
**Tempo:** 1 minuto

1. Acesse http://localhost:3000
2. ✅ Verifique se a página carrega sem erros
3. ✅ Confirme se o logo VLUMA aparece na sidebar
4. ✅ Verifique se os cards de métricas estão visíveis

**Resultado Esperado:** Dashboard carrega completamente em menos de 5 segundos

---

### ✅ **Teste 2: Navegação Básica**
**Tempo:** 1 minuto

1. Clique em "Leads" na sidebar
2. ✅ Página `/leads` deve carregar
3. Clique em "Agendamentos" na sidebar  
4. ✅ Página `/calendar` deve carregar
5. Clique em "Dashboard" para voltar

**Resultado Esperado:** Navegação fluida sem erros

---

### ✅ **Teste 3: Alteração de Status (CRÍTICO)**
**Tempo:** 2 minutos

1. Vá para `/leads`
2. Localize um lead com status "Pendente"
3. Clique no badge amarelo "Pendente"
4. Selecione "Agendado" no dropdown
5. ✅ Badge deve mudar para roxo "Agendado"
6. ✅ Não deve aparecer erro no console
7. Recarregue a página (F5)
8. ✅ Status deve permanecer "Agendado"

**Resultado Esperado:** Status altera e persiste sem erros

---

### ✅ **Teste 4: Busca e Filtros**
**Tempo:** 1 minuto

1. Na página `/leads`, digite um nome na busca
2. ✅ Lista deve filtrar em tempo real
3. Limpe a busca
4. Use o filtro de status "Agendado"
5. ✅ Deve mostrar apenas leads agendados

**Resultado Esperado:** Filtros funcionam corretamente

---

## 🔍 Testes Detalhados (15 minutos)

### 📊 **Teste A: Dashboard Principal**
**Tempo:** 3 minutos

#### A1. Métricas
1. Acesse a página inicial
2. ✅ Verifique se os 4 cards de métricas carregam:
   - Total de Leads (número)
   - Leads Convertidos (número)
   - Agendamentos (número)  
   - Taxa de Conversão (%)
3. ✅ Números devem ser consistentes entre si
4. ✅ Ícones devem estar visíveis em cada card

#### A2. Leads Recentes
1. ✅ Seção "Leads Recentes" deve mostrar até 5 leads
2. ✅ Cada lead deve ter: nome, email, WhatsApp, data, status
3. ✅ Badge de status deve ter cor correta:
   - 🟡 Amarelo: Pendente
   - 🟣 Roxo: Agendado
   - 🟢 Verde: Convertido
   - 🔴 Vermelho: Perdido

#### A3. Próximos Agendamentos
1. ✅ Seção deve mostrar leads com status "Agendado"
2. ✅ Data/hora deve estar formatada corretamente
3. ✅ Se não houver agendamentos, deve mostrar mensagem apropriada

---

### 👥 **Teste B: Gestão de Leads**
**Tempo:** 5 minutos

#### B1. Visualização da Tabela
1. Acesse `/leads`
2. ✅ Tabela deve ter colunas: Nome, Email, WhatsApp, Data, Status, Ações
3. ✅ Dados devem estar alinhados corretamente
4. ✅ Scroll horizontal deve funcionar em telas pequenas

#### B2. Busca
1. Digite "João" na barra de busca
2. ✅ Deve filtrar leads que contenham "João" no nome
3. Digite um email parcial
4. ✅ Deve filtrar por email também
5. Limpe a busca
6. ✅ Deve mostrar todos os leads novamente

#### B3. Filtro por Status
1. Selecione "Pendente" no filtro
2. ✅ Deve mostrar apenas leads pendentes
3. Teste cada status disponível
4. ✅ Contadores devem ser consistentes

#### B4. Alteração de Status
1. Localize um lead pendente
2. Clique no badge de status
3. ✅ Dropdown deve abrir com 4 opções
4. Selecione "Agendado"
5. ✅ Badge deve mudar imediatamente
6. ✅ Console não deve mostrar erros
7. Recarregue a página
8. ✅ Mudança deve persistir

#### B5. Visualização de Detalhes
1. Clique no ícone de olho (👁️) em um lead
2. ✅ Modal deve abrir
3. ✅ Deve mostrar todas as informações do lead
4. ✅ Botão "Fechar" deve funcionar

#### B6. Exclusão de Lead
1. Clique no ícone de lixeira (🗑️)
2. ✅ Popup de confirmação deve aparecer
3. Clique "Cancelar"
4. ✅ Lead deve permanecer
5. Tente novamente e confirme
6. ✅ Lead deve ser removido da lista

---

### 📅 **Teste C: Sistema de Agendamentos**
**Tempo:** 4 minutos

#### C1. Visualização do Calendário
1. Acesse `/calendar`
2. ✅ Calendário mensal deve estar visível
3. ✅ Dias da semana devem estar corretos
4. ✅ Dias com agendamentos devem ter indicador visual

#### C2. Lista de Agendamentos
1. ✅ Seção "Próximos Agendamentos" deve mostrar leads agendados
2. ✅ Cada agendamento deve ter:
   - Nome do lead
   - Data/hora (ou "Data a definir")
   - Email e WhatsApp
   - Botões "Reagendar" e "Confirmar"

#### C3. Integração com Leads
1. Vá para `/leads`
2. Altere um lead para status "Agendado"
3. Volte para `/calendar`
4. ✅ Lead deve aparecer na lista de agendamentos

#### C4. Ações Rápidas
1. ✅ Botão "Novo Agendamento" deve estar visível
2. ✅ Botão "Ver Agenda Completa" deve estar visível
3. Clique nos botões
4. ✅ Não deve gerar erros (mesmo que não implementado)

---

### 🔧 **Teste D: Interface e Responsividade**
**Tempo:** 3 minutos

#### D1. Sidebar
1. ✅ Logo VLUMA deve estar visível e animado
2. ✅ Todos os itens do menu devem estar presentes
3. ✅ Item ativo deve ter destaque visual
4. ✅ Hover nos itens deve funcionar

#### D2. Header
1. ✅ Título da página deve mudar conforme navegação
2. ✅ Subtítulo deve estar presente
3. ✅ Barra de busca deve estar visível (desktop)
4. ✅ Ícones de notificação e usuário devem estar presentes

#### D3. Responsividade
1. Redimensione a janela para 768px (tablet)
2. ✅ Layout deve se adaptar
3. Redimensione para 375px (mobile)
4. ✅ Sidebar deve se comportar adequadamente
5. ✅ Tabelas devem ter scroll horizontal
6. ✅ Cards devem empilhar verticalmente

#### D4. Tema Dark
1. ✅ Fundo deve ser escuro
2. ✅ Texto deve ser claro e legível
3. ✅ Contrastes devem estar adequados
4. ✅ Cores da marca VLUMA devem estar presentes

---

## 🚨 Testes de Erro e Edge Cases

### ⚠️ **Teste E: Cenários de Erro**

#### E1. Conexão com Banco
1. Desconecte a internet
2. Tente alterar status de um lead
3. ✅ Deve mostrar mensagem de erro apropriada
4. ✅ Interface não deve quebrar

#### E2. Dados Vazios
1. ✅ Se não houver leads, deve mostrar mensagem "Nenhum lead encontrado"
2. ✅ Se não houver agendamentos, deve mostrar "Nenhum agendamento"
3. ✅ Filtros sem resultados devem mostrar lista vazia

#### E3. Campos Obrigatórios
1. ✅ Leads sem nome devem ser tratados adequadamente
2. ✅ Emails inválidos devem ser identificados
3. ✅ WhatsApp deve aceitar diferentes formatos

---

## 📱 Testes de Compatibilidade

### 🌐 **Teste F: Navegadores**

#### F1. Chrome
1. Teste todas as funcionalidades
2. ✅ Verifique console para erros
3. ✅ Performance deve ser fluida

#### F2. Firefox
1. Repita os testes principais
2. ✅ Verifique se animações funcionam
3. ✅ Confirme compatibilidade de CSS

#### F3. Safari (se disponível)
1. Teste funcionalidades básicas
2. ✅ Verifique renderização
3. ✅ Confirme que não há quebras

---

## 🎯 Checklist de Validação Final

### ✅ **Funcionalidades Críticas**
- [ ] Dashboard carrega sem erros
- [ ] Leads são listados corretamente
- [ ] Status pode ser alterado
- [ ] Alterações persistem no banco
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Agendamentos aparecem no calendário
- [ ] Interface é responsiva
- [ ] Não há erros no console

### ✅ **Performance**
- [ ] Página inicial carrega em < 5s
- [ ] Navegação é fluida
- [ ] Alterações são instantâneas
- [ ] Sem travamentos

### ✅ **UX/UI**
- [ ] Interface é intuitiva
- [ ] Cores estão consistentes
- [ ] Textos são legíveis
- [ ] Botões respondem ao hover
- [ ] Animações são suaves

---

## 🐛 Registro de Bugs Encontrados

### 📝 **Template para Reportar Bugs**

```
**Bug:** [Descrição breve]
**Página:** [URL onde ocorre]
**Passos para Reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Resultado Esperado:** [O que deveria acontecer]
**Resultado Atual:** [O que acontece]
**Navegador:** [Chrome/Firefox/Safari]
**Tela:** [Desktop/Mobile/Tablet]
**Console:** [Erros no console, se houver]
```

---

## 📊 Relatório de Testes

### 📈 **Métricas de Sucesso**
- **Taxa de Sucesso:** [X/Y testes passaram]
- **Tempo Total:** [Tempo gasto testando]
- **Bugs Críticos:** [Número de bugs críticos]
- **Bugs Menores:** [Número de bugs menores]

### 🎯 **Conclusão**
- [ ] Sistema aprovado para uso
- [ ] Sistema precisa de correções
- [ ] Sistema não está pronto

---

## 🔄 Testes Automatizados (Futuro)

### 🤖 **Sugestões para Implementação**
- Unit tests com Jest
- Integration tests com Cypress
- Visual regression tests
- Performance tests
- Accessibility tests

---

**© 2025 VLUMA - Guia de Testes do Dashboard**

*Mantenha este documento atualizado conforme novas funcionalidades são adicionadas*
