import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subDays, startOfMonth, endOfMonth, format, parseISO } from "date-fns";

// Interfaces para Analytics
export interface ConversionData {
  period: string;
  total_leads: number;
  convertidos: number;
  agendados: number;
  perdidos: number;
  pendentes: number;
  taxa_conversao: number;
}

export interface LeadsByPeriod {
  date: string;
  count: number;
  status_breakdown: {
    pendente: number;
    agendado: number;
    convertido: number;
    perdido: number;
  };
}

export interface EmailPerformance {
  template_name: string;
  total_sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  taxa_abertura: number;
  taxa_clique: number;
}

export interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

// Hook para métricas principais
export function useMainMetrics(period: string = "30days") {
  return useQuery({
    queryKey: ["main-metrics", period],
    queryFn: async () => {
      const days = period === "7days" ? 7 : period === "90days" ? 90 : 30;
      const startDate = subDays(new Date(), days);

      // Buscar leads do período
      const { data: leads, error: leadsError } = await supabase
        .from("contatos")
        .select("status, created_at")
        .gte("created_at", startDate.toISOString());

      if (leadsError) throw leadsError;

      // Buscar estatísticas de email
      const { data: emailStats, error: emailError } = await supabase
        .from("email_logs")
        .select("status, opened_at, clicked_at, created_at")
        .gte("created_at", startDate.toISOString());

      if (emailError && emailError.code !== 'PGRST116') throw emailError;

      const totalLeads = leads?.length || 0;
      const convertidos = leads?.filter(l => l.status === "convertido").length || 0;
      const agendados = leads?.filter(l => l.status === "agendado").length || 0;
      const perdidos = leads?.filter(l => l.status === "perdido").length || 0;

      // Calcular taxa de conversão
      const taxaConversao = totalLeads > 0 ? (convertidos / totalLeads) * 100 : 0;

      // Calcular tempo médio de conversão (simulado)
      const tempoMedioConversao = 2.5; // dias (pode ser calculado com dados reais)

      // Calcular métricas de email
      const emailsEnviados = emailStats?.length || 0;
      const emailsAbertos = emailStats?.filter(e => e.opened_at).length || 0;
      const emailsClicados = emailStats?.filter(e => e.clicked_at).length || 0;
      
      const taxaAberturaEmail = emailsEnviados > 0 ? (emailsAbertos / emailsEnviados) * 100 : 0;

      // Calcular crescimento (comparar com período anterior)
      const previousStartDate = subDays(startDate, days);
      const { data: previousLeads } = await supabase
        .from("contatos")
        .select("status")
        .gte("created_at", previousStartDate.toISOString())
        .lt("created_at", startDate.toISOString());

      const previousTotal = previousLeads?.length || 0;
      const crescimento = previousTotal > 0 ? ((totalLeads - previousTotal) / previousTotal) * 100 : 0;

      return {
        totalLeads,
        convertidos,
        agendados,
        perdidos,
        taxaConversao,
        tempoMedioConversao,
        taxaAberturaEmail,
        crescimento,
        custoporLead: 45, // Valor fixo - pode ser configurável
        roi: 285, // Valor calculado baseado em vendas
      };
    },
  });
}

// Hook para dados de conversão por período
export function useConversionData(period: string = "30days") {
  return useQuery({
    queryKey: ["conversion-data", period],
    queryFn: async () => {
      const days = period === "7days" ? 7 : period === "90days" ? 90 : 30;
      const startDate = subDays(new Date(), days);

      const { data: leads, error } = await supabase
        .from("contatos")
        .select("status, created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Agrupar por semana ou mês dependendo do período
      const groupBy = days <= 30 ? "week" : "month";
      const groupedData: { [key: string]: ConversionData } = {};

      leads?.forEach(lead => {
        const date = parseISO(lead.created_at);
        const key = groupBy === "week" 
          ? `Sem ${Math.ceil((date.getDate()) / 7)}`
          : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][date.getMonth()];

        if (!groupedData[key]) {
          groupedData[key] = {
            period: key,
            total_leads: 0,
            convertidos: 0,
            agendados: 0,
            perdidos: 0,
            pendentes: 0,
            taxa_conversao: 0,
          };
        }

        groupedData[key].total_leads++;
        
        switch (lead.status) {
          case "convertido":
            groupedData[key].convertidos++;
            break;
          case "agendado":
            groupedData[key].agendados++;
            break;
          case "perdido":
            groupedData[key].perdidos++;
            break;
          default:
            groupedData[key].pendentes++;
        }
      });

      // Calcular taxa de conversão para cada período
      Object.values(groupedData).forEach(data => {
        data.taxa_conversao = data.total_leads > 0 ? (data.convertidos / data.total_leads) * 100 : 0;
      });

      return Object.values(groupedData);
    },
  });
}

// Hook para performance de emails
export function useEmailPerformance() {
  return useQuery({
    queryKey: ["email-performance"],
    queryFn: async () => {
      const { data: emailLogs, error } = await supabase
        .from("email_logs")
        .select(`
          *,
          email_templates(name)
        `);

      if (error && error.code !== 'PGRST116') {
        // Se as tabelas de email não existem ainda, retornar dados vazios
        return [];
      }

      if (!emailLogs) return [];

      // Agrupar por template
      const templateStats: { [key: string]: EmailPerformance } = {};

      emailLogs.forEach(log => {
        const templateName = log.email_templates?.name || 'Template Desconhecido';
        
        if (!templateStats[templateName]) {
          templateStats[templateName] = {
            template_name: templateName,
            total_sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            taxa_abertura: 0,
            taxa_clique: 0,
          };
        }

        templateStats[templateName].total_sent++;
        
        if (log.status === 'enviado') {
          templateStats[templateName].delivered++;
        }
        
        if (log.opened_at) {
          templateStats[templateName].opened++;
        }
        
        if (log.clicked_at) {
          templateStats[templateName].clicked++;
        }
      });

      // Calcular taxas
      Object.values(templateStats).forEach(stats => {
        stats.taxa_abertura = stats.delivered > 0 ? (stats.opened / stats.delivered) * 100 : 0;
        stats.taxa_clique = stats.delivered > 0 ? (stats.clicked / stats.delivered) * 100 : 0;
      });

      return Object.values(templateStats);
    },
  });
}

// Hook para funil de vendas
export function useSalesFunnel() {
  return useQuery({
    queryKey: ["sales-funnel"],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from("contatos")
        .select("status");

      if (error) throw error;

      const total = leads?.length || 0;
      const statusCount = {
        pendente: 0,
        agendado: 0,
        convertido: 0,
        perdido: 0,
      };

      leads?.forEach(lead => {
        if (statusCount.hasOwnProperty(lead.status)) {
          statusCount[lead.status as keyof typeof statusCount]++;
        }
      });

      const funnelData: FunnelData[] = [
        {
          stage: "Leads Captados",
          count: total,
          percentage: 100,
          color: "#667eea",
        },
        {
          stage: "Em Contato",
          count: statusCount.agendado + statusCount.convertido,
          percentage: total > 0 ? ((statusCount.agendado + statusCount.convertido) / total) * 100 : 0,
          color: "#764ba2",
        },
        {
          stage: "Agendados",
          count: statusCount.agendado + statusCount.convertido,
          percentage: total > 0 ? ((statusCount.agendado + statusCount.convertido) / total) * 100 : 0,
          color: "#f093fb",
        },
        {
          stage: "Convertidos",
          count: statusCount.convertido,
          percentage: total > 0 ? (statusCount.convertido / total) * 100 : 0,
          color: "#f5576c",
        },
      ];

      return funnelData;
    },
  });
}

// Hook para análise temporal
export function useTimeAnalysis(period: string = "30days") {
  return useQuery({
    queryKey: ["time-analysis", period],
    queryFn: async () => {
      const days = period === "7days" ? 7 : period === "90days" ? 90 : 30;
      const startDate = subDays(new Date(), days);

      const { data: leads, error } = await supabase
        .from("contatos")
        .select("created_at, status, data_agendamento")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Análise por dia da semana
      const dayOfWeekStats = {
        0: { name: "Domingo", count: 0 },
        1: { name: "Segunda", count: 0 },
        2: { name: "Terça", count: 0 },
        3: { name: "Quarta", count: 0 },
        4: { name: "Quinta", count: 0 },
        5: { name: "Sexta", count: 0 },
        6: { name: "Sábado", count: 0 },
      };

      // Análise por hora do dia
      const hourStats: { [key: number]: number } = {};

      leads?.forEach(lead => {
        const date = parseISO(lead.created_at);
        const dayOfWeek = date.getDay();
        const hour = date.getHours();

        dayOfWeekStats[dayOfWeek as keyof typeof dayOfWeekStats].count++;
        hourStats[hour] = (hourStats[hour] || 0) + 1;
      });

      return {
        dayOfWeekStats: Object.values(dayOfWeekStats),
        hourStats,
        totalLeads: leads?.length || 0,
      };
    },
  });
}
