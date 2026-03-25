'use client';

import { useEffect, useState } from 'react';
import { getCards, getTodayPendingCards, saveCards } from '@/lib/srs';
import { Flashcard as IFlashcard } from '@/lib/types';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, CheckCircle, RefreshCcw, Layers, Play } from 'lucide-react';

export default function StudyPage() {
  const [allPendingCards, setAllPendingCards] = useState<IFlashcard[]>([]);
  const [activeCards, setActiveCards] = useState<IFlashcard[]>([]);
  const [totalToday, setTotalToday] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [availableDecks, setAvailableDecks] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = () => {
    const currentCards = getCards();
    const pending = getTodayPendingCards(currentCards);
    setAllPendingCards(pending);
    
    // Agrupar decks
    const deckCounts: Record<string, number> = {};
    pending.forEach(c => {
      const d = c.deck || 'Outros';
      deckCounts[d] = (deckCounts[d] || 0) + 1;
    });
    
    setAvailableDecks(Object.entries(deckCounts).map(([name, count]) => ({name, count})));
    setIsLoaded(true);
  };

  const startSession = (deckName: string | null) => {
    setSelectedDeck(deckName);
    const filtered = deckName ? allPendingCards.filter(c => (c.deck || 'Outros') === deckName) : allPendingCards;
    setActiveCards(filtered);
    setTotalToday(filtered.length);
  };

  const handleCardReviewed = () => {
    // Apenas remove da lista ativa
    setActiveCards(prev => prev.slice(1));
    // Re-carregar allCards em background para sincronizar
    const currentCards = getCards();
    setAllPendingCards(getTodayPendingCards(currentCards));
  };

  const resetToday = () => {
    const currentCards = getCards();
    const reset = currentCards.map(c => ({...c, nextReview: new Date().toISOString()}));
    saveCards(reset);
    loadCards();
    setSelectedDeck(null); // Volta pra seleção de deck
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4">
      
      {!selectedDeck && allPendingCards.length > 0 ? (
        // TELA DE SELEÇÃO DE DECK
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          <div className="text-center mb-10">
            <div className="inline-block p-1 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 flex items-center gap-2">
                <Layers size={14} /> Seleção de Baralho
              </span>
            </div>
            <h1 className="text-4xl font-bold font-outfit mb-4 text-white">O que vamos estudar hoje?</h1>
            <p className="text-slate-400 text-lg">Você tem <strong className="text-blue-400">{allPendingCards.length} cards</strong> pendentes no total.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => startSession(null)}
              className="premium-card p-6 bg-slate-900 border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex items-center justify-between group transition-all"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Todos os Cards</h3>
                <p className="text-sm text-slate-400">Revisão geral mista</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:scale-110">
                <Play size={20} className="ml-1" fill="currentColor" />
              </div>
            </button>

            {availableDecks.map(deck => (
              <button
                key={deck.name}
                onClick={() => startSession(deck.name)}
                className="premium-card p-6 bg-slate-900 border-slate-700/50 hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] flex items-center justify-between group transition-all"
              >
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{deck.name}</h3>
                  <p className="text-sm text-slate-400">{deck.count} cards pendentes</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:scale-110">
                  <Play size={20} className="ml-1" fill="currentColor" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        // TELA DE ESTUDO
        <>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 w-full"
          >
            <div className="inline-block p-1 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20 shadow-inner">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 px-3">
                {selectedDeck ? `Baralho: ${selectedDeck}` : 'Sessão Geral'}
              </span>
            </div>
            {activeCards.length > 0 && (
              <h1 className="text-3xl font-bold font-outfit mb-2 text-white">Módulos de Fixação</h1>
            )}
          </motion.div>

          <div className="w-full max-w-xl mb-12">
            <ProgressBar current={totalToday - activeCards.length} total={totalToday > 0 ? totalToday : 1} />
          </div>

          <div className="w-full flex justify-center perspective-1000">
            <AnimatePresence mode="wait">
              {activeCards.length > 0 ? (
                <motion.div 
                  key={activeCards[0].id}
                  initial={{ opacity: 0, scale: 0.95, y: 10, rotateX: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -30, rotateY: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  <Card card={activeCards[0]} onReviewed={handleCardReviewed} />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="premium-card p-12 md:p-16 text-center max-w-lg w-full flex flex-col items-center bg-slate-900 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                  
                  <div className="bg-emerald-500/20 p-5 rounded-full mb-8 relative z-10 animate-bounce shadow-lg shadow-emerald-500/20">
                    <PartyPopper size={64} className="text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 font-outfit text-white relative z-10">Sessão Concluída!</h2>
                  <p className="text-emerald-200/70 text-lg leading-relaxed mb-10 relative z-10">Você revisou todos os cards agendados. O sistema registrou sua maestria.</p>
                  
                  <div className="flex flex-col gap-4 w-full relative z-10">
                    <button 
                       onClick={() => window.location.href = '/dashboard'}
                       className="btn-premium w-full py-4 text-lg bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 border-emerald-400/50 text-white font-bold transition-all hover:scale-105"
                    >
                      <CheckCircle size={20} className="mr-2 inline" /> Ver Progresso
                    </button>
                    {selectedDeck !== null && allPendingCards.length > 0 && (
                      <button 
                         onClick={() => setSelectedDeck(null)}
                         className="text-slate-400 hover:text-white mt-2 transition-colors font-medium bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-700/50"
                      >
                        Continuar Outro Baralho
                      </button>
                    )}
                    <button 
                       onClick={resetToday}
                       className="text-slate-500 hover:text-blue-400 text-sm flex items-center justify-center gap-2 mt-4 transition-colors p-2"
                    >
                      <RefreshCcw size={16} /> Forçar revisão livre (estudar de novo)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
