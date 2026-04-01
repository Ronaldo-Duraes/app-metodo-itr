'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Hook para proteger ações específicas (cliques em botões, abertura de cards).
 * Se o usuário não for um 'aluno', ele é redirecionado para a página de login.
 */
export function useRoleGuard() {
  const { isAluno } = useAuth();
  const router = useRouter();

  const executeProtectedAction = (action: () => void) => {
    if (isAluno) {
      action();
    } else {
      // Redireciona para o login se for visitante ou lead
      router.push('/login');
    }
  };

  return { executeProtectedAction, isAluno };
}
