'use client';

import React, { useEffect, useState, useRef } from 'react';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/firebase';

interface Props {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
}

export default function WelcomeTour({ isSidebarOpen, setIsSidebarOpen }: Props) {
  const { user, profile } = useAuth();
  const [shouldRun, setShouldRun] = useState(false);
  const driverRef = useRef<any>(null);

  useEffect(() => {
    if (profile && profile.firstLogin === true) {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        // Silenty mark as completed on mobile to prevent any loading footprint overhead or freezes
        if (user?.uid) updateUserProfile(user.uid, { firstLogin: false } as any);
        return;
      }
      // Delay initial render slightly to allow React DOM stability
      const timer = setTimeout(() => {
        setShouldRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [profile, user]);

  useEffect(() => {
    if (!shouldRun) return;

    const isMobile = window.innerWidth < 768;

    const steps: any[] = [
      {
        element: 'body',
        popover: {
          title: 'Bem-vindo(a) ao ITR!',
          description: 'Você acaba de ganhar acesso de aluno. Vamos a um rápido tour para você conhecer sua nova área de elite.',
          side: 'bottom',
          align: 'center',
        },
        _isSidebarStep: false
      },
      {
        element: isMobile ? '#mobile-tour-aulas' : '#tour-aulas',
        popover: {
          title: 'Portal de Aulas',
          description: 'Acesse todo o conteúdo em vídeo e as lições completas por aqui.',
          side: 'right',
          align: 'start',
        },
        _isSidebarStep: true
      },
      {
        element: isMobile ? '#mobile-tour-atividades' : '#tour-atividades',
        popover: {
          title: 'Atividades e Desafios',
          description: 'Aplicações práticas para você exercitar sua fluência em cenários reais.',
          side: 'right',
          align: 'start',
        },
        _isSidebarStep: true
      },
      {
        element: isMobile ? '#mobile-tour-flashcards' : '#tour-flashcards',
        popover: {
          title: 'Sistema de Revisão (SRS)',
          description: 'Memorize as palavras com eficiência máxima usando nossos Flashcards de repetição espaçada.',
          side: 'right',
          align: 'start',
        },
        _isSidebarStep: true
      },
      {
        element: isMobile ? '#mobile-tour-dicionario' : '#tour-dicionario',
        popover: {
          title: 'Dicionário Pessoal',
          description: 'Seu arsenal de vocabulário privado. Tudo que você aprende fica salvo aqui.',
          side: 'right',
          align: 'start',
        },
        _isSidebarStep: true
      },
      {
        element: isMobile ? '#mobile-tour-perfil' : '#tour-perfil',
        popover: {
          title: 'Perfil',
          description: 'Veja sua progressão (Rank), seus certificados conquistados e configure sua conta.',
          side: isMobile ? 'top' : 'right',
          align: 'start',
        },
        _isSidebarStep: true
      }
    ];

    const handleSidebarAndMove = (targetStep: any, action: () => void) => {
      const isSidebarReq = targetStep._isSidebarStep;
      if (isMobile && isSidebarReq) {
        setIsSidebarOpen(true);
        // Atraso para aguardar a AnimatePresence do sidebar no DOM
        setTimeout(() => {
          action();
        }, 400); 
      } else {
        if (isMobile) setIsSidebarOpen(false);
        action();
      }
    };

    const driverObj = driver({
      showProgress: true,
      animate: !isMobile, // Disable complex animations on mobile for pure performance
      stagePadding: 5,
      allowClose: true,
      nextBtnText: 'Avançar',
      prevBtnText: 'Voltar',
      doneBtnText: 'Começar',
      showButtons: ['next', 'previous', 'close'],
      steps: steps,
      popoverClass: 'itr-tour-popover',
      onPopoverRender: (popover) => {
        // High z-index to overlay EVERYTHING including fixed sticky headers and portals
        if (popover.wrapper) {
            popover.wrapper.style.zIndex = '2147483647';
        }
        const overlay = document.querySelector('.driver-overlay') as HTMLElement;
        if (overlay) {
            overlay.style.zIndex = '2147483646';
        }
      },
      onNextClick: (element, step, { config, state }) => {
         const activeId = state?.activeIndex ?? 0;
         const nextIndex = activeId + 1;
         if (nextIndex >= (config.steps?.length ?? 0)) {
            driverObj.destroy();
            return;
         }
         handleSidebarAndMove(config.steps![nextIndex], () => driverObj.moveNext());
      },
      onPrevClick: (element, step, { config, state }) => {
         const activeId = state?.activeIndex ?? 0;
         const prevIndex = activeId - 1;
         if (prevIndex < 0) return;
         handleSidebarAndMove(config.steps![prevIndex], () => driverObj.movePrevious());
      },
      onDestroyed: () => {
         setIsSidebarOpen(false);
         setShouldRun(false);
         if (user?.uid) {
           updateUserProfile(user.uid, { firstLogin: false } as any).catch(console.error);
         }
      }
    });

    driverRef.current = driverObj;
    
    // First step logic
    const firstStep = steps[0];
    if (isMobile && firstStep._isSidebarStep) {
       setIsSidebarOpen(true);
       setTimeout(() => driverObj.drive(), 400);
    } else {
       driverObj.drive();
    }

    return () => {
      if (driverRef.current) driverRef.current.destroy();
    };
  }, [shouldRun, user, setIsSidebarOpen]);

  return (
    <style jsx global>{`
      .itr-tour-popover {
        background-color: #0a0a0a !important;
        color: #ffffff !important;
        border: 1px solid rgba(245, 158, 11, 0.5) !important;
        border-radius: 12px !important;
        box-shadow: 0 0 50px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(245, 158, 11, 0.1) !important;
        font-family: inherit !important;
      }
      .itr-tour-popover .driver-popover-title {
        color: #f59e0b !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        text-shadow: 0 0 10px rgba(245, 158, 11, 0.5) !important;
      }
      .itr-tour-popover .driver-popover-description {
        color: #d1d5db !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      .itr-tour-popover .driver-popover-next-btn, 
      .itr-tour-popover .driver-popover-done-btn {
        background-color: #f59e0b !important;
        color: #000 !important;
        text-shadow: none !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.1em !important;
        border-radius: 6px !important;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.4) !important;
      }
      .itr-tour-popover .driver-popover-prev-btn {
        color: #9ca3af !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        background: transparent !important;
        border: none !important;
      }
      .itr-tour-popover .driver-popover-close-btn {
        color: #ef4444 !important;
      }
      .itr-tour-popover .driver-popover-progress-text {
        color: #f59e0b !important;
        font-weight: bold !important;
      }
      body .driver-active-element {
        box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.5), 0 0 30px rgba(245, 158, 11, 0.8) !important;
        border-radius: 8px !important;
      }
    `}</style>
  );
}
