import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wepgwljeypsymffkhahq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlcGd3bGpleXBzeW1mZmtoYWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjM4MDcsImV4cCI6MjA3NjEzOTgwN30.47aomdL0SBEiG3lWI-DyTAyYm0Q27ARe4uoYW3T06MM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface Lead {
  id: string
  nome: string
  email: string
  whatsapp: string
  mensagem?: string
  status: 'pendente' | 'contatado' | 'agendado' | 'convertido' | 'perdido'
  created_at: string
  respostas_id?: string
  aceite_privacidade_em: string
  data_agendamento?: string
}

export interface RespostaQuestionario {
  id: string
  segmento: string[]
  funcao_na_empresa?: string
  objetivo_simplificar?: string
  situacao_atual?: string
  motivacao: string[]
  maturidade_digital?: string
  created_at: string
}
