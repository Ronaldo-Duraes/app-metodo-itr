'use client';

import React, { useEffect, useState } from 'react';
// @ts-ignore
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/firebase';

const STEPS: any[] = [
  {
    target: 'body',
    content: (
      <div className="font-outfit text-white">
        <h2 className="text-xl font-black text-emerald-500 uppercase mb-2">Bem-vindo(a) ao ITR!</h2>
        <p className="text-sm font-semibold text-zinc-300">
          Você já está com acesso de aluno ativo. Vamos fazer um tour rápido para você dominar o portal.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '#tour-aulas',
    content: 'Acesse suas aulas em vídeo com o método completo do Método ITR.',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '#tour-atividades',
    content: 'Desafios e tarefas diárias que você deve seguir para atingir a fluência.',
    placement: 'right',
  },
  {
    target: '#tour-flashcards',
    content: 'Sistema de Revisão Espaçada (SRS). Memorize palavras para sempre.',
    placement: 'right',
  },
  {
    target: '#tour-dicionario',
    content: 'Guarde novas palavras, expressões e sentences das suas sessões de mining.',
    placement: 'right',
  },
  {
    target: '#tour-perfil',
    content: 'Acompanhe seu progresso, defina suas metas e gerencie seus dados.',
    placement: 'top',
  }
];

export default function WelcomeTour() {
  const { user, profile } = useAuth();
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run if the user's profile specifies firstLogin: true
    if (profile && profile.firstLogin === true) {
      const isMobile = window.innerWidth < 768;
      
      // On mobile, elements in the sidebar may be hidden.
      // So we might skip the tour on mobile, or just run it and let Joyride handle missing elements.
      // Let's run it after a short delay for smooth rendering.
      const timer = setTimeout(() => {
        // If mobile, we should probably only show the welcome modal since the sidebar is hidden.
        if (isMobile) {
          // We can dynamically shrink STEPS for mobile if we want, or rely on Joyride skipping missing targets.
        }
        setRun(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleJoyrideCallback = async (data: any) => {
    const { status, action, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Se o target não foi encontrado, react-joyride emite status="error".
    // Isso acontece muito no mobile porque a sidebar tá escondida (hidden md:block).
    // Para resolver sem travar o app, deixamos o Joyride pular o elemento ou finalizar.

    if (finishedStatuses.includes(status) || action === 'close') {
      setRun(false);
      
      if (user?.uid) {
        try {
          await updateUserProfile(user.uid, { firstLogin: false } as any);
        } catch (error) {
          console.error("Erro ao atualizar firstLogin no Firestore:", error);
        }
      }
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={STEPS}
      run={run}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      disableScrolling={true}
      styles={{
        options: {
          arrowColor: '#0a0a0a',
          backgroundColor: '#0a0a0a',
          overlayColor: 'rgba(0, 0, 0, 0.85)',
          primaryColor: '#10b981',
          textColor: '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.1)',
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: '#10b981',
          color: '#000',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '11px',
          padding: '10px 20px',
          borderRadius: '8px'
        },
        buttonBack: {
          color: '#9ca3af',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '11px',
          marginRight: '12px'
        },
        buttonSkip: {
          color: '#ef4444',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '11px',
        }
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Avançar',
        skip: 'Pular Tour'
      }}
    />
  );
}
