'use client';

import { motion } from 'framer-motion';
import ActivitiesRoadmap from '@/components/roadmap/ActivitiesRoadmap';

export default function ActivitiesPage() {
  return (
    <div className="relative min-h-screen">
      {/* OVERLAY 'EM BREVE' - Design Lendário */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
        {/* Backdrop Blur Leve */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20" />

        {/* Faixa Central Lendária */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full py-8 md:py-20 flex flex-col items-center justify-center"
        >
          {/* Efeito de Brilho de Fundo (Glow) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-3xl" />
          
          {/* Container da Faixa */}
          <div className="relative w-full bg-black/80 border-y border-amber-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.15)] py-8 md:py-10 flex flex-col items-center">
            
            {/* Linhas de Scanner Animadas (Sutís) */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse" />

            <motion.span 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-amber-500/60 mb-3 md:mb-4 block"
            >
              Industrial Gateway
            </motion.span>
            
            <h2 className="text-2xl md:text-5xl lg:text-8xl font-black font-outfit text-white tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              EM BREVE
            </h2>
            
            <p className="text-amber-200/60 text-xs md:text-base font-bold tracking-wider max-w-md text-center px-4 md:px-6">
              Novas formas de dominar o idioma estão sendo preparadas.
            </p>

            {/* Detalhes de Cantos 'Legendary' */}
            <div className="absolute top-0 left-4 md:left-10 w-12 md:w-20 h-[2px] bg-amber-500" />
            <div className="absolute bottom-0 right-4 md:right-10 w-12 md:w-20 h-[2px] bg-amber-500" />
          </div>
        </motion.div>
      </div>

      {/* CONTEÚDO BLOQUEADO PARA CLIQUES, MAS SCROLLÁVEL */}
      <div className="pointer-events-none opacity-80 filter grayscale-[0.3]">
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
