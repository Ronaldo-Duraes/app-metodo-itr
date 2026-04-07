'use client';

import { motion } from 'framer-motion';
import ActivitiesRoadmap from '@/components/roadmap/ActivitiesRoadmap';

export default function ActivitiesPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* BANNER STICKY 'EM BREVE' */}
      <div className="sticky top-0 z-40 w-full flex flex-col items-center justify-center border-b border-amber-500/30 overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-md bg-black/80">
        
        {/* Faixa Central Lendária */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full py-4 md:py-8 flex flex-col items-center justify-center"
        >
          {/* Efeito de Brilho de Fundo (Glow) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
          
          {/* Linhas de Scanner Animadas (Sutís) */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse" />

          <div className="relative w-full flex flex-col items-center px-4 md:px-0">
            <motion.span 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-amber-500/60 mb-2 md:mb-3 block"
            >
              Industrial Gateway
            </motion.span>
            
            <h2 className="text-xl md:text-3xl lg:text-5xl font-black font-outfit text-white tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              EM BREVE
            </h2>
            
            <p className="text-amber-200/60 text-[10px] md:text-sm font-bold tracking-wider max-w-sm md:max-w-md text-center">
              Novas formas de dominar o idioma estão sendo preparadas.
            </p>
          </div>
        </motion.div>
      </div>

      {/* CONTEÚDO BLOQUEADO PARA CLIQUES, MAS SCROLLÁVEL */}
      <div className="w-full pointer-events-none opacity-80 filter grayscale-[0.3] -mt-4">
        <div className="max-w-6xl mx-auto py-12 px-6 pb-40">
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
