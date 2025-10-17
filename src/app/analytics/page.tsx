"use client";

import { BarChart3, TrendingUp, Users, Calendar, Mail, Phone } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for charts
const conversionData = [
  { month: "Jan", leads: 45, convertidos: 12 },
  { month: "Fev", leads: 52, convertidos: 18 },
  { month: "Mar", leads: 38, convertidos: 15 },
  { month: "Abr", leads: 61, convertidos: 22 },
  { month: "Mai", leads: 55, convertidos: 19 },
  { month: "Jun", leads: 67, convertidos: 28 },
];

const leadSources = [
  { source: "Site VLUMA", leads: 145, percentage: 42 },
  { source: "Instagram", leads: 89, percentage: 26 },
  { source: "LinkedIn", leads: 67, percentage: 19 },
  { source: "Indicação", leads: 34, percentage: 10 },
  { source: "Outros", leads: 10, percentage: 3 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Análise detalhada de performance e métricas"
    >
      {/* Period Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Select defaultValue="30days">
            <SelectTrigger className="w-48 bg-white/5 border-white/20 text-branco-puro">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="text-cyan-vivid border-cyan-vivid/50">
          Exportar Relatório
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-branco-puro">34.2%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-verde-inteligente" />
                  <span className="text-xs text-verde-inteligente">+5.2%</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-vivid" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Tempo Médio</p>
                <p className="text-2xl font-bold text-branco-puro">2.5 dias</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-verde-inteligente" />
                  <span className="text-xs text-verde-inteligente">-0.3 dias</span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-cyan-vivid" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">Custo por Lead</p>
                <p className="text-2xl font-bold text-branco-puro">R$ 45</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
                  <span className="text-xs text-red-400">+R$ 3</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-verde-inteligente" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-claro">ROI</p>
                <p className="text-2xl font-bold text-branco-puro">285%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-verde-inteligente" />
                  <span className="text-xs text-verde-inteligente">+12%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-laranja-cta" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
            <CardHeader>
              <CardTitle className="text-branco-puro">Conversão por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simple Bar Chart Representation */}
              <div className="space-y-4">
                {conversionData.map((data) => {
                  const conversionRate = (data.convertidos / data.leads) * 100;
                  return (
                    <div key={data.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-branco-suave">{data.month}</span>
                        <div className="flex gap-4">
                          <span className="text-cinza-claro">{data.leads} leads</span>
                          <span className="text-verde-inteligente">{data.convertidos} convertidos</span>
                          <span className="text-purple-vivid">{conversionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-4">
                        <div 
                          className="bg-purple-vivid/30 rounded-sm"
                          style={{ width: `${(data.leads / 70) * 100}%` }}
                        />
                        <div 
                          className="bg-verde-inteligente rounded-sm"
                          style={{ width: `${(data.convertidos / 70) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-cinza-claro">
                  📊 Gráficos interativos em desenvolvimento
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-cyan-vivid border-cyan-vivid/50">
                  Ver Gráfico Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Sources */}
        <div>
          <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
            <CardHeader>
              <CardTitle className="text-branco-puro">Origem dos Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-branco-suave">{source.source}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium text-branco-puro">{source.leads}</p>
                        <p className="text-xs text-cinza-claro">{source.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-purple-vivid to-cyan-vivid"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Summary */}
          <Card className="mt-6 bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20">
            <CardHeader>
              <CardTitle className="text-branco-puro">Resumo de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-vivid" />
                    <div>
                      <p className="text-sm font-medium text-branco-puro">Email Marketing</p>
                      <p className="text-xs text-cinza-claro">Taxa de abertura</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">68%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-verde-inteligente" />
                    <div>
                      <p className="text-sm font-medium text-branco-puro">WhatsApp</p>
                      <p className="text-xs text-cinza-claro">Taxa de resposta</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">89%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-vivid" />
                    <div>
                      <p className="text-sm font-medium text-branco-puro">Agendamentos</p>
                      <p className="text-xs text-cinza-claro">Taxa de comparecimento</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-500">76%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
