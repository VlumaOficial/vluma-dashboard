"use client";

import { BarChart3, TrendingUp, Users, Calendar, Mail, Download } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { 
  useMainMetrics, 
  useConversionData, 
  useEmailPerformance, 
  useSalesFunnel,
  useTimeAnalysis
} from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  
  // Hooks para dados reais
  const { data: mainMetrics, isLoading: metricsLoading } = useMainMetrics(selectedPeriod);
  const { data: conversionData, isLoading: conversionLoading } = useConversionData(selectedPeriod);
  const { isLoading: emailLoading } = useEmailPerformance();
  const { data: salesFunnel, isLoading: funnelLoading } = useSalesFunnel();
  
  const handleExportReport = () => {
    toast.info("Exportando relatório... Funcionalidade em desenvolvimento");
  };
  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Análise detalhada de performance e métricas"
    >
      {/* Period Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 bg-white/5 border-white/20 text-branco-puro">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-card-dark border-purple-vivid/20">
              <SelectItem value="7days" className="text-branco-puro hover:bg-white/10">Últimos 7 dias</SelectItem>
              <SelectItem value="30days" className="text-branco-puro hover:bg-white/10">Últimos 30 dias</SelectItem>
              <SelectItem value="90days" className="text-branco-puro hover:bg-white/10">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          className="text-cyan-vivid border-cyan-vivid/50 hover:bg-cyan-vivid/10"
          onClick={handleExportReport}
        >
          <Download className="w-4 h-4 mr-2" />
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
                <p className="text-2xl font-bold text-branco-puro">
                  {metricsLoading ? "--" : `${mainMetrics?.taxaConversao.toFixed(1) || 0}%`}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className={`w-3 h-3 ${(mainMetrics?.crescimento || 0) >= 0 ? 'text-verde-inteligente' : 'text-red-400 rotate-180'}`} />
                  <span className={`text-xs ${(mainMetrics?.crescimento || 0) >= 0 ? 'text-verde-inteligente' : 'text-red-400'}`}>
                    {metricsLoading ? "--" : `${(mainMetrics?.crescimento || 0) >= 0 ? '+' : ''}${mainMetrics?.crescimento.toFixed(1) || 0}%`}
                  </span>
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
                <p className="text-2xl font-bold text-branco-puro">
                  {metricsLoading ? "--" : `${mainMetrics?.tempoMedioConversao || 0} dias`}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-verde-inteligente" />
                  <span className="text-xs text-verde-inteligente">Otimizado</span>
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
                <p className="text-2xl font-bold text-branco-puro">
                  {metricsLoading ? "--" : `R$ ${mainMetrics?.custoporLead || 0}`}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-verde-inteligente" />
                  <span className="text-xs text-verde-inteligente">Controlado</span>
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
                <p className="text-2xl font-bold text-branco-puro">
                  {metricsLoading ? "--" : `${mainMetrics?.roi || 0}%`}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-verde-inteligente" />
                  <span className="text-xs text-verde-inteligente">Excelente</span>
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
              {/* Gráfico de Conversão com Dados Reais */}
              <div className="space-y-4">
                {conversionLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-4 bg-white/10 rounded w-1/3"></div>
                        <div className="h-4 bg-white/5 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : conversionData && conversionData.length > 0 ? (
                  conversionData.map((data) => {
                    const maxLeads = Math.max(...conversionData.map(d => d.total_leads));
                    return (
                      <div key={data.period} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-branco-suave">{data.period}</span>
                          <div className="flex gap-4">
                            <span className="text-cinza-claro">{data.total_leads} leads</span>
                            <span className="text-verde-inteligente">{data.convertidos} convertidos</span>
                            <span className="text-purple-vivid">{data.taxa_conversao.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="flex gap-1 h-4">
                          <div 
                            className="bg-purple-vivid/30 rounded-sm"
                            style={{ width: `${maxLeads > 0 ? (data.total_leads / maxLeads) * 100 : 0}%` }}
                          />
                          <div 
                            className="bg-verde-inteligente rounded-sm"
                            style={{ width: `${maxLeads > 0 ? (data.convertidos / maxLeads) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                    <p className="text-cinza-claro">Nenhum dado de conversão disponível</p>
                  </div>
                )}
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
                {funnelLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                        <div className="h-2 bg-white/5 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : salesFunnel && salesFunnel.length > 0 ? (
                  salesFunnel.map((stage) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-branco-suave">{stage.stage}</span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-branco-puro">{stage.count}</p>
                          <p className="text-xs text-cinza-claro">{stage.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${stage.percentage}%`,
                            backgroundColor: stage.color
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
                    <p className="text-cinza-claro">Nenhum dado disponível</p>
                  </div>
                )}
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
                  <Badge className="bg-green-500/20 text-green-500">
                    {emailLoading ? "--" : `${mainMetrics?.taxaAberturaEmail.toFixed(0) || 0}%`}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-verde-inteligente" />
                    <div>
                      <p className="text-sm font-medium text-branco-puro">Leads Convertidos</p>
                      <p className="text-xs text-cinza-claro">Total no período</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">
                    {metricsLoading ? "--" : mainMetrics?.convertidos || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-vivid" />
                    <div>
                      <p className="text-sm font-medium text-branco-puro">Agendamentos</p>
                      <p className="text-xs text-cinza-claro">Leads agendados</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-500">
                    {metricsLoading ? "--" : mainMetrics?.agendados || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
