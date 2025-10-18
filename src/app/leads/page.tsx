"use client";

import { useState } from "react";
import { Mail, Phone, MoreHorizontal, Trash2, Eye } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useLeads, useUpdateLeadStatus, useDeleteLead } from "@/hooks/useLeads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lead } from "@/lib/supabase";

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

export default function LeadsPage() {
  const { data: leads, isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(search.toLowerCase()) ||
                         lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    updateStatus.mutate({ id: leadId, status: newStatus });
  };

  const handleDelete = (leadId: string) => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      deleteLead.mutate(leadId);
    }
  };

  return (
    <DashboardLayout 
      title="Gestão de Leads" 
      subtitle="Visualize e gerencie todos os seus leads"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro placeholder:text-cinza-claro"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-white/5 border-white/20 text-branco-puro">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="convertido">Convertido</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border border-purple-vivid/20 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-white/10 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-branco-suave">Nome</th>
                  <th className="text-left p-4 text-sm font-semibold text-branco-suave">Contato</th>
                  <th className="text-left p-4 text-sm font-semibold text-branco-suave">Data</th>
                  <th className="text-left p-4 text-sm font-semibold text-branco-suave">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-branco-suave">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-branco-puro">{lead.nome}</p>
                        {lead.mensagem && (
                          <p className="text-sm text-cinza-claro mt-1 truncate max-w-xs">
                            {lead.mensagem}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-cinza-claro">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        {lead.whatsapp && (
                          <div className="flex items-center gap-2 text-sm text-cinza-claro">
                            <Phone className="w-3 h-3" />
                            {lead.whatsapp}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-cinza-claro">
                        {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-cinza-claro">
                        {format(new Date(lead.created_at), "HH:mm", { locale: ptBR })}
                      </p>
                    </td>
                    <td className="p-4">
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as Lead["status"])}
                      >
                        <SelectTrigger className="w-32 h-8 bg-transparent border-0 p-0">
                          <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                            {statusLabels[lead.status as keyof typeof statusLabels]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="agendado">Agendado</SelectItem>
                          <SelectItem value="convertido">Convertido</SelectItem>
                          <SelectItem value="perdido">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-red-400">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-cinza-claro mx-auto mb-4" />
            <p className="text-cinza-claro text-lg">Nenhum lead encontrado</p>
            <p className="text-cinza-claro text-sm mt-2">
              {search || statusFilter !== "all" 
                ? "Tente ajustar os filtros de busca" 
                : "Os leads aparecerão aqui quando forem criados"
              }
            </p>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-card-dark to-gray-950 border-purple-vivid/20">
          <DialogHeader>
            <DialogTitle className="text-branco-puro">Detalhes do Lead</DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-branco-suave">Nome</label>
                  <p className="text-branco-puro mt-1">{selectedLead.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-branco-suave">Status</label>
                  <div className="mt-1">
                    <Badge className={statusColors[selectedLead.status as keyof typeof statusColors]}>
                      {statusLabels[selectedLead.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-branco-suave">Email</label>
                  <p className="text-branco-puro mt-1">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-branco-suave">WhatsApp</label>
                  <p className="text-branco-puro mt-1">{selectedLead.whatsapp || "Não informado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-branco-suave">Data de Cadastro</label>
                  <p className="text-branco-puro mt-1">
                    {format(new Date(selectedLead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-branco-suave">Política Aceita</label>
                  <p className="text-branco-puro mt-1">
                    {format(new Date(selectedLead.aceite_privacidade_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              {selectedLead.mensagem && (
                <div>
                  <label className="text-sm font-medium text-branco-suave">Mensagem</label>
                  <div className="mt-1 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-branco-puro text-sm">{selectedLead.mensagem}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
