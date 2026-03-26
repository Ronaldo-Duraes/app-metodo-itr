'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ArrowRight, CheckCircle2, Trophy, Clock, Brain } from 'lucide-react';
import { getCards, getPriorityCards, updateCardReview, playBlipSound, playVictorySound } from '@/lib/srs';
import { Flashcard, ReviewInterval } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EstudarPage() {
  const router = useRouter();
  const [pile, setPile] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cards = getCards();
    const priority = getPriorityCards(cards);
    setPile(priority);
    setIsLoading(false);
  }, []);

  const currentCard = pile[currentIndex];

  const handleReview = (interval: ReviewInterval) => {
    if (!currentCard) return;
    
    updateCardReview(currentCard.id, interval);
    playBlipSound();

    if (currentIndex < pile.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsRevealed(false);
    } else {
      setIsFinished(true);
      playVictorySound();
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-white uppercase tracking-widest">Iniciando Motor...</div>;

  if (pile.length === 0 && !isFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center font-outfit">
        <div className="mb-8 p-6 bg-white/[0.02] border border-white/10 rounded-full">
          <CheckCircle2 size={64} className="text-emerald-500" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Pilha Limpa</h1>
        <p className="text-slate-500 uppercase font-bold tracking-widest max-w-sm mb-12">
          Não há cards pendentes agora. Sua consistência é lendária.
        </p>
        <Link href="/app">
          <button className="px-12 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all">
            Voltar para Home
          </button>
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center font-outfit">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="relative">
             <Trophy size={100} className="text-emerald-500 mb-8" />
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 bg-emerald-500/20 blur-[100px] -z-10"
             />
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">Missão Cumprida</h1>
          <p className="text-emerald-500 uppercase font-black tracking-[0.4em] mb-12">
            Pilha de Prioridade: 100% LIMPA
          </p>
          <Link href="/app">
            <button className="px-12 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              Retornar ao QG
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center p-8 md:p-12 font-outfit relative overflow-hidden">
      
      {/* HEADER */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/app">
            <button className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
          </Link>
          <div className="h-10 w-[1px] bg-white/10" />
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Pilha Atual</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(pile.length, 10) }).map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 ${i <= currentIndex ? 'bg-emerald-500' : 'bg-white/10'}`} />
                ))}
              </div>
              <span className="text-[10px] font-black text-white/40 ml-2 uppercase">
                {currentIndex + 1} / {pile.length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Foco de Maestria ITR</span>
        </div>
      </header>

      {/* MAIN STUDY AREA */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10">
        
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
            {/* THE CARD */}
            <div className={`relative w-full aspect-[16/9] md:aspect-[21/9] border-2 ${isRevealed ? 'border-emerald-500 bg-emerald-500/[0.02]' : 'border-white/10 bg-white/[0.01]'} transition-all duration-500 flex flex-col items-center justify-center p-12 overflow-hidden`}>
              
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain size={120} className="text-white" />
              </div>

              {/* FRONT */}
              <div className="text-center mb-8">
                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.5em] mb-6 block">Termo Original</span>
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                  {currentCard.front}
                </h3>
              </div>

              {/* REVEAL BUTTON */}
              {!isRevealed && (
                <button 
                  onClick={() => setIsRevealed(true)}
                  className="mt-12 px-10 py-4 border-2 border-white/20 text-white font-black text-[10px] tracking-[0.4em] uppercase hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                >
                  Revelar Tradução
                </button>
              )}

              {/* BACK / REVEALED CONTENT */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mt-8 text-center"
                  >
                    <div className="h-[1px] w-24 bg-emerald-500/30 mb-8" />
                    <h4 className="text-3xl md:text-5xl font-bold text-emerald-400 uppercase tracking-tight mb-6">
                      {currentCard.back}
                    </h4>
                    {currentCard.association && (
                      <div className="max-w-md p-4 bg-white/5 border border-white/10">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mnemonic</span>
                         <p className="text-[10px] font-bold text-white/60 uppercase leading-relaxed italic">
                           "{currentCard.association}"
                         </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION CONTROLS */}
            <div className="mt-12 h-32">
              <AnimatePresence>
                {isRevealed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[
                      { label: 'Difícil', time: '1h', interval: '1h' as ReviewInterval, color: 'text-red-500 border-red-500/20' },
                      { label: 'Bom', time: '24h', interval: '24h' as ReviewInterval, color: 'text-emerald-500 border-emerald-500/20' },
                      { label: 'Fácil', time: '1 Sem.', interval: '1s' as ReviewInterval, color: 'text-blue-500 border-blue-500/20' },
                      { label: 'Lendário', time: '1 Mês', interval: '1m' as ReviewInterval, color: 'text-yellow-500 border-yellow-500/20' },
                    ].map((opt) => (
                      <button 
                        key={opt.interval}
                        onClick={() => handleReview(opt.interval)}
                        className={`flex flex-col items-center p-6 border bg-white/[0.02] hover:bg-white/5 transition-all group`}
                      >
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{opt.label}</span>
                        <span className={`text-sm font-black uppercase tracking-tighter ${opt.color.split(' ')[0]}`}>{opt.time}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER STATS */}
      <footer className="w-full max-w-4xl mt-12 pt-8 border-t border-white/5 relative z-10 flex justify-between items-center opacity-30">
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <Clock size={12} />
          Spaced Repetition Motor active
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">
           Método ITR © 2026
        </div>
      </footer>
    </div>
  );
}
