'use client';

import { motion } from 'framer-motion';
import ActivitiesRoadmap from '@/components/roadmap/ActivitiesRoadmap';

export default function ActivitiesPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      
      {/* VÉU DE FUNDO (BACKGROUND BLUR TOTAL) */}
      <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[8px] pointer-events-none" />

      {/* POP-UP 'EM BREVE' CENTRALIZADO */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-[90%] max-w-lg flex flex-col items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-2xl border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden pointer-events-none">
        
        {/* Faixa Central Lendária */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full py-10 md:py-14 flex flex-col items-center justify-center"
        >
          {/* Efeito de Brilho de Fundo (Glow) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-3xl" />
          
          <div className="relative w-full flex flex-col items-center px-6 md:px-8 text-center">
            <motion.span 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-amber-500/60 mb-3 md:mb-4 block"
            >
              Industrial Gateway
            </motion.span>
            
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-black font-outfit text-white tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              EM BREVE
            </h2>
            
            <p className="text-amber-200/60 text-xs md:text-sm font-bold tracking-wider max-w-sm md:max-w-md">
              Novas atividades interativas estão sendo preparadas. Sua jornada está apenas começando.
            </p>
          </div>
        </motion.div>
      </div>

      {/* CONTEÚDO BLOQUEADO PARA CLIQUES, MAS SCROLLÁVEL */}
      <div className="w-full pointer-events-none opacity-40 filter grayscale-[0.6]">
        <div className="max-w-6xl mx-auto py-12 px-6 pb-40 relative z-10">
          {/* Header Estilizado - Foco na Evolução */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-20"
          >
            <ActivitiesRoadmap />
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
