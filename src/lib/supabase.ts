import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

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
