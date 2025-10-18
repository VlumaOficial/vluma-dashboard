"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, Lead } from "@/lib/supabase";
import { toast } from "sonner";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contatos")
        .select(`
          *,
          respostas_questionario (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar leads:", error);
        throw error;
      }

      return data as Lead[];
    },
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ["lead-stats"],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from("contatos")
        .select("status_agendamento, created_at");

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      const total = leads?.length || 0;
      const convertidos = leads?.filter(lead => lead.status_agendamento === "convertido").length || 0;
      const agendados = leads?.filter(lead => lead.status_agendamento === "agendado").length || 0;
      const taxaConversao = total > 0 ? Math.round((convertidos / total) * 100) : 0;

      // Calcular crescimento do mês anterior (simulado)
      const hoje = new Date();
      const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
      
      const leadsEstesMes = leads?.filter(lead => 
        new Date(lead.created_at) >= mesPassado
      ).length || 0;

      const crescimento = total > 0 ? Math.round(((leadsEstesMes / total) * 100) - 50) : 0;

      return {
        total,
        convertidos,
        agendados,
        taxaConversao,
        crescimento: Math.abs(crescimento),
        crescimentoTipo: crescimento >= 0 ? "increase" as const : "decrease" as const,
      };
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead["status_agendamento"] }) => {
      console.log("Tentando atualizar lead:", { id, status });
      
      const { data, error } = await supabase
        .from("contatos")
        .update({ status_agendamento: status })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Erro detalhado do Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log("Lead atualizado com sucesso:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-stats"] });
      toast.success("Status do lead atualizado!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao atualizar status: ${error.message || 'Erro desconhecido'}`);
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contatos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-stats"] });
      toast.success("Lead excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir lead:", error);
      toast.error("Erro ao excluir lead");
    },
  });
}
