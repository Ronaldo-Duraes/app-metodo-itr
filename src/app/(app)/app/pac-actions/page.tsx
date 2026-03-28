'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Zap, Quote, Sparkles } from 'lucide-react';
import Link from 'next/link';

const PAC_ACTIONS = [
  "Atirar", "Socar", "Pular", "Flutuar", "Girar", 
  "Cair", "Quebrar", "Brilhar", "Vibrar", "Borbulhar", 
  "Escorrer", "Pingar", "Dobrar", "Rasgar", "Enrolar", 
  "Empilhar", "Explodir", "Derreter", "Evaporar", "Refletir", 
  "Acender", "Mover", "Crescer", "Desaparecer", "Transformar"
];

const STORAGE_KEY = 'itr_pac_actions';

export default function PacActionsPage() {
  const [familiar, setFamiliar] = useState<Record<string, boolean>>({});
  const [activeGlow, setActiveGlow] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar do localStorage com Blindagem SSR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try { setFamiliar(JSON.parse(stored)); } catch (e) { console.error(e); }
      }
      setIsLoaded(true);
    }
  }, []);

  // Salvar no localStorage com Blindagem SSR
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(familiar));
    }
  }, [familiar, isLoaded]);

  const handleActionClick = (action: string) => {
    setActiveGlow(action);
    setTimeout(() => setActiveGlow(null), 1000);
  };

  const toggleFamiliar = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFamiliar(prev => ({ ...prev, [action]: !prev[action] }));
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

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
        <div className="mb-20">
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

        {/* GRID OF ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {PAC_ACTIONS.map((action, idx) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => handleActionClick(action)}
              className={`relative group cursor-pointer p-6 border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                activeGlow === action 
                ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_50px_rgba(52,211,153,0.7)] scale-105 z-10' 
                : 'border-white/5 bg-white/[0.02] hover:border-emerald-500/30'
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                activeGlow === action ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-200'
              }`}>
                {action}
              </span>

              {/* Checkbox Discreto */}
              <button
                onClick={(e) => toggleFamiliar(action, e)}
                className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-500 ${
                  familiar[action] 
                  ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                  : 'border-white/10 opacity-30 group-hover:opacity-100'
                }`}
              >
                {familiar[action] && <Check size={12} className="text-black stroke-[4]" />}
              </button>

              {/* Efeito Interno de Brilho Dinâmico */}
              {activeGlow === action && (
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>

        {/* MOTIVATIONAL QUOTE / closing phrase */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 relative"
        >
          <div className="absolute -left-6 -top-8 text-emerald-900/20 pointer-events-none">
            <Quote size={120} fill="currentColor" />
          </div>
          <blockquote className="relative p-12 border-l-4 border-emerald-500 bg-white/[0.01] backdrop-blur-md">
            <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-500 italic leading-snug">
              "Não adianta encher essa lista de ações, <span className="text-white">familiarize-se com estas</span> e invente as suas próprias. Bons estudos!"
            </p>
            <div className="mt-12 flex items-center gap-5">
              <div className="h-[2px] w-16 bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60">Protocolo de Elite ITR</span>
            </div>
          </blockquote>
        </motion.div>

        {/* FOOTER DECORATION */}
        <div className="mt-40 flex flex-col items-center gap-6 opacity-20">
           <Sparkles size={40} className="text-emerald-500" />
           <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
