'use client';

import { motion } from 'framer-motion';
import ActivitiesRoadmap from '@/components/roadmap/ActivitiesRoadmap';
import { useState, useEffect } from 'react';

export default function ActivitiesPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      // Estático e quase imediato no mobile para zero travamentos
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }
  }, []);
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* BANNER CENTRALIZADO DE CONSTRUÇÃO (DESKTOP & MOBILE) */}
      <div className="fixed top-1/2 left-0 w-full -translate-y-1/2 z-40 bg-[#0a0a0a]/85 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col border-b border-black">
        {/* Faixa listrada superior */}
        <div className="w-full h-1.5 opacity-100" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 15px, #000 15px, #000 30px)' }} />
        
        <div className="relative w-full py-4 md:py-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[120px] md:min-h-[160px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-xl" />
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 text-center">
            <motion.span 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[0.8em] text-amber-500 mb-1.5 md:mb-2 block drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] text-center w-full"
            >
              Área em Construção
            </motion.span>
            
            <h2 className="text-2xl md:text-5xl font-black font-outfit text-white tracking-[0.2em] md:tracking-[0.3em] mb-1.5 md:mb-3 flex items-center justify-center text-center w-full">
              EM BREVE
            </h2>
            
            <p className="text-amber-200/60 text-[10px] md:text-sm font-bold tracking-widest max-w-md mx-auto flex items-center justify-center text-center w-full">
              Novas atividades interativas estão sendo preparadas.
            </p>
          </div>
        </div>
        
        {/* Faixa listrada inferior */}
        <div className="w-full h-1.5 opacity-100" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 15px, #000 15px, #000 30px)' }} />
      </div>

      {/* CONTEÚDO BLOQUEADO PARA CLIQUES, MAS SCROLLÁVEL */}
      <div className="w-full pointer-events-none opacity-40 filter grayscale-[0.6]">
        <div className="max-w-6xl mx-auto py-12 px-6 pb-40 relative z-10">
          {/* Header Estilizado - Foco na Evolução */}
          <motion.div 
            initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="mb-16 text-center md:text-left"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 mb-4 block">
              Central de Treinamento
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black font-outfit mb-6 text-white tracking-tighter">
              Expanda seus Limites
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl font-bold leading-relaxed">
              Domine a gramática através de uma jornada visual imersiva. Cada módulo desbloqueia 
              novos desafios e eleva sua fluência ao próximo nível.
            </p>
          </motion.div>

          {/* ROADMAP DE ATIVIDADES CAKTO - ESTRELA DA PÁGINA */}
          <motion.div
            initial={{ opacity: isMobile ? 1 : 0, scale: isMobile ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isMobile ? 0 : 0.2, duration: isMobile ? 0 : 0.5 }}
            className="mt-20"
          >
            {isLoaded ? (
              <ActivitiesRoadmap />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-8 opacity-40 animate-pulse">
                <div className="w-20 h-20 bg-white/10 rounded-full" />
                <div className="w-1/2 max-w-sm h-6 bg-white/10 rounded-md" />
                <div className="w-64 h-4 bg-white/5 rounded-md" />
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-500/50 mt-4">Priozirando Interface...</div>
              </div>
            )}
          </motion.div>

          {/* Footer / Nota Sutil no Final da Jornada */}
          <div className="mt-24 text-center">
            <p className="text-slate-700 font-black text-xs uppercase tracking-widest opacity-40">
              Mais módulos em desenvolvimento • Continue progredindo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
