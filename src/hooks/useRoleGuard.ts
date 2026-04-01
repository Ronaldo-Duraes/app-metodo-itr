'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

/**
 * Hook para proteger ações específicas (cliques em botões, abertura de cards).
 * Se o usuário não for um 'aluno', ele é redirecionado para a página de login.
 */
export function useRoleGuard() {
  const { user, isAluno } = useAuth();
  const router = useRouter();

  const executeProtectedAction = (action: () => void) => {
    if (isAluno) {
      action();
    } else if (!user) {
      // Visitante não logado vai para login
      router.push('/login');
    } else {
      // Logado como 'lead' mostra aviso
      alert('🔒 ÁREA EXCLUSIVA PARA ALUNOS ITR\n\nEste recurso é reservado para alunos matriculados. Entre em contato com o Panda para liberar seu Arsenal!');
    }
  };

  return { executeProtectedAction, isAluno };
}
