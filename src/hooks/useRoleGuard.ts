'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { useUI } from '@/context/UIContext';

/**
 * Hook para proteger ações específicas (cliques em botões, abertura de cards).
 * Se o usuário não for um 'aluno', ele é redirecionado para a página de login.
 */
export function useRoleGuard() {
  const { user, isAluno } = useAuth();
  const { showAlert } = useUI();
  const router = useRouter();

  const executeProtectedAction = (action: () => void) => {
    if (isAluno) {
      action();
    } else if (!user) {
      // Visitante não logado vai para login
      router.push('/login');
    } else {
      // Logado como 'lead' mostra aviso
      showAlert(
        '🔒 ÁREA EXCLUSIVA PARA ALUNOS ITR',
        'Este recurso é reservado para alunos matriculados.\n\nEntre em contato com o Panda no WhatsApp para liberar seu Arsenal Elite!'
      );
    }
  };

  return { executeProtectedAction, isAluno };
}
