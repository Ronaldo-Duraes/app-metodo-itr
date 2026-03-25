'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden">
      
      {/* GRADIENTE SUTIL DE FUNDO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-emerald-500/60 mb-8 block">
          Ambiente de Elite
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-4">
          Boas-vindas
        </h1>
        <p className="text-slate-400 text-sm md:text-lg max-w-lg mx-auto font-medium leading-relaxed opacity-40 uppercase tracking-widest">
          Sua evolução começa no menu lateral.
        </p>
      </motion.div>

      {/* DETALHE DE LINHA DECORATIVA */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-emerald-500/20 to-transparent" />
    </div>
  );
}
