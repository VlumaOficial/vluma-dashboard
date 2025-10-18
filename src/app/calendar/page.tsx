"use client";

import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useLeads, useUpdateLeadStatus } from "@/hooks/useLeads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CalendarPage() {
  const { data: leads, isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const [isIntegrating, setIsIntegrating] = useState(false);
  
  // Estados do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [agendamentoHora, setAgendamentoHora] = useState<string>("");
  
  const agendamentos = leads?.filter(lead => lead.status === "agendado") || [];
  const proximosAgendamentos = agendamentos.slice(0, 10);
  
  // Gerar dias do mês atual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Leads disponíveis para agendamento (pendentes)
  const leadsDisponiveis = leads?.filter(lead => lead.status === "pendente") || [];

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

  // Funções do calendário
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsAgendamentoModalOpen(true);
  };

  const handleAgendarLead = async () => {
    if (!selectedLeadId || !selectedDate || !agendamentoHora) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const dataHora = new Date(selectedDate);
    const [hora, minuto] = agendamentoHora.split(":");
    dataHora.setHours(parseInt(hora), parseInt(minuto));

    // Atualizar o lead com status agendado e data/hora
    updateStatus.mutate(
      { id: selectedLeadId, status: "agendado" },
      {
        onSuccess: () => {
          const leadNome = leads?.find(l => l.id === selectedLeadId)?.nome || "Lead";
          toast.success(`${leadNome} agendado para ${format(dataHora, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}!`);
          setIsAgendamentoModalOpen(false);
          setSelectedLeadId("");
          setAgendamentoHora("");
          setSelectedDate(null);
        }
      }
    );
  };

  // Verificar se uma data tem agendamentos
  const getAgendamentosNaData = (date: Date) => {
    return agendamentos.filter(lead => {
      if (!lead.data_agendamento) return false;
      return isSameDay(new Date(lead.data_agendamento), date);
    });
  };

  const hasAgendamentoNaData = (date: Date) => {
    return getAgendamentosNaData(date).length > 0;
  };

  return (
    <DashboardLayout 
      title="Agendamentos" 
      subtitle="Gerencie seus agendamentos e reuniões"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário Funcional */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            {/* Header do Calendário */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-branco-puro">
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviousMonth}
                  className="text-branco-puro border-white/20 hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextMonth}
                  className="text-branco-puro border-white/20 hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center p-2 text-sm font-medium text-branco-suave">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Dias do Mês */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((date) => {
                const hasAgendamento = hasAgendamentoNaData(date);
                const isCurrentDay = isToday(date);
                const agendamentosNaData = getAgendamentosNaData(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={`
                      aspect-square flex flex-col items-center justify-center text-sm rounded-lg border transition-all cursor-pointer relative
                      ${isCurrentDay 
                        ? "bg-purple-vivid/30 border-purple-vivid text-branco-puro font-bold" 
                        : "border-white/10 text-branco-puro hover:bg-white/10 hover:border-purple-vivid/50"
                      }
                      ${hasAgendamento ? "bg-verde-inteligente/20 border-verde-inteligente/50" : ""}
                    `}
                  >
                    <span>{format(date, "d")}</span>
                    {hasAgendamento && (
                      <div className="flex gap-1 mt-1">
                        {agendamentosNaData.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-verde-inteligente rounded-full"></div>
                        ))}
                        {agendamentosNaData.length > 3 && (
                          <span className="text-xs text-verde-inteligente">+{agendamentosNaData.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-cinza-claro mb-3">
                📅 Clique em uma data para agendar um lead
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-cyan-vivid border-cyan-vivid/50 hover:bg-cyan-vivid/10"
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

      {/* Modal de Agendamento */}
      <Dialog open={isAgendamentoModalOpen} onOpenChange={setIsAgendamentoModalOpen}>
        <DialogContent className="bg-card-dark border-purple-vivid/20">
          <DialogHeader>
            <DialogTitle className="text-branco-puro">
              Agendar Lead para {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {leadsDisponiveis.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-cinza-claro">Nenhum lead pendente disponível para agendamento.</p>
                <p className="text-sm text-cinza-claro mt-2">
                  Vá para a página de leads para ver todos os leads.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="lead-select" className="text-branco-suave">
                    Selecionar Lead
                  </Label>
                  <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
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
                  <Label htmlFor="hora-select" className="text-branco-suave">
                    Horário
                  </Label>
                  <Select value={agendamentoHora} onValueChange={setAgendamentoHora}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-branco-puro">
                      <SelectValue placeholder="Escolha um horário..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card-dark border-purple-vivid/20">
                      {[
                        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
                        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
                        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
                        "17:00", "17:30", "18:00", "18:30"
                      ].map((hora) => (
                        <SelectItem 
                          key={hora} 
                          value={hora}
                          className="text-branco-puro hover:bg-white/10"
                        >
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAgendamentoModalOpen(false)}
                    className="flex-1 text-branco-puro border-white/20 hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAgendarLead}
                    className="flex-1 bg-verde-inteligente hover:bg-verde-inteligente/80"
                    disabled={!selectedLeadId || !agendamentoHora}
                  >
                    Agendar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
