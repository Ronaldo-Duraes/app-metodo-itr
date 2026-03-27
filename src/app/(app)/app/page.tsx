'use client';
 
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCards, getPriorityCards } from '@/lib/srs';
import { Play, Zap } from 'lucide-react';
import Link from 'next/link';
 
export default function HomePage() {
  const [pendingCount, setPendingCount] = useState(0);
  // Iniciar mostrando a splash apenas se não tiver sido exibida (e no server render)
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
 
  useLayoutEffect(() => {
    // Sincronizar estado com o sessionStorage IMEDIATAMENTE antes da pintura
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    
    if (welcomeShown) {
      setShowSplash(false);
      setIsReady(true);
    }
    
    setIsInitialized(true);

    // Carregar dados de cards
    const cards = getCards();
    const priority = getPriorityCards(cards);
    setPendingCount(priority.length);
  }, []);

  useEffect(() => {
    // Se a splash estiver ativa, agendar o fechamento com tempo reduzido (1600ms)
    if (showSplash && isInitialized) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsReady(true);
        sessionStorage.setItem('welcomeShown', 'true');
      }, 1600); 
      return () => clearTimeout(timer);
    }
  }, [showSplash, isInitialized]);

  // Renderizar o container base imediatamente com supressão de aviso de hidratação (visto que a splash é volátil)
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden" suppressHydrationWarning>
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {showSplash && isInitialized ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 1, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <div className="text-center">
              <span className="text-[10px] font-black text-emerald-500 tracking-[0.6em] uppercase mb-4 block animate-pulse">Ambiente de Elite</span>
              <h1 className="text-7xl md:text-9xl font-black text-emerald-500 tracking-[-0.05em] uppercase drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                Boas-vindas
              </h1>
            </div>
          </motion.div>
        ) : isReady && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            {/* CABEÇALHO SUTIL (SEM POLUIÇÃO) */}
            <div className="text-left w-full mb-12 border-l-4 border-emerald-500 pl-6">
              <span className="text-[10px] font-black text-emerald-500/50 tracking-[0.4em] uppercase block mb-2">Workspace Principal</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Painel de Maestria</h2>
            </div>

            {/* AÇÃO PRIORITÁRIA BUTTON */}
            <Link href="/app/estudar" className="w-full">
              <button className="w-full group relative p-8 border-2 border-emerald-500/50 bg-white/[0.02] backdrop-blur-xl hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Zap size={32} className="text-emerald-500" />
                </div>
                
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase mb-4">Ação Prioritária</span>
                  <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase leading-tight group-hover:text-emerald-500 transition-colors">
                    Revisar Agora
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      {pendingCount} Pendentes
                    </div>
                    <div className="text-white/20 text-[10px] font-bold tracking-widest uppercase italic">
                      Time to Elite
                    </div>
                  </div>

                  <div className="w-full h-12 bg-emerald-500 flex items-center justify-center gap-3 group-hover:bg-emerald-400 transition-colors">
                    <Play size={14} fill="black" />
                    <span className="text-black font-black text-xs tracking-[0.2em] uppercase">Iniciar Sessão</span>
                  </div>
                </div>
              </button>
            </Link>

            <div className="mt-8 text-center opacity-20 hover:opacity-100 transition-opacity cursor-default">
              <p className="text-[8px] font-black text-white uppercase tracking-[0.8em]">Sistema SRS de Elite v2.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
