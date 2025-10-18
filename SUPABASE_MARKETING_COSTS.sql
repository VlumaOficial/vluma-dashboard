-- =====================================================
-- SISTEMA DE CUSTO POR LEAD - VLUMA DASHBOARD
-- =====================================================
-- Este script cria tabelas para calcular automaticamente
-- o custo por lead baseado em gastos reais de marketing

-- =====================================================
-- 1. TABELA DE CAMPANHAS DE MARKETING
-- =====================================================

CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(100) NOT NULL, -- 'google_ads', 'facebook', 'instagram', 'linkedin', 'outros'
  budget DECIMAL(10,2) NOT NULL DEFAULT 0, -- Orçamento total da campanha
  spent DECIMAL(10,2) NOT NULL DEFAULT 0, -- Valor já gasto
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ativa', -- 'ativa', 'pausada', 'finalizada'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA DE GASTOS DIÁRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_marketing_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  leads_generated INTEGER DEFAULT 0, -- Leads gerados neste dia
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA DE CONFIGURAÇÕES DE CUSTO
-- =====================================================

CREATE TABLE IF NOT EXISTS cost_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_method VARCHAR(50) DEFAULT 'automatic', -- 'automatic', 'manual', 'mixed'
  manual_cost_per_lead DECIMAL(10,2) DEFAULT 45.00, -- Valor manual se necessário
  include_fixed_costs BOOLEAN DEFAULT true,
  fixed_monthly_cost DECIMAL(10,2) DEFAULT 0, -- Custos fixos mensais (salários, ferramentas, etc.)
  calculation_period INTEGER DEFAULT 30, -- Período em dias para cálculo
  last_calculated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. FUNÇÃO PARA CALCULAR CUSTO POR LEAD
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_cost_per_lead(
  period_days INTEGER DEFAULT 30
) RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_marketing_cost DECIMAL(10,2) := 0;
  total_fixed_cost DECIMAL(10,2) := 0;
  total_leads INTEGER := 0;
  cost_per_lead DECIMAL(10,2) := 0;
  settings RECORD;
  start_date DATE;
BEGIN
  -- Buscar configurações
  SELECT * INTO settings FROM cost_settings LIMIT 1;
  
  -- Se não há configurações, usar valores padrão
  IF settings IS NULL THEN
    INSERT INTO cost_settings (calculation_method, manual_cost_per_lead) 
    VALUES ('automatic', 45.00);
    SELECT * INTO settings FROM cost_settings LIMIT 1;
  END IF;
  
  -- Se método é manual, retornar valor fixo
  IF settings.calculation_method = 'manual' THEN
    RETURN settings.manual_cost_per_lead;
  END IF;
  
  -- Calcular data de início
  start_date := CURRENT_DATE - INTERVAL '1 day' * period_days;
  
  -- Somar custos de marketing do período
  SELECT COALESCE(SUM(amount), 0) INTO total_marketing_cost
  FROM daily_marketing_costs 
  WHERE date >= start_date;
  
  -- Adicionar custos fixos proporcionais
  IF settings.include_fixed_costs THEN
    total_fixed_cost := (settings.fixed_monthly_cost / 30.0) * period_days;
  END IF;
  
  -- Contar leads do período
  SELECT COUNT(*) INTO total_leads
  FROM contatos 
  WHERE created_at >= start_date;
  
  -- Calcular custo por lead
  IF total_leads > 0 THEN
    cost_per_lead := (total_marketing_cost + total_fixed_cost) / total_leads;
  ELSE
    -- Se não há leads, retornar valor padrão
    cost_per_lead := settings.manual_cost_per_lead;
  END IF;
  
  -- Atualizar última calculação
  UPDATE cost_settings 
  SET last_calculated = NOW() 
  WHERE id = settings.id;
  
  RETURN ROUND(cost_per_lead, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. VIEW PARA MÉTRICAS DE MARKETING
-- =====================================================

CREATE OR REPLACE VIEW marketing_metrics AS
SELECT 
  c.name as campaign_name,
  c.platform,
  c.status,
  SUM(d.amount) as total_spent,
  SUM(d.leads_generated) as total_leads,
  CASE 
    WHEN SUM(d.leads_generated) > 0 
    THEN ROUND(SUM(d.amount) / SUM(d.leads_generated), 2)
    ELSE 0 
  END as cost_per_lead_campaign,
  SUM(d.clicks) as total_clicks,
  SUM(d.impressions) as total_impressions,
  CASE 
    WHEN SUM(d.impressions) > 0 
    THEN ROUND((SUM(d.clicks)::DECIMAL / SUM(d.impressions)) * 100, 2)
    ELSE 0 
  END as ctr_percentage
FROM marketing_campaigns c
LEFT JOIN daily_marketing_costs d ON c.id = d.campaign_id
GROUP BY c.id, c.name, c.platform, c.status;

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_platform ON marketing_campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_daily_costs_date ON daily_marketing_costs(date);
CREATE INDEX IF NOT EXISTS idx_daily_costs_campaign ON daily_marketing_costs(campaign_id);

-- =====================================================
-- 7. POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_marketing_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_settings ENABLE ROW LEVEL SECURITY;

-- Permitir acesso total para usuários autenticados
CREATE POLICY "Permitir acesso total para usuários autenticados" ON marketing_campaigns
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir acesso total para usuários autenticados" ON daily_marketing_costs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir acesso total para usuários autenticados" ON cost_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 8. DADOS INICIAIS DE EXEMPLO
-- =====================================================

-- Inserir configuração padrão
INSERT INTO cost_settings (
  calculation_method, 
  manual_cost_per_lead, 
  include_fixed_costs, 
  fixed_monthly_cost,
  calculation_period
) VALUES (
  'automatic', 
  45.00, 
  true, 
  3000.00, -- R$ 3.000 custos fixos mensais
  30
) ON CONFLICT DO NOTHING;

-- Inserir campanhas de exemplo
INSERT INTO marketing_campaigns (name, platform, budget, spent, start_date, status, description) VALUES
('Campanha Google Ads - Leads', 'google_ads', 2000.00, 850.00, CURRENT_DATE - INTERVAL '15 days', 'ativa', 'Campanha focada em captação de leads qualificados'),
('Instagram Stories - Awareness', 'instagram', 800.00, 650.00, CURRENT_DATE - INTERVAL '10 days', 'ativa', 'Aumentar conhecimento da marca'),
('LinkedIn Sponsored - B2B', 'linkedin', 1500.00, 420.00, CURRENT_DATE - INTERVAL '7 days', 'ativa', 'Foco em empresas B2B')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de Custo por Lead configurado com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas: marketing_campaigns, daily_marketing_costs, cost_settings';
  RAISE NOTICE '🔧 Função criada: calculate_cost_per_lead()';
  RAISE NOTICE '📈 View criada: marketing_metrics';
  RAISE NOTICE '🎯 Para usar: SELECT calculate_cost_per_lead(30);';
END $$;
