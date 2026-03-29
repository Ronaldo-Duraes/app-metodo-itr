'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

const PAC_ACTIONS = [
  "Atirar", "Socar", "Pular", "Flutuar", "Girar", 
  "Cair", "Quebrar", "Brilhar", "Vibrar", "Borbulhar", 
  "Escorrer", "Pingar", "Dobrar", "Rasgar", "Enrolar", 
  "Empilhar", "Explodir", "Derreter", "Evaporar", "Refletir", 
  "Acender", "Mover", "Crescer", "Desaparecer", "Transformar"
];

export default function PacActionsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-outfit pb-40 relative">
      {/* BACKGROUND GRADIENT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#062417_0%,#000000_70%)] -z-10" />

      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* HEADER NAVIGATION */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/app" className="group flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Arsenal ITR</span>
          </Link>
          <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/5 px-4 py-2">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Ações para PAC</span>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6"
          >
            Dinâmica de <br />
            <span className="text-emerald-500 underline decoration-zinc-800 underline-offset-[12px]">Ações PAC</span>
          </motion.h1>
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.4em] max-w-lg leading-relaxed">
            Gatilhos de movimento para acelerar a fixação de vocabulário e a fluência instintiva.
          </p>
        </div>

        {/* LIST OF ACTIONS - BLOCO DE NOTAS (MAIS JUNTO) */}
        <div className="flex flex-col border-t border-white/5">
          {PAC_ACTIONS.map((action, idx) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.01 }}
              className="group flex items-center py-2 border-b border-white/5 hover:bg-emerald-500/[0.04] transition-colors px-2"
            >
              {/* Action Name */}
              <span className="text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {action}
              </span>
            </motion.div>
          ))}
        </div>

        {/* MOTIVATIONAL QUOTE / closing phrase */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 border-t border-white/5 pt-8 text-center"
        >
          <p className="text-sm md:text-base font-light text-zinc-400 italic max-w-lg mx-auto leading-relaxed">
            "Não adianta encher essa lista de ações, <span className="text-zinc-300">familiarize-se com estas</span> e invente as suas próprias. Bons estudos!"
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 opacity-30">
             <Sparkles size={24} className="text-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-500">Protocolo de Elite ITR</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
