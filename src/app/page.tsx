"use client";

import { Users, UserCheck, Calendar, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";

export default function Home() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Visão geral dos seus leads e métricas"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Leads"
          value="247"
          change={{ value: 12, type: "increase" }}
          icon={Users}
          gradient="from-purple-vivid to-blue-vivid"
        />
        <StatsCard
          title="Leads Convertidos"
          value="89"
          change={{ value: 8, type: "increase" }}
          icon={UserCheck}
          gradient="from-verde-inteligente to-cyan-vivid"
        />
        <StatsCard
          title="Agendamentos"
          value="34"
          change={{ value: 15, type: "increase" }}
          icon={Calendar}
          gradient="from-laranja-cta to-pink-vivid"
        />
        <StatsCard
          title="Taxa de Conversão"
          value="36%"
          change={{ value: 3, type: "increase" }}
          icon={TrendingUp}
          gradient="from-cyan-vivid to-purple-vivid"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Recentes */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-branco-puro mb-4">
              Leads Recentes
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-vivid/30 transition-colors"
                >
                  <div>
                    <p className="font-medium text-branco-puro">Lead {i}</p>
                    <p className="text-sm text-cinza-claro">email{i}@exemplo.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cinza-claro">Hoje, 14:30</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-laranja-cta/20 text-laranja-cta">
                      Pendente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Próximos Agendamentos */}
        <div>
          <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-branco-puro mb-4">
              Próximos Agendamentos
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <p className="font-medium text-branco-puro text-sm">
                    Reunião com Cliente {i}
                  </p>
                  <p className="text-xs text-cinza-claro mt-1">
                    Amanhã, 10:00
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
