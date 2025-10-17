"use client";

import { useState } from "react";
import { User, Database, Bell, Shield, Save, TestTube } from "lucide-react";
import { testSupabaseConnection, checkSupabaseAuth } from "@/lib/supabase-test";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "VLUMA",
    email: "admin@vluma.com",
    phone: "",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    notifications: true,
    autoBackup: true,
  });

  const handleSave = () => {
    // Aqui você pode implementar a lógica para salvar as configurações
    toast.success("Configurações salvas com sucesso!");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestSupabase = async () => {
    toast.info("Testando conexão com Supabase...");
    
    try {
      await checkSupabaseAuth();
      const testResult = await testSupabaseConnection();
      
      if (testResult.success) {
        toast.success("✅ Conexão com Supabase funcionando!");
      } else {
        const errorMessage = testResult.error && typeof testResult.error === 'object' && 'message' in testResult.error 
          ? (testResult.error as { message: string }).message 
          : 'Erro desconhecido';
        toast.error(`❌ Erro na conexão: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("❌ Erro ao testar conexão");
      console.error("Erro no teste:", error);
    }
  };

  return (
    <DashboardLayout 
      title="Configurações" 
      subtitle="Gerencie as configurações do sistema"
    >
      <div className="space-y-6">
        {/* Configurações da Empresa */}
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-branco-puro">
              <User className="w-5 h-5 text-purple-vivid" />
              Informações da Empresa
            </CardTitle>
            <CardDescription className="text-cinza-claro">
              Configure as informações básicas da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-branco-suave">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-branco-suave">E-mail Principal</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-branco-suave">Telefone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Banco de Dados */}
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-branco-puro">
              <Database className="w-5 h-5 text-cyan-vivid" />
              Configurações do Banco de Dados
            </CardTitle>
            <CardDescription className="text-cinza-claro">
              Configurações de conexão com o Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supabaseUrl" className="text-branco-suave">URL do Supabase</Label>
              <Input
                id="supabaseUrl"
                value={settings.supabaseUrl}
                onChange={(e) => handleInputChange("supabaseUrl", e.target.value)}
                className="bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro"
                readOnly
              />
              <p className="text-xs text-cinza-claro mt-1">
                Esta configuração é definida nas variáveis de ambiente
              </p>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-red-400 font-medium mb-2">⚠️ Problema Identificado</h4>
              <p className="text-sm text-red-300 mb-3">
                Erro 400 ao atualizar status dos leads. Possíveis causas:
              </p>
              <ul className="text-xs text-red-300 space-y-1 ml-4">
                <li>• RLS (Row Level Security) bloqueando atualizações</li>
                <li>• Políticas de segurança restritivas</li>
                <li>• Chave de API sem permissões de escrita</li>
              </ul>
              <div className="mt-3 flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-cyan-vivid/50 text-cyan-400 hover:bg-cyan-vivid/10"
                  onClick={handleTestSupabase}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => window.open('https://supabase.com/dashboard/project/' + settings.supabaseUrl.split('//')[1].split('.')[0] + '/auth/policies', '_blank')}
                >
                  Abrir Painel do Supabase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-branco-puro">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notificações
            </CardTitle>
            <CardDescription className="text-cinza-claro">
              Configure as preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-branco-suave">Notificações de Novos Leads</Label>
                <p className="text-sm text-cinza-claro">Receba notificações quando novos leads chegarem</p>
              </div>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange("notifications", !settings.notifications)}
                className={settings.notifications ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {settings.notifications ? "Ativado" : "Desativado"}
              </Button>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-branco-suave">Backup Automático</Label>
                <p className="text-sm text-cinza-claro">Fazer backup automático dos dados diariamente</p>
              </div>
              <Button
                variant={settings.autoBackup ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange("autoBackup", !settings.autoBackup)}
                className={settings.autoBackup ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {settings.autoBackup ? "Ativado" : "Desativado"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-branco-puro">
              <Shield className="w-5 h-5 text-red-500" />
              Segurança
            </CardTitle>
            <CardDescription className="text-cinza-claro">
              Configurações de segurança e privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-400">
                <strong>Importante:</strong> As configurações de segurança são gerenciadas através do Supabase. 
                Para alterações avançadas, acesse o painel administrativo do Supabase.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-vivid to-cyan-vivid hover:from-purple-vivid/80 hover:to-cyan-vivid/80 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
