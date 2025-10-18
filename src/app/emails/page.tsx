"use client";

import { Mail, Send, FileText, Users, Clock, Settings } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea"; // TODO: Implementar componente
import { useState } from "react";
import { toast } from "sonner";
import { 
  useEmailTemplates, 
  useEmailConfig, 
  useEmailLogs, 
  useEmailStats,
  useSendEmail,
  useSaveEmailConfig,
  useCreateTemplate,
} from "@/hooks/useEmails";
import { useLeads } from "@/hooks/useLeads";
import { format } from "date-fns";

export default function EmailsPage() {
  // Hooks para dados
  const { data: templates, isLoading: templatesLoading } = useEmailTemplates();
  const { data: emailConfig } = useEmailConfig();
  const { data: emailLogs, isLoading: logsLoading } = useEmailLogs();
  const { data: stats } = useEmailStats();
  const { data: leads } = useLeads();
  
  // Hooks para mutations
  const sendEmail = useSendEmail();
  const saveConfig = useSaveEmailConfig();
  const createTemplate = useCreateTemplate();
  
  // Estados para modais
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  
  // Estados para formulários
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [customSubject, setCustomSubject] = useState<string>("");
  const [customBody, setCustomBody] = useState<string>("");
  
  // Estados para configuração SMTP
  const [smtpConfig, setSmtpConfig] = useState({
    smtp_host: emailConfig?.smtp_host || "",
    smtp_port: emailConfig?.smtp_port || 587,
    smtp_user: emailConfig?.smtp_user || "",
    smtp_password: emailConfig?.smtp_password || "",
    from_name: emailConfig?.from_name || "",
    from_email: emailConfig?.from_email || "",
  });
  
  // Estados para novo template (placeholder)
  // const [newTemplate, setNewTemplate] = useState({
  //   name: "",
  //   subject: "",
  //   body: "",
  //   description: "",
  //   status: "rascunho" as const,
  // });
  
  // Handlers
  const handleSendEmail = () => {
    if (!selectedTemplate || !selectedLead) {
      toast.error("Selecione um template e um lead!");
      return;
    }
    
    sendEmail.mutate({
      leadId: selectedLead,
      templateId: selectedTemplate,
      customSubject,
      customBody,
    }, {
      onSuccess: () => {
        setIsSendModalOpen(false);
        setSelectedTemplate("");
        setSelectedLead("");
        setCustomSubject("");
        setCustomBody("");
      }
    });
  };
  
  const handleSaveConfig = () => {
    saveConfig.mutate(smtpConfig, {
      onSuccess: () => {
        setIsConfigModalOpen(false);
      }
    });
  };
  
  const handleCreateTemplate = () => {
    toast.info("Criação de templates - Em desenvolvimento");
  };
  
  const leadsDisponiveis = leads?.filter(lead => lead.email) || [];
  return (
    <DashboardLayout 
      title="Email Marketing" 
      subtitle="Gerencie templates e campanhas de email"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Emails Enviados</p>
                <p className="text-2xl font-bold text-branco-puro">{stats?.enviados || 0}</p>
              </div>
              <Send className="w-8 h-8 text-purple-vivid" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Taxa de Abertura</p>
                <p className="text-2xl font-bold text-branco-puro">{stats?.taxaAbertura || 0}%</p>
              </div>
              <Mail className="w-8 h-8 text-cyan-vivid" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Templates Ativos</p>
                <p className="text-2xl font-bold text-branco-puro">{templates?.filter(t => t.status === 'ativo').length || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-verde-inteligente" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Cliques</p>
                <p className="text-2xl font-bold text-branco-puro">{stats?.clicados || 0}</p>
              </div>
              <Users className="w-8 h-8 text-laranja-cta" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Templates */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-branco-puro">
                Templates de Email
              </h3>
              <Button 
                className="bg-laranja-cta hover:bg-laranja-cta/80"
                onClick={handleCreateTemplate}
              >
                <FileText className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </div>
            
            <div className="space-y-4">
              {templatesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-4 bg-white/5 rounded-lg">
                      <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : templates && templates.length > 0 ? (
                templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-vivid/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-branco-puro">{template.name}</h4>
                        <Badge className={
                          template.status === "ativo" 
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }>
                          {template.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-cinza-claro mb-1">{template.subject}</p>
                      <p className="text-xs text-cinza-claro">{template.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-branco-puro">-</p>
                      <p className="text-xs text-cinza-claro">usos</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Visualizar
                    </Button>
                    <Button size="sm" className="text-xs bg-purple-vivid hover:bg-purple-vivid/80">
                      Usar Template
                    </Button>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                  <p className="text-cinza-claro">Nenhum template encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Emails */}
        <div>
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-branco-puro mb-4">
              Emails Recentes
            </h3>
            
            <div className="space-y-4">
              {logsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-3 bg-white/5 rounded-lg">
                      <div className="h-3 bg-white/10 rounded w-2/3 mb-2"></div>
                      <div className="h-2 bg-white/10 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : emailLogs && emailLogs.length > 0 ? (
                emailLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-branco-puro truncate">
                        {log.to_email}
                      </p>
                      <p className="text-xs text-cinza-claro truncate">
                        {log.subject}
                      </p>
                    </div>
                    <Badge className={
                      log.status === "enviado" 
                        ? "bg-green-500/20 text-green-500"
                        : log.status === "erro"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }>
                      {log.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-cinza-claro">
                    <span>{log.email_templates?.name || 'Template'}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.sent_at ? format(new Date(log.sent_at), "HH:mm") : "--:--"}
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                  <p className="text-cinza-claro">Nenhum email enviado</p>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="w-full mt-4 text-cyan-vivid border-cyan-vivid/50">
              Ver Todos os Emails
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h4 className="text-md font-semibold text-branco-puro mb-4">
              Ações Rápidas
            </h4>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start bg-laranja-cta hover:bg-laranja-cta/80"
                onClick={() => setIsSendModalOpen(true)}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-cyan-vivid border-cyan-vivid/50"
                onClick={() => toast.info("Campanha em massa - Em desenvolvimento")}
              >
                <Users className="w-4 h-4 mr-2" />
                Campanha em Massa
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-purple-vivid border-purple-vivid/50"
                onClick={() => setIsConfigModalOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar SMTP
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Configuração SMTP */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="bg-card-dark border-purple-vivid/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-branco-puro">Configuração SMTP</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-branco-suave">Servidor SMTP</Label>
              <Input 
                value={smtpConfig.smtp_host}
                onChange={(e) => setSmtpConfig({...smtpConfig, smtp_host: e.target.value})}
                placeholder="smtp.gmail.com"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div>
              <Label className="text-branco-suave">Porta</Label>
              <Input 
                type="number"
                value={smtpConfig.smtp_port}
                onChange={(e) => setSmtpConfig({...smtpConfig, smtp_port: parseInt(e.target.value)})}
                placeholder="587"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div>
              <Label className="text-branco-suave">Email</Label>
              <Input 
                value={smtpConfig.smtp_user}
                onChange={(e) => setSmtpConfig({...smtpConfig, smtp_user: e.target.value})}
                placeholder="seu@email.com"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div>
              <Label className="text-branco-suave">Senha</Label>
              <Input 
                type="password"
                value={smtpConfig.smtp_password}
                onChange={(e) => setSmtpConfig({...smtpConfig, smtp_password: e.target.value})}
                placeholder="••••••••"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div>
              <Label className="text-branco-suave">Nome do Remetente</Label>
              <Input 
                value={smtpConfig.from_name}
                onChange={(e) => setSmtpConfig({...smtpConfig, from_name: e.target.value})}
                placeholder="VLUMA"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div>
              <Label className="text-branco-suave">Email do Remetente</Label>
              <Input 
                value={smtpConfig.from_email}
                onChange={(e) => setSmtpConfig({...smtpConfig, from_email: e.target.value})}
                placeholder="noreply@vluma.com.br"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsConfigModalOpen(false)}
                className="flex-1 text-branco-puro border-white/20"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveConfig}
                className="flex-1 bg-verde-inteligente hover:bg-verde-inteligente/80"
                disabled={saveConfig.isPending}
              >
                {saveConfig.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Envio de Email */}
      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="bg-card-dark border-purple-vivid/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-branco-puro">Enviar Email</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {!emailConfig && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                <p className="text-yellow-200 text-sm">
                  ⚠️ Configure o SMTP primeiro para enviar emails
                </p>
              </div>
            )}
            
            <div>
              <Label className="text-branco-suave">Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="bg-white/5 border-white/20 text-branco-puro">
                  <SelectValue placeholder="Escolha um template..." />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-purple-vivid/20">
                  {templates?.filter(t => t.status === 'ativo').map((template) => (
                    <SelectItem 
                      key={template.id} 
                      value={template.id}
                      className="text-branco-puro hover:bg-white/10"
                    >
                      {template.name} - {template.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-branco-suave">Lead</Label>
              <Select value={selectedLead} onValueChange={setSelectedLead}>
                <SelectTrigger className="bg-white/5 border-white/20 text-branco-puro">
                  <SelectValue placeholder="Escolha um lead..." />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-purple-vivid/20">
                  {leadsDisponiveis.map((lead) => (
                    <SelectItem 
                      key={lead.id} 
                      value={lead.id}
                      className="text-branco-puro hover:bg-white/10"
                    >
                      {lead.nome} - {lead.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-branco-suave">Assunto (opcional)</Label>
              <Input 
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Deixe vazio para usar o do template"
                className="bg-white/5 border-white/20 text-branco-puro"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSendModalOpen(false)}
                className="flex-1 text-branco-puro border-white/20"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSendEmail}
                className="flex-1 bg-laranja-cta hover:bg-laranja-cta/80"
                disabled={sendEmail.isPending || !emailConfig}
              >
                {sendEmail.isPending ? "Enviando..." : "Enviar Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
