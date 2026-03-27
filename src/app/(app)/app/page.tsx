'use client';
 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCards, getPriorityCards } from '@/lib/srs';
import { Play, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Flashcard } from '@/lib/types';

export default function HomePage() {
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
 
  useEffect(() => {
    // Carregar dados de cards
    setAllCards(getCards());
  }, []);

  const priorityCards = React.useMemo(() => {
    return getPriorityCards(allCards);
  }, [allCards]);

  const pendingCount = priorityCards.length;

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden">
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full" />
      </div>

      <motion.div
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

        {/* AÇÃO PRIORITÁRIA BUTTON / EMPTY STATE */}
        {pendingCount > 0 ? (
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
                  <Play size={14} fill="black" stroke="black" />
                  <span className="text-black font-black text-xs tracking-[0.2em] uppercase">Iniciar Sessão</span>
                </div>
              </div>
            </button>
          </Link>
        ) : (
          <div className="w-full p-12 border-2 border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center">
            <div className="mb-6 p-4 bg-emerald-500/10 rounded-full">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
              Tudo em dia!
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
              Seu vocabulário está consolidado.
            </p>
          </div>
        )}

        <div className="mt-8 text-center opacity-20 hover:opacity-100 transition-opacity cursor-default">
          <p className="text-[8px] font-black text-white uppercase tracking-[0.8em]">Sistema SRS de Elite v2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
