"use client";

import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useLeads, useUpdateLeadStatus } from "@/hooks/useLeads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";

export default function CalendarPage() {
  const { data: leads, isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const [isIntegrating, setIsIntegrating] = useState(false);
  
  const agendamentos = leads?.filter(lead => lead.status === "agendado") || [];
  const proximosAgendamentos = agendamentos.slice(0, 10);

  // Handlers para as ações de agendamento
  const handleConfirmarAgendamento = (leadId: string, leadName: string) => {
    updateStatus.mutate(
      { id: leadId, status: "convertido" },
      {
        onSuccess: () => {
          toast.success(`Agendamento de ${leadName} confirmado e marcado como convertido!`);
        }
      }
    );
  };

  const handleReagendarAgendamento = (leadId: string, leadName: string) => {
    // Por enquanto, apenas mostra uma mensagem
    toast.info(`Reagendamento de ${leadName} - Funcionalidade em desenvolvimento`);
    // TODO: Implementar modal de reagendamento com seleção de data/hora
  };

  const handleNovoAgendamento = () => {
    toast.info("Novo Agendamento - Redirecionando para gestão de leads...");
    // Redirecionar para página de leads para alterar status
    window.location.href = "/leads";
  };

  const handleVerAgendaCompleta = () => {
    toast.info("Agenda Completa - Funcionalidade em desenvolvimento");
    // TODO: Implementar visualização completa do calendário
  };

  const handleIntegrarGoogleCalendar = async () => {
    setIsIntegrating(true);
    toast.info("Integrando com Google Calendar...");
    
    // Simular integração (substituir por implementação real)
    setTimeout(() => {
      setIsIntegrating(false);
      toast.success("Integração com Google Calendar configurada! (Demo)");
    }, 2000);
  };

  return (
    <DashboardLayout 
      title="Agendamentos" 
      subtitle="Gerencie seus agendamentos e reuniões"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-branco-puro mb-6">
              Calendário
            </h3>
            
            {/* Calendar Grid - Simplified */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center p-2 text-sm font-medium text-branco-suave">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Start from previous month
                const isCurrentMonth = day > 0 && day <= 31;
                const hasEvent = isCurrentMonth && [5, 12, 18, 25].includes(day);
                
                return (
                  <div
                    key={i}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-lg border border-white/10 transition-colors
                      ${isCurrentMonth 
                        ? "text-branco-puro hover:bg-white/10" 
                        : "text-cinza-claro"
                      }
                      ${hasEvent ? "bg-purple-vivid/20 border-purple-vivid/50" : ""}
                    `}
                  >
                    {isCurrentMonth ? day : day > 0 ? day - 31 : 30 + day}
                    {hasEvent && (
                      <div className="absolute w-2 h-2 bg-purple-vivid rounded-full mt-6"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-cinza-claro">
                📅 Calendário completo em desenvolvimento
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-cyan-vivid border-cyan-vivid/50 hover:bg-cyan-vivid/10"
                onClick={handleIntegrarGoogleCalendar}
                disabled={isIntegrating}
              >
                {isIntegrating ? "Integrando..." : "Integrar Google Calendar"}
              </Button>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-branco-puro mb-4">
              Próximos Agendamentos
            </h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse p-4 bg-white/5 rounded-lg">
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : proximosAgendamentos.length > 0 ? (
              <div className="space-y-4">
                {proximosAgendamentos.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-vivid/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-vivid" />
                        <p className="font-medium text-branco-puro text-sm">
                          {lead.nome}
                        </p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-500">
                        Agendado
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-cinza-claro">
                        <Clock className="w-3 h-3" />
                        {lead.data_agendamento 
                          ? format(new Date(lead.data_agendamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          : "Data a definir"
                        }
                      </div>
                      <div className="flex items-center gap-2 text-cinza-claro">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      {lead.whatsapp && (
                        <div className="flex items-center gap-2 text-cinza-claro">
                          <Phone className="w-3 h-3" />
                          {lead.whatsapp}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs hover:bg-white/10"
                        onClick={() => handleReagendarAgendamento(lead.id, lead.nome)}
                      >
                        Reagendar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs bg-verde-inteligente hover:bg-verde-inteligente/80"
                        onClick={() => handleConfirmarAgendamento(lead.id, lead.nome)}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                <p className="text-cinza-claro text-sm">Nenhum agendamento</p>
                <p className="text-cinza-claro text-xs mt-1">
                  Agendamentos aparecerão aqui
                </p>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h4 className="text-md font-semibold text-branco-puro mb-4">
              Ações Rápidas
            </h4>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start bg-laranja-cta hover:bg-laranja-cta/80"
                onClick={handleNovoAgendamento}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-cyan-vivid border-cyan-vivid/50 hover:bg-cyan-vivid/10"
                onClick={handleVerAgendaCompleta}
              >
                <Clock className="w-4 h-4 mr-2" />
                Ver Agenda Completa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
