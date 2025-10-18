-- =====================================================
-- VLUMA - Configuração do Módulo de Email
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABELA DE TEMPLATES DE EMAIL
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('ativo', 'rascunho')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA DE CONFIGURAÇÃO SMTP
-- =====================================================

CREATE TABLE IF NOT EXISTS email_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 587,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_password VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA DE LOGS DE EMAIL
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES contatos(id) ON DELETE CASCADE,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('enviado', 'erro', 'pendente')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_email_templates_status ON email_templates(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_id ON email_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);

-- =====================================================
-- 5. TEMPLATES PADRÃO
-- =====================================================

INSERT INTO email_templates (name, subject, body, description, status) VALUES
(
  'Boas-vindas',
  'Bem-vindo à VLUMA, {nome}!',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bem-vindo à VLUMA</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Bem-vindo à VLUMA!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, {nome}!</h2>
        
        <p>É um prazer tê-lo conosco! Estamos muito animados para começar esta jornada juntos.</p>
        
        <p>A VLUMA é especializada em soluções inteligentes que transformam a maneira como você gerencia seus negócios. Nossa equipe está pronta para ajudá-lo a alcançar seus objetivos.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea;">Próximos Passos:</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Nossa equipe entrará em contato em breve</li>
                <li>Prepararemos uma proposta personalizada</li>
                <li>Agendaremos uma reunião para apresentar nossa solução</li>
            </ul>
        </div>
        
        <p>Se tiver alguma dúvida, não hesite em nos contatar:</p>
        <p>📧 Email: contato@vluma.com.br<br>
        📱 WhatsApp: (11) 99999-9999</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://vluma.com.br" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Visitar Site</a>
        </div>
        
        <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            Atenciosamente,<br>
            <strong>Equipe VLUMA</strong>
        </p>
    </div>
</body>
</html>',
  'Email de boas-vindas para novos leads',
  'ativo'
),
(
  'Confirmação de Agendamento',
  'Reunião agendada - {nome}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reunião Agendada</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Reunião Agendada!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, {nome}!</h2>
        
        <p>Sua reunião foi agendada com sucesso! Estamos ansiosos para conversar com você.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #11998e;">
            <h3 style="margin-top: 0; color: #11998e; text-align: center;">📅 Detalhes da Reunião</h3>
            <div style="text-align: center;">
                <p style="margin: 10px 0;"><strong>Data:</strong> [Data será preenchida automaticamente]</p>
                <p style="margin: 10px 0;"><strong>Horário:</strong> [Horário será preenchido automaticamente]</p>
                <p style="margin: 10px 0;"><strong>Duração:</strong> 45 minutos</p>
                <p style="margin: 10px 0;"><strong>Formato:</strong> Online (Google Meet)</p>
            </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2d5a2d;">🎯 O que vamos abordar:</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Entender suas necessidades específicas</li>
                <li>Apresentar nossas soluções personalizadas</li>
                <li>Discutir próximos passos</li>
                <li>Esclarecer todas as suas dúvidas</li>
            </ul>
        </div>
        
        <p><strong>Importante:</strong> O link da reunião será enviado 1 hora antes do horário agendado.</p>
        
        <p>Se precisar reagendar, entre em contato conosco:</p>
        <p>📧 Email: contato@vluma.com.br<br>
        📱 WhatsApp: (11) 99999-9999</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://calendar.google.com" style="background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 5px;">Adicionar ao Calendário</a>
        </div>
        
        <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            Até breve!<br>
            <strong>Equipe VLUMA</strong>
        </p>
    </div>
</body>
</html>',
  'Confirmação automática de agendamentos',
  'ativo'
),
(
  'Follow-up',
  'Que tal darmos continuidade, {nome}?',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Follow-up VLUMA</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">👋 Olá novamente!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Oi, {nome}!</h2>
        
        <p>Esperamos que esteja tudo bem com você! Entramos em contato há alguns dias e gostaríamos de dar continuidade à nossa conversa.</p>
        
        <p>Sabemos que o dia a dia pode ser corrido, mas acreditamos que nossa solução pode realmente fazer a diferença no seu negócio.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="margin-top: 0; color: #f5576c;">💡 Lembrete dos Benefícios:</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Automatização inteligente</strong> dos seus processos</li>
                <li><strong>Redução de custos</strong> operacionais</li>
                <li><strong>Aumento da produtividade</strong> da equipe</li>
                <li><strong>Relatórios detalhados</strong> para tomada de decisão</li>
            </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
            <p style="margin: 0; text-align: center;"><strong>🎁 Oferta Especial:</strong> Agende uma reunião esta semana e ganhe <strong>30 dias grátis</strong> na nossa plataforma!</p>
        </div>
        
        <p>Que tal agendarmos uma conversa rápida de 30 minutos? Podemos nos falar hoje mesmo!</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/vluma" style="background: #f5576c; color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Agendar Reunião</a>
        </div>
        
        <p>Ou se preferir, entre em contato diretamente:</p>
        <p>📧 Email: contato@vluma.com.br<br>
        📱 WhatsApp: (11) 99999-9999</p>
        
        <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            Aguardamos seu retorno!<br>
            <strong>Equipe VLUMA</strong>
        </p>
    </div>
</body>
</html>',
  'Email de follow-up após primeiro contato',
  'ativo'
),
(
  'Proposta Comercial',
  'Sua proposta personalizada está pronta, {nome}!',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Proposta Comercial VLUMA</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📋 Proposta Pronta!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, {nome}!</h2>
        
        <p>Temos o prazer de apresentar nossa proposta comercial personalizada, desenvolvida especialmente para atender às necessidades do seu negócio.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea; text-align: center;">🎯 Resumo da Proposta</h3>
            <div style="text-align: center;">
                <p style="margin: 10px 0;"><strong>Solução:</strong> Plataforma VLUMA Completa</p>
                <p style="margin: 10px 0;"><strong>Implementação:</strong> 30 dias</p>
                <p style="margin: 10px 0;"><strong>Suporte:</strong> 24/7 incluído</p>
                <p style="margin: 10px 0;"><strong>Treinamento:</strong> Equipe completa</p>
            </div>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1e40af;">✨ O que está incluído:</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Plataforma completa personalizada</li>
                <li>Integração com seus sistemas atuais</li>
                <li>Treinamento da equipe (40h)</li>
                <li>Suporte técnico 24/7</li>
                <li>Relatórios e dashboards personalizados</li>
                <li>Atualizações automáticas</li>
            </ul>
        </div>
        
        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h4 style="margin-top: 0; color: #166534;">💰 Investimento Especial</h4>
            <p style="margin: 5px 0; font-size: 18px;"><strong>Valor promocional válido até o final do mês!</strong></p>
            <p style="margin: 5px 0; color: #666; text-decoration: line-through;">De R$ 2.500/mês</p>
            <p style="margin: 5px 0; font-size: 24px; color: #166534;"><strong>Por apenas R$ 1.890/mês</strong></p>
        </div>
        
        <p><strong>Próximos passos:</strong></p>
        <ol>
            <li>Análise da proposta detalhada (anexa)</li>
            <li>Reunião para esclarecimentos</li>
            <li>Assinatura do contrato</li>
            <li>Início da implementação</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #667eea; color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin: 5px;">Ver Proposta Completa</a>
            <br>
            <a href="https://calendly.com/vluma" style="background: #10b981; color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin: 5px;">Agendar Reunião</a>
        </div>
        
        <p>Estamos à disposição para esclarecer qualquer dúvida:</p>
        <p>📧 Email: comercial@vluma.com.br<br>
        📱 WhatsApp: (11) 99999-9999</p>
        
        <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            Aguardamos seu retorno!<br>
            <strong>Equipe Comercial VLUMA</strong>
        </p>
    </div>
</body>
</html>',
  'Envio de propostas comerciais personalizadas',
  'ativo'
);

-- =====================================================
-- 6. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_config_updated_at 
    BEFORE UPDATE ON email_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Permitir todas as operações para usuários autenticados
CREATE POLICY "Allow all for authenticated users" ON email_templates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON email_config
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON email_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Módulo de Email configurado com sucesso!' as status;

-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('email_templates', 'email_config', 'email_logs');

-- Verificar templates inseridos
SELECT name, status FROM email_templates;
