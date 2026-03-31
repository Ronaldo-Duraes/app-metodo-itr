'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Sidebar from "@/components/sidebar/Sidebar";
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile, checkMasteryMilestone, playMasterySound, playBlipSound } from '@/lib/srs';
import MasteryModal from './MasteryModal';
import { initDebugMode } from '@/lib/debug';
import { checkAndStartAutoTour } from '@/lib/tour';

const WelcomeScreen = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000] font-outfit overflow-hidden">
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }} 
      className="text-center"
    >
      <span className="text-[10px] font-black text-emerald-500 tracking-[0.6em] uppercase mb-4 block animate-pulse text-center w-full">Ambiente de Elite</span>
      <h1 className="text-7xl md:text-9xl font-black text-emerald-500 tracking-[-0.05em] uppercase drop-shadow-[0_0_50px_rgba(16,185,129,0.4)] leading-none px-4 text-center">
        Boas-vindas
      </h1>
    </motion.div>
  </div>
);

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    // Sincronizar estado com o sessionStorage IMEDIATAMENTE antes da pintura
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    
    if (welcomeShown) {
      setShowSplash(false);
    }
    
    setIsInitialized(true);
    initDebugMode();
  }, []);

  useEffect(() => {
    // Fechar a splash após o tempo cinematográfico rigoroso
    if (showSplash && isInitialized) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('welcomeShown', 'true');
        }
      }, 1500); 
      return () => clearTimeout(timer);
    }
    
    // Iniciar tour se necessário após a splash
    if (!showSplash && isInitialized) {
      checkAndStartAutoTour();
    }
  }, [showSplash, isInitialized]);

  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  // --- MONITORAMENTO DE MAESTRIA (EPIC) ---
  useEffect(() => {
    if (showSplash || !isInitialized) return;
    
    const checkMastery = () => {
      const profile = getUserProfile();
      const count = profile.totalWordsAdded || 0;
      const reached = checkMasteryMilestone(count);
      
      if (reached) {
        setActiveMilestone(reached.value);
        if (reached.isMastery) {
          playMasterySound();
        } else {
          playBlipSound();
        }
      }
    };

    // Verifica inicialmente e depois a cada 2 seg
    checkMastery();
    const interval = setInterval(checkMastery, 2000);
    return () => clearInterval(interval);
  }, [showSplash, isInitialized]);

  // --- LÓGICA ANTI-FLASH: RETORNO ABSOLUTO ---
  // Se a splash deve aparecer, NÃO RENDERIZA NADA (Sidebar, Main, Conteúdo) além dela.
  if (showSplash && isInitialized) {
    return <WelcomeScreen />;
  }

  // Prevenção de flash durante inicialização do sessionStorage
  if (!isInitialized) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-8 relative overflow-y-auto h-screen scroll-smooth transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <AnimatePresence>
        {activeMilestone && (
          <MasteryModal 
            milestone={activeMilestone} 
            onClose={() => setActiveMilestone(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
