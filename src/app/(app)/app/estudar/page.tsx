'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ArrowRight, CheckCircle2, Trophy, Clock, Brain, BookOpen, Repeat, ShieldCheck, ZapOff } from 'lucide-react';
import { getCards, getPriorityCards, updateCardReview, playBlipSound, playVictorySound, ensureCardInDictionary, getDecks } from '@/lib/srs';
import { Flashcard, ReviewInterval } from '@/lib/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EstudarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck');
  
  const [pile, setPile] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFreeStudy, setIsFreeStudy] = useState(false);
  const [deckName, setDeckName] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<'srs' | 'manual' | null>(null);

  useEffect(() => {
    const isFree = !!deckId;
    setIsFreeStudy(isFree);

    try {
      const allCards = getCards();
      // getPriorityCards já lida internamente com o filtro de memorizado
      const sorted = getPriorityCards(allCards, deckId || undefined);
      
      if (!sorted || sorted.length === 0) {
        setPile([]);
      } else {
        setPile(sorted);
      }

      const decks = getDecks();
      const deck = decks.find((d: any) => d.id === deckId || d.name === deckId);
      if (deck) setDeckName(deck.name);
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      setPile([]);
    }

    setIsLoading(false);
  }, [deckId]);

  const currentCard = pile[currentIndex];

  const handleReview = (interval: ReviewInterval) => {
    if (!currentCard) return;
    
    // Modo Manual: Não persiste no banco
    if (studyMode === 'manual') {
      if (interval === '1h') { // DIFÍCIL
        const newPile = [...pile];
        const card = newPile.splice(currentIndex, 1)[0];
        setPile([...newPile, card]);
        // Não incrementamos o currentIndex porque o próximo card "sobe" para a posição atual
        setIsRevealed(false);
        playBlipSound();
        return; 
      }
      // Fácil apenas prossegue (será considerado concluído ao final)
    } else {
      // Modo SRS Inteligente: Persiste progresso
      ensureCardInDictionary(currentCard.id);
      updateCardReview(currentCard.id, interval);
    }

    playBlipSound();

    if (currentIndex < pile.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsRevealed(false);
    } else {
      setIsFinished(true);
      playVictorySound();
    }
  };

  // 1. ESTADO DE CARREGAMENTO
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-black text-white uppercase tracking-[0.5em]">
        Iniciando Motor...
      </div>
    );
  }

  // 2. PILHA VAZIA (SÓ SE NÃO TIVER TERMINADO)
  if (pile.length === 0 && !isFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center font-outfit">
        <div className="mb-8 p-6 bg-white/[0.02] border border-white/10 rounded-full">
          <CheckCircle2 size={64} className="text-emerald-500" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Pilha Vazia</h1>
        <p className="text-slate-500 uppercase font-bold tracking-widest max-w-sm mb-12">
          {isFreeStudy 
            ? "Não há cards neste baralho para praticar." 
            : "Não há cards pendentes agora. Sua consistência é lendária."}
        </p>
        <Link href="/app">
          <button className="px-12 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all">
            Voltar ao QG
          </button>
        </Link>
      </div>
    );
  }

  // 3. SELEÇÃO DE MODO (ANTES DE COMEÇAR)
  if (!studyMode && !isFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl text-center z-10"
        >
          <div className="mb-12">
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Configuração de Foco</h2>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">O que vamos treinar hoje?</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <button 
              onClick={() => { playBlipSound(); setStudyMode('srs'); }}
              className="group p-8 border-2 border-emerald-500/30 bg-white/[0.02] hover:bg-emerald-500/10 hover:border-emerald-500 transition-all flex flex-col items-center text-center"
            >
              <ShieldCheck size={48} className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black text-white uppercase mb-2">SRS Inteligente</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Usa o algoritmo ITR para memorização definitiva e salva seu progresso.
              </p>
            </button>

            <button 
              onClick={() => { playBlipSound(); setStudyMode('manual'); }}
              className="group p-8 border-2 border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/30 transition-all flex flex-col items-center text-center"
            >
              <ZapOff size={48} className="text-slate-500 mb-6 group-hover:scale-110 transition-transform group-hover:text-white" />
              <h3 className="text-xl font-black text-white uppercase mb-2">Modo Manual</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Para revisão rápida sem alteração técnica. Não salva dados no banco.
              </p>
            </button>
          </div>

          <button 
            onClick={() => router.push('/app')}
            className="mt-12 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.4em] transition-colors"
          >
            Cancelar Treinamento
          </button>
        </motion.div>
      </div>
    );
  }

  // 4. SESSÃO CONCLUÍDA
  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center font-outfit">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="relative">
             <Trophy size={100} className="text-emerald-500 mb-8 mx-auto" />
             <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] -z-10" />
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">Sessão Concluída</h1>
          <p className="text-emerald-500 uppercase font-black tracking-[0.4em] mb-12">
            {studyMode === 'manual' ? 'REVISÃO RÁPIDA FINALIZADA' : 'MAESTRIA ITR: 100% CONCLUÍDA'}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setIsFinished(false);
                setIsRevealed(false);
                setStudyMode(null);
              }}
              className="px-12 py-4 bg-emerald-500 text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              Voltar ao Início
            </button>
            <Link href="/app">
              <button className="px-12 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                Retornar ao QG
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 5. INTERFACE DE ESTUDO ATIVA
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
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
              Foco: {deckName || 'Geral'} ({studyMode?.toUpperCase()})
            </span>
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
           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Protocolo ITR v2.2</span>
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
            <div 
              onClick={() => !isRevealed && setIsRevealed(true)}
              className={`relative w-full aspect-[16/9] md:aspect-[21/9] border-2 ${isRevealed ? 'border-emerald-500 bg-emerald-500/[0.02]' : 'border-white/10 bg-white/[0.01] cursor-pointer'} transition-all duration-500 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden select-none`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain size={120} className="text-white" />
              </div>

              <div className="w-full max-w-4xl flex flex-col items-center text-center">
                <div className="mb-6">
                  <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.5em] mb-4 block">Termo Original</span>
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                    {currentCard.front}
                  </h3>
                </div>

                {!isRevealed && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsRevealed(true); }}
                    className="mt-8 px-10 py-4 border-2 border-white/20 text-white font-black text-[10px] tracking-[0.4em] uppercase hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                  >
                    Revelar Tradução
                  </button>
                )}

                <AnimatePresence>
                  {isRevealed && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center mt-4 gap-y-4"
                    >
                      <div className="h-[1px] w-24 bg-emerald-500/30 mb-2" />
                      <h4 className="text-3xl md:text-5xl font-bold text-emerald-400 uppercase tracking-tight mb-2">
                        {currentCard.back}
                      </h4>
                      {currentCard.association && (
                        <div className="max-w-2xl p-6 bg-white/5 border border-white/10 mt-2">
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mnemonic</span>
                           <p className="text-lg md:text-xl font-bold text-white/60 uppercase leading-relaxed italic text-center">
                             "{currentCard.association}"
                           </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-12 h-32">
              <AnimatePresence>
                {isRevealed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-row gap-4 w-full"
                  >
                    {studyMode === 'manual' ? (
                      <>
                        <button 
                          onClick={() => handleReview('1h')}
                          className="flex-1 flex flex-col items-center justify-center py-8 border-2 border-red-500/20 bg-white/[0.02] hover:bg-red-500/10 transition-all group"
                        >
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-white">DIFÍCIL</span>
                          <span className="text-lg font-black uppercase text-red-500 group-hover:text-white">Repetir Depois</span>
                        </button>
                        <button 
                          onClick={() => handleReview('1d')}
                          className="flex-1 flex flex-col items-center justify-center py-8 border-2 border-emerald-500/20 bg-white/[0.02] hover:bg-emerald-500/10 transition-all group"
                        >
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-white">FÁCIL</span>
                          <span className="text-lg font-black uppercase text-emerald-500 group-hover:text-white">Entendido</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {[
                          { top: '< 1 HORA', bottom: 'REVISAR', interval: '1h' as ReviewInterval, color: 'text-red-500 border-red-500/20' },
                          { top: '< 1 DIA', bottom: 'PRATICAR', interval: '1d' as ReviewInterval, color: 'text-emerald-500 border-emerald-500/20' },
                          { top: '< 4 DIAS', bottom: 'FIXAR', interval: '4d' as ReviewInterval, color: 'text-blue-500 border-blue-500/20' },
                          { top: 'MEMORIZADO', bottom: 'MASTER', interval: 'memorized' as ReviewInterval, color: 'text-purple-500 border-purple-500/20' },
                        ].map((opt) => (
                          <button 
                            key={opt.interval}
                            onClick={() => handleReview(opt.interval)}
                            className={`flex-1 flex flex-col items-center justify-center p-4 border bg-white/[0.02] hover:bg-white/5 transition-all group`}
                          >
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{opt.top}</span>
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${opt.color.split(' ')[0]} group-hover:text-white transition-colors`}>{opt.bottom}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-4xl mt-12 pt-8 border-t border-white/5 relative z-10 flex justify-between items-center opacity-30">
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <Clock size={12} />
          {studyMode === 'manual' ? 'Manual review session' : 'Spaced Repetition Motor active'}
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">
           Método ITR © 2026
        </div>
      </footer>
    </div>
  );
}
