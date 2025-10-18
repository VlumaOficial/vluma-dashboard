import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Interfaces para Marketing
export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'google_ads' | 'facebook' | 'instagram' | 'linkedin' | 'outros';
  budget: number;
  spent: number;
  start_date: string;
  end_date?: string;
  status: 'ativa' | 'pausada' | 'finalizada';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyCost {
  id: string;
  campaign_id: string;
  date: string;
  amount: number;
  leads_generated: number;
  impressions: number;
  clicks: number;
  conversions: number;
  notes?: string;
  created_at: string;
}

export interface CostSettings {
  id: string;
  calculation_method: 'automatic' | 'manual' | 'mixed';
  manual_cost_per_lead: number;
  include_fixed_costs: boolean;
  fixed_monthly_cost: number;
  calculation_period: number;
  last_calculated?: string;
}

export interface MarketingMetrics {
  campaign_name: string;
  platform: string;
  status: string;
  total_spent: number;
  total_leads: number;
  cost_per_lead_campaign: number;
  total_clicks: number;
  total_impressions: number;
  ctr_percentage: number;
}

// Hook para buscar campanhas
export function useMarketingCampaigns() {
  return useQuery({
    queryKey: ["marketing-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MarketingCampaign[];
    },
  });
}

// Hook para buscar métricas de marketing
export function useMarketingMetrics() {
  return useQuery({
    queryKey: ["marketing-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_metrics")
        .select("*");

      if (error) throw error;
      return data as MarketingMetrics[];
    },
  });
}

// Hook para buscar configurações de custo
export function useCostSettings() {
  return useQuery({
    queryKey: ["cost-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cost_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as CostSettings | null;
    },
  });
}

// Hook para calcular custo por lead
export function useCostPerLead(periodDays: number = 30) {
  return useQuery({
    queryKey: ["cost-per-lead", periodDays],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_cost_per_lead', { period_days: periodDays });

      if (error) {
        console.log("Erro ao calcular custo por lead:", error);
        return 45; // Valor padrão
      }
      
      return parseFloat(data) || 45;
    },
  });
}

// Hook para criar campanha
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: Omit<MarketingCampaign, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .insert([campaign])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-metrics"] });
      toast.success("Campanha criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar campanha:", error);
      toast.error("Erro ao criar campanha");
    },
  });
}

// Hook para atualizar campanha
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketingCampaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-metrics"] });
      toast.success("Campanha atualizada!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar campanha:", error);
      toast.error("Erro ao atualizar campanha");
    },
  });
}

// Hook para adicionar custo diário
export function useAddDailyCost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cost: Omit<DailyCost, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from("daily_marketing_costs")
        .insert([cost])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["cost-per-lead"] });
      toast.success("Custo adicionado!");
    },
    onError: (error) => {
      console.error("Erro ao adicionar custo:", error);
      toast.error("Erro ao adicionar custo");
    },
  });
}

// Hook para atualizar configurações de custo
export function useUpdateCostSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<CostSettings>) => {
      const { data, error } = await supabase
        .from("cost_settings")
        .upsert([{ ...settings, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-settings"] });
      queryClient.invalidateQueries({ queryKey: ["cost-per-lead"] });
      toast.success("Configurações atualizadas!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações");
    },
  });
}

// Hook para buscar custos diários de uma campanha
export function useDailyCosts(campaignId: string) {
  return useQuery({
    queryKey: ["daily-costs", campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_marketing_costs")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as DailyCost[];
    },
    enabled: !!campaignId,
  });
}
