'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Trophy, Clock, Brain, ShieldCheck, ZapOff } from 'lucide-react';
import { getCards, getPriorityCards, updateCardReview, playBlipSound, playVictorySound, ensureCardInDictionary, getDecks } from '@/lib/srs';
import { Flashcard, ReviewInterval } from '@/lib/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import StudyModeModal from '@/components/study/StudyModeModal';

export default function EstudarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck');
  const initialMode = searchParams.get('mode') as 'srs' | 'manual' | null;
  
  const [pile, setPile] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFreeStudy, setIsFreeStudy] = useState(false);
  const [deckName, setDeckName] = useState<string | null>(null);
  
  // O modo de estudo agora pode vir via query param ou ser selecionado no modal interno (fallback)
  const [studyMode, setStudyMode] = useState<'srs' | 'manual' | null>(initialMode);
  
  // INVERSÃO GLOBAL PT-EN
  const [isInverted, setIsInverted] = useState(false);

  useEffect(() => {
    const isFree = !!deckId;
    setIsFreeStudy(isFree);
    setIsInverted(localStorage.getItem('itr_invert_cards') === 'true');

    try {
      const allCards = getCards();
      const sorted = getPriorityCards(allCards, deckId || undefined);
      
      setPile(sorted || []);

      const decks = getDecks();
      const deck = decks.find((d: any) => d.id === deckId || d.name === deckId);
      if (deck) setDeckName(deck.name);
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      setPile([]);
    }

    setIsLoading(false);
  }, [deckId]);

  // Sincronizar studyMode se o searchParam mudar (embora improvável no fluxo normal)
  useEffect(() => {
    if (initialMode && studyMode !== initialMode) {
      setStudyMode(initialMode);
    }
  }, [initialMode]);

  const currentCard = pile[currentIndex];

  const handleReview = (interval: ReviewInterval) => {
    if (!currentCard) return;
    
    // TODAS AS INTERAÇÕES REATIVAM NO DICIONÁRIO
    ensureCardInDictionary(currentCard.id);
    
    // MODO MANUAL: Não persiste no banco de dados e repete o card se for Difícil
    if (studyMode === 'manual') {
      if (interval === '1h') { 
        const newPile = [...pile];
        const card = newPile.splice(currentIndex, 1)[0];
        setPile([...newPile, card]);
        setIsRevealed(false);
        playBlipSound();
        return; 
      }
    } else {
      // MODO SRS: Inteligente com persistência
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

  // 1. CARREGAMENTO INICIAL
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-black text-white uppercase tracking-[0.5em]">
        Iniciando Motor...
      </div>
    );
  }

  // 2. CONTEXTO DE SESSÃO ENCERRADA (VITÓRIA)
  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-8 text-center font-outfit">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="relative">
             <Trophy size={100} className="text-orange-500 mb-8 mx-auto" />
             <div className="absolute inset-0 bg-orange-500/20 blur-[100px] -z-10" />
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Sessão Concluída</h1>
          <p className="text-orange-500 uppercase font-black tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-base mb-8 md:mb-12">
            {studyMode === 'manual' ? 'REVISÃO RÁPIDA FINALIZADA' : 'MAESTRIA ITR: 100% CONCLUÍDA'}
          </p>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center w-full max-w-md">
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setIsFinished(false);
                setIsRevealed(false);
                // NOTA: Se viemos com modo fixo via URL, mantemos. Se era fallback local, limpamos.
                if (!initialMode) setStudyMode(null);
              }}
              className="px-12 py-4 bg-orange-500 text-black font-black text-xs tracking-widest uppercase hover:bg-orange-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              Reiniciar Estudo
            </button>
            <Link href="/espanhol">
              <button className="px-12 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-orange-500 transition-all">
                Retornar ao QG
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. SEM CARDS PARA ESTUDAR
  if (pile.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-8 text-center font-outfit">
        <div className="mb-8 p-6 bg-white/[0.02] border border-white/10 rounded-full">
          <CheckCircle2 size={64} className="text-orange-500" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Pilha Vazia</h1>
        <p className="text-slate-500 uppercase font-bold tracking-widest max-w-sm mb-12">
          {isFreeStudy 
            ? "Não há cards neste baralho para praticar no momento." 
            : "Sua fila de revisão está limpa. Maestria alcançada."}
        </p>
        <Link href="/espanhol">
          <button className="px-12 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-orange-500 transition-all">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    );
  }

  // 4. FALLBACK: MODAL DE SELEÇÃO (SE NÃO VEIO VIA URL)
  if (!studyMode) {
    return (
      <StudyModeModal 
        isOpen={true}
        onClose={() => router.push('/espanhol')}
        onSelect={(mode) => setStudyMode(mode)}
        title={deckName ? `Estudar: ${deckName}` : "O que vamos treinar hoje?"}
      />
    );
  }

  // VALORES INVERTIDOS SE NECESSÁRIO
  const displayFront = isInverted ? currentCard?.back : currentCard?.front;
  const displayBack = isInverted ? currentCard?.front : currentCard?.back;

  // 5. INTERFACE DE ESTUDO (MAESTRIA)
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center p-4 md:p-8 lg:p-12 font-outfit relative overflow-hidden">
      
      {/* HEADER */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-6 md:mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/espanhol">
            <button className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
          </Link>
          <div className="h-10 w-[1px] bg-white/10" />
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">
              Foco: {deckName || 'Geral'} ({studyMode.toUpperCase()})
            </span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(pile.length, 10) }).map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 ${i <= currentIndex ? 'bg-orange-500' : 'bg-white/10'}`} />
                ))}
              </div>
              <span className="text-[10px] font-black text-white/40 ml-2 uppercase">
                {currentIndex + 1} / {pile.length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest opacity-40">Protocolo de Maestria ITR</span>
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
              className={`relative w-full min-h-[280px] md:min-h-0 md:aspect-[21/9] border-2 ${isRevealed ? 'border-orange-500 bg-orange-500/[0.02]' : 'border-white/10 bg-white/[0.01] cursor-pointer'} transition-all duration-500 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden select-none`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain size={120} className="text-white" />
              </div>

              <div className="w-full max-w-4xl flex flex-col items-center text-center">
                <div className="mb-6 flex flex-col items-center">
                  <span className="text-[10px] font-black text-orange-500/50 uppercase tracking-[0.5em] mb-4 block">
                    {isInverted ? 'PORTUGUÊS' : 'Termo Original'}
                  </span>
                  <div className="flex flex-row items-baseline gap-3 justify-center">
                    <h3 className="text-2xl md:text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                      {displayFront}
                    </h3>
                    
                    {!isInverted && currentCard.pronunciation && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm md:text-xl lg:text-2xl font-bold text-amber-500/40 uppercase tracking-[0.1em] md:tracking-[0.3em] italic"
                      >
                        ({currentCard.pronunciation})
                      </motion.span>
                    )}
                  </div>
                </div>

                {!isRevealed && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsRevealed(true); }}
                    className="mt-8 px-10 py-4 border-2 border-white/20 text-white font-black text-[10px] tracking-[0.4em] uppercase hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group scale-100 active:scale-95"
                  >
                    Revelar {isInverted ? 'Espanhol' : 'Tradução'}
                  </button>
                )}

                <AnimatePresence>
                  {isRevealed && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center mt-4 gap-y-4"
                    >
                      <div className="h-[1px] w-24 bg-orange-500/30 mb-2" />
                      <h4 className="flex gap-2 items-center text-xl md:text-3xl lg:text-5xl font-bold text-orange-400 uppercase tracking-tight mb-2">
                        {displayBack}
                        {isInverted && currentCard.pronunciation && (
                          <span className="text-lg md:text-2xl text-orange-500/60 lowercase italic tracking-normal ml-2">
                            /{currentCard.pronunciation}/
                          </span>
                        )}
                      </h4>
                      {currentCard.association && !isInverted && (
                        <div className="max-w-2xl p-6 bg-white/5 border border-white/10 mt-2">
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Associação Sugerida</span>
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

            <div className="mt-6 md:mt-12 min-h-[80px] md:h-32">
              <AnimatePresence>
                {isRevealed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-row gap-2 md:gap-4 w-full"
                  >
                    {studyMode === 'manual' ? (
                      <>
                        <button 
                          onClick={() => handleReview('1h')}
                          className="flex-1 flex flex-col items-center justify-center py-8 border-2 border-red-500/20 bg-white/[0.02] hover:bg-red-500/10 transition-all group"
                        >
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-white">DIFÍCIL</span>
                          <span className="text-lg font-black uppercase text-red-500 group-hover:text-white leading-none">Repetir</span>
                        </button>
                        <button 
                          onClick={() => handleReview('1d')}
                          className="flex-1 flex flex-col items-center justify-center py-8 border-2 border-orange-500/20 bg-white/[0.02] hover:bg-orange-500/10 transition-all group"
                        >
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-white">FÁCIL</span>
                          <span className="text-lg font-black uppercase text-orange-500 group-hover:text-white leading-none">Dominei</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {[
                          { top: '< 1 HORA', bottom: 'REVISAR', interval: '1h' as ReviewInterval, color: 'text-red-500 border-red-500/20' },
                          { top: '< 1 DIA', bottom: 'PRATICAR', interval: '1d' as ReviewInterval, color: 'text-orange-500 border-orange-500/20' },
                          { top: '< 4 DIAS', bottom: 'FIXAR', interval: '4d' as ReviewInterval, color: 'text-blue-500 border-blue-500/20' },
                          { top: 'MEMORIZADO', bottom: 'MAESTRIA', interval: 'memorized' as ReviewInterval, color: 'text-purple-500 border-purple-500/20' },
                        ].map((opt) => (
                          <button 
                            key={opt.interval}
                            onClick={() => handleReview(opt.interval)}
                            className={`flex-1 flex flex-col items-center justify-center p-2 md:p-4 min-h-[60px] border bg-white/[0.02] hover:bg-white/5 transition-all group active:scale-95`}
                          >
                            <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-wider md:tracking-widest mb-1 group-hover:text-white transition-colors">{opt.top}</span>
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

      <footer className="w-full max-w-4xl mt-6 md:mt-12 pt-4 md:pt-8 border-t border-white/5 relative z-10 flex justify-between items-center opacity-30">
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <Clock size={12} />
          {studyMode === 'manual' ? 'MODO MANUAL ATIVO' : 'SISTEMA SRS ATIVO'}
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">
           Método ITR v2.2
        </div>
      </footer>
    </div>
  );
}
