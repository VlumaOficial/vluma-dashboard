import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    // Teste 1: Verificar se consegue ler dados
    const { data: readData, error: readError } = await supabase
      .from('contatos')
      .select('id, nome, status')
      .limit(1);
    
    if (readError) {
      console.error('❌ Erro ao ler dados:', readError);
      return { success: false, error: readError };
    }
    
    console.log('✅ Leitura de dados funcionando:', readData);
    
    if (!readData || readData.length === 0) {
      console.log('⚠️ Nenhum lead encontrado para testar atualização');
      return { success: true, message: 'Conexão OK, mas sem dados para testar' };
    }
    
    const testLead = readData[0];
    console.log('🧪 Testando atualização com lead:', testLead);
    
    // Teste 2: Tentar atualizar (sem mudar o valor atual)
    const { data: updateData, error: updateError } = await supabase
      .from('contatos')
      .update({ status: testLead.status }) // Mantém o mesmo status
      .eq('id', testLead.id)
      .select();
    
    if (updateError) {
      console.error('❌ Erro ao atualizar dados:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      return { success: false, error: updateError };
    }
    
    console.log('✅ Atualização funcionando:', updateData);
    
    return { 
      success: true, 
      message: 'Todas as operações funcionando corretamente',
      testLead,
      updateResult: updateData
    };
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return { success: false, error };
  }
}

export async function checkSupabaseAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('🔐 Status da autenticação:', {
      hasSession: !!session,
      user: session?.user?.email || 'Não autenticado',
      error: error?.message
    });
    
    return { session, error };
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return { session: null, error };
  }
}
