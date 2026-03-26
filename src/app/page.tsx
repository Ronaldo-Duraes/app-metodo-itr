'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden">
      
      {/* GRADIENTE SUTIL DE FUNDO PURPLE (Ainda mais sutil) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BC13FE]/5 blur-[180px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center relative z-10 flex flex-col items-center"
      >
        <div>
          <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[1.2rem] text-white mb-10 block drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
            Ambiente de Elite
          </span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-10 bg-gradient-to-b from-[#4B0082] via-[#BC13FE] to-[#E0B0FF] bg-clip-text text-transparent drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]">
            Boas-vindas
          </h1>
          <p className="text-zinc-400 text-[10px] md:text-xs max-w-lg mx-auto font-bold leading-relaxed uppercase tracking-[0.6em]">
            Sua evolução começa no menu lateral.
          </p>
        </div>
      </motion.div>

      {/* DETALHE DE LINHA DECORATIVA PURPLE */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-[#BC13FE]/20 to-transparent" />


    </div>
  );
}
