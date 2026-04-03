'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useUI } from '@/context/UIContext';

/**
 * Hook para proteger ações específicas (cliques em botões, abertura de cards).
 * Se o usuário não for um 'aluno', exibe modal de Acesso Restrito com link para metodoitr.com.br.
 */
export function useRoleGuard() {
  const { user, isAluno } = useAuth();
  const { showAlert, showConfirm } = useUI();
  const router = useRouter();

  const executeProtectedAction = (action: () => void) => {
    if (isAluno) {
      action();
    } else if (!user) {
      // Visitante não logado vai para login
      router.push('/login');
    } else {
      // Logado como 'usuario' — mostra modal de acesso restrito com link para Saiba Mais
      showConfirm(
        '🔒 ACESSO EXCLUSIVO PARA ALUNOS',
        'Este conteúdo é exclusivo para alunos do Método ITR. Para desbloquear o acesso completo ao Arsenal, Flashcards, Atividades e todo o sistema de fluência, conheça o método.',
        () => {
          // Redireciona para o site do método ITR
          window.open('https://metodoitr.com.br', '_blank');
        },
        'SAIBA MAIS'
      );
    }
  };

  return { executeProtectedAction, isAluno };
}
