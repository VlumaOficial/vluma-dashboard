"use client";

import { Mail, Send, FileText, Users, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const emailTemplates = [
  {
    id: 1,
    name: "Boas-vindas",
    subject: "Bem-vindo à VLUMA!",
    description: "Email de boas-vindas para novos leads",
    usage: 45,
    status: "ativo"
  },
  {
    id: 2,
    name: "Confirmação de Agendamento",
    subject: "Sua reunião foi agendada",
    description: "Confirmação automática de agendamentos",
    usage: 23,
    status: "ativo"
  },
  {
    id: 3,
    name: "Follow-up",
    subject: "Que tal darmos continuidade?",
    description: "Email de follow-up após primeiro contato",
    usage: 12,
    status: "rascunho"
  },
  {
    id: 4,
    name: "Proposta Comercial",
    subject: "Sua proposta personalizada está pronta",
    description: "Envio de propostas comerciais",
    usage: 8,
    status: "ativo"
  }
];

const recentEmails = [
  {
    id: 1,
    to: "cliente1@exemplo.com",
    subject: "Bem-vindo à VLUMA!",
    template: "Boas-vindas",
    sentAt: "2024-01-15T10:30:00",
    status: "enviado"
  },
  {
    id: 2,
    to: "cliente2@exemplo.com",
    subject: "Sua reunião foi agendada",
    template: "Confirmação de Agendamento",
    sentAt: "2024-01-15T09:15:00",
    status: "enviado"
  },
  {
    id: 3,
    to: "cliente3@exemplo.com",
    subject: "Que tal darmos continuidade?",
    template: "Follow-up",
    sentAt: "2024-01-15T08:45:00",
    status: "aberto"
  }
];

export default function EmailsPage() {
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
                <p className="text-2xl font-bold text-branco-puro">1,234</p>
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
                <p className="text-2xl font-bold text-branco-puro">68%</p>
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
                <p className="text-2xl font-bold text-branco-puro">12</p>
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
                <p className="text-2xl font-bold text-branco-puro">456</p>
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
              <Button className="bg-laranja-cta hover:bg-laranja-cta/80">
                <FileText className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </div>
            
            <div className="space-y-4">
              {emailTemplates.map((template) => (
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
                      <p className="text-sm text-branco-puro">{template.usage}</p>
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
              ))}
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
              {recentEmails.map((email) => (
                <div
                  key={email.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-branco-puro truncate">
                        {email.to}
                      </p>
                      <p className="text-xs text-cinza-claro truncate">
                        {email.subject}
                      </p>
                    </div>
                    <Badge className={
                      email.status === "enviado" 
                        ? "bg-green-500/20 text-green-500"
                        : "bg-blue-500/20 text-blue-500"
                    }>
                      {email.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-cinza-claro">
                    <span>{email.template}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      10:30
                    </div>
                  </div>
                </div>
              ))}
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
              <Button className="w-full justify-start bg-laranja-cta hover:bg-laranja-cta/80">
                <Send className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
              <Button variant="outline" className="w-full justify-start text-cyan-vivid border-cyan-vivid/50">
                <Users className="w-4 h-4 mr-2" />
                Campanha em Massa
              </Button>
              <Button variant="outline" className="w-full justify-start text-purple-vivid border-purple-vivid/50">
                <FileText className="w-4 h-4 mr-2" />
                Relatório de Performance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
