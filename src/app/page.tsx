'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 font-outfit">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-emerald-500 mb-6 block opacity-50">Bem-vindo ao Sistema</span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-8">
          Método ITR
        </h1>
        <p className="text-slate-500 text-sm md:text-md max-w-md mx-auto font-medium leading-relaxed opacity-60">
          Sua jornada para a fluência começa aqui. Explore suas atividades ou revise seus flashcards no menu lateral.
        </p>
      </motion.div>

      {/* Brilho de fundo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
