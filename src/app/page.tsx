"use client";

import { Users, UserCheck, Calendar, TrendingUp, Mail, Phone } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { useLeads, useLeadStats } from "@/hooks/useLeads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  pendente: "bg-yellow-500/20 text-yellow-500",
  agendado: "bg-purple-500/20 text-purple-500",
  convertido: "bg-green-500/20 text-green-500",
  perdido: "bg-red-500/20 text-red-500",
};

const statusLabels = {
  pendente: "Pendente",
  agendado: "Agendado",
  convertido: "Convertido",
  perdido: "Perdido",
};

export default function Home() {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: stats, isLoading: statsLoading } = useLeadStats();

  const recentLeads = leads?.slice(0, 5) || [];
  const agendamentos = leads?.filter(lead => lead.status_agendamento === "agendado").slice(0, 3) || [];

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Visão geral dos seus leads e métricas"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Leads"
          value={statsLoading ? "..." : stats?.total.toString() || "0"}
          change={stats ? { value: stats.crescimento, type: stats.crescimentoTipo } : undefined}
          icon={Users}
          gradient="from-purple-vivid to-blue-vivid"
        />
        <StatsCard
          title="Leads Convertidos"
          value={statsLoading ? "..." : stats?.convertidos.toString() || "0"}
          change={stats ? { value: Math.round((stats.convertidos / (stats.total || 1)) * 100), type: "increase" } : undefined}
          icon={UserCheck}
          gradient="from-verde-inteligente to-cyan-vivid"
        />
        <StatsCard
          title="Agendamentos"
          value={statsLoading ? "..." : stats?.agendados.toString() || "0"}
          change={stats ? { value: Math.round((stats.agendados / (stats.total || 1)) * 100), type: "increase" } : undefined}
          icon={Calendar}
          gradient="from-laranja-cta to-pink-vivid"
        />
        <StatsCard
          title="Taxa de Conversão"
          value={statsLoading ? "..." : `${stats?.taxaConversao || 0}%`}
          change={stats ? { value: stats.taxaConversao, type: "increase" } : undefined}
          icon={TrendingUp}
          gradient="from-cyan-vivid to-purple-vivid"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Recentes */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-branco-puro">
                Leads Recentes
              </h3>
              <Button variant="outline" size="sm" className="text-cyan-vivid border-cyan-vivid/50 hover:bg-cyan-vivid/10">
                Ver Todos
              </Button>
            </div>
            
            {leadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse p-4 bg-white/5 rounded-lg">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-vivid/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-branco-puro">{lead.nome}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-cinza-claro">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        {lead.whatsapp && (
                          <div className="flex items-center gap-1 text-sm text-cinza-claro">
                            <Phone className="w-3 h-3" />
                            {lead.whatsapp}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-cinza-claro mb-2">
                        {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <Badge className={statusColors[lead.status_agendamento]}>
                        {statusLabels[lead.status_agendamento]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                <p className="text-cinza-claro">Nenhum lead encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Próximos Agendamentos */}
        <div>
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-branco-puro mb-4">
              Próximos Agendamentos
            </h3>
            
            {agendamentos.length > 0 ? (
              <div className="space-y-3">
                {agendamentos.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <p className="font-medium text-branco-puro text-sm">
                      {lead.nome}
                    </p>
                    <p className="text-xs text-cinza-claro mt-1">
                      {lead.data_agendamento 
                        ? format(new Date(lead.data_agendamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                        : "Data a definir"
                      }
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Mail className="w-3 h-3 text-cyan-vivid" />
                      <span className="text-xs text-cyan-vivid">{lead.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                <p className="text-cinza-claro text-sm">Nenhum agendamento</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
