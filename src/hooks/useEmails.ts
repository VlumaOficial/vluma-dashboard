import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Interfaces para Email
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string;
  status: 'ativo' | 'rascunho';
  created_at: string;
  updated_at: string;
}

export interface EmailConfig {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_name: string;
  from_email: string;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  lead_id: string;
  template_id: string;
  to_email: string;
  subject: string;
  body: string;
  status: 'enviado' | 'erro' | 'pendente';
  sent_at?: string;
  error_message?: string;
  opened_at?: string;
  clicked_at?: string;
  created_at: string;
}

// Hook para buscar templates
export function useEmailTemplates() {
  return useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar templates:", error);
        throw error;
      }

      return data as EmailTemplate[];
    },
  });
}

// Hook para buscar configuração SMTP
export function useEmailConfig() {
  return useQuery({
    queryKey: ["email-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_config")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Erro ao buscar configuração:", error);
        throw error;
      }

      return data as EmailConfig | null;
    },
  });
}

// Hook para buscar logs de email
export function useEmailLogs() {
  return useQuery({
    queryKey: ["email-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_logs")
        .select(`
          *,
          contatos(nome, email),
          email_templates(name)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Erro ao buscar logs:", error);
        throw error;
      }

      return data;
    },
  });
}

// Hook para estatísticas de email
export function useEmailStats() {
  return useQuery({
    queryKey: ["email-stats"],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from("email_logs")
        .select("status, opened_at, clicked_at, created_at");

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      const total = logs?.length || 0;
      const enviados = logs?.filter(log => log.status === "enviado").length || 0;
      const abertos = logs?.filter(log => log.opened_at).length || 0;
      const clicados = logs?.filter(log => log.clicked_at).length || 0;

      const taxaAbertura = enviados > 0 ? Math.round((abertos / enviados) * 100) : 0;
      const taxaClique = enviados > 0 ? Math.round((clicados / enviados) * 100) : 0;

      return {
        total,
        enviados,
        abertos,
        clicados,
        taxaAbertura,
        taxaClique,
      };
    },
  });
}

// Hook para criar/atualizar template
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("email_templates")
        .insert([{
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success("Template criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar template:", error);
      toast.error("Erro ao criar template");
    },
  });
}

// Hook para atualizar template
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...template }: Partial<EmailTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from("email_templates")
        .update({
          ...template,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success("Template atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar template:", error);
      toast.error("Erro ao atualizar template");
    },
  });
}

// Hook para salvar configuração SMTP
export function useSaveEmailConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Omit<EmailConfig, 'id' | 'created_at' | 'updated_at'>) => {
      // Primeiro, verificar se já existe configuração
      const { data: existing } = await supabase
        .from("email_config")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        // Atualizar existente
        const { data, error } = await supabase
          .from("email_config")
          .update({
            ...config,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Criar novo
        const { data, error } = await supabase
          .from("email_config")
          .insert([{
            ...config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-config"] });
      toast.success("Configuração SMTP salva com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração SMTP");
    },
  });
}

// Hook para enviar email
export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      leadId, 
      templateId, 
      customSubject, 
      customBody 
    }: { 
      leadId: string; 
      templateId: string; 
      customSubject?: string; 
      customBody?: string; 
    }) => {
      // Buscar dados do lead
      const { data: lead, error: leadError } = await supabase
        .from("contatos")
        .select("*")
        .eq("id", leadId)
        .single();

      if (leadError) throw leadError;

      // Buscar template
      const { data: template, error: templateError } = await supabase
        .from("email_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (templateError) throw templateError;

      // Buscar configuração SMTP
      const { data: config, error: configError } = await supabase
        .from("email_config")
        .select("*")
        .limit(1)
        .single();

      if (configError) throw new Error("Configuração SMTP não encontrada");

      // Personalizar subject e body com dados do lead
      const personalizedSubject = (customSubject || template.subject)
        .replace(/\{nome\}/g, lead.nome)
        .replace(/\{email\}/g, lead.email);

      const personalizedBody = (customBody || template.body)
        .replace(/\{nome\}/g, lead.nome)
        .replace(/\{email\}/g, lead.email)
        .replace(/\{whatsapp\}/g, lead.whatsapp || '');

      // Registrar log do email
      const { data: emailLog, error: logError } = await supabase
        .from("email_logs")
        .insert([{
          lead_id: leadId,
          template_id: templateId,
          to_email: lead.email,
          subject: personalizedSubject,
          body: personalizedBody,
          status: 'pendente',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (logError) throw logError;

      // Simular envio de email (substituir por integração real)
      // TODO: Implementar envio real via SMTP
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualizar status para enviado
      const { error: updateError } = await supabase
        .from("email_logs")
        .update({
          status: 'enviado',
          sent_at: new Date().toISOString(),
        })
        .eq("id", emailLog.id);

      if (updateError) throw updateError;

      return { emailLog, lead, template };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["email-logs"] });
      queryClient.invalidateQueries({ queryKey: ["email-stats"] });
      toast.success(`Email enviado para ${data.lead.nome} com sucesso!`);
    },
    onError: (error) => {
      console.error("Erro ao enviar email:", error);
      toast.error(`Erro ao enviar email: ${error.message}`);
    },
  });
}
