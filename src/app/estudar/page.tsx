'use client';

import { useEffect, useState } from 'react';
import { getCards, getTodayPendingCards, saveCards } from '@/lib/srs';
import { Flashcard as IFlashcard } from '@/lib/types';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, CheckCircle, RefreshCcw } from 'lucide-react';

export default function StudyPage() {
  const [cards, setCards] = useState<IFlashcard[]>([]);
  const [pendingCards, setPendingCards] = useState<IFlashcard[]>([]);
  const [totalToday, setTotalToday] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentCards = getCards();
    const pending = getTodayPendingCards(currentCards);
    setCards(currentCards);
    setPendingCards(pending);
    setTotalToday(pending.length);
    setIsLoaded(true);
  }, []);

  const handleCardReviewed = () => {
    const updatedAll = getCards();
    const pending = getTodayPendingCards(updatedAll);
    setCards(updatedAll);
    setPendingCards(pending);
  };

  const resetToday = () => {
    const reset = cards.map(c => ({...c, nextReview: new Date().toISOString()}));
    saveCards(reset);
    setCards(reset);
    setPendingCards(reset);
    setTotalToday(reset.length);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 w-full"
      >
        <div className="inline-block p-1 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 px-3">Sessão Diária de Estudo</span>
        </div>
        <h1 className="text-4xl font-bold font-outfit mb-4">Mantenha sua Consistência</h1>
        <p className="text-slate-400 text-lg">Os cards abaixo precisam ser revisados hoje para fixação na memória.</p>
      </motion.div>

      <div className="w-full max-w-xl mb-12">
        <ProgressBar current={totalToday - pendingCards.length} total={totalToday} />
      </div>

      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">
          {pendingCards.length > 0 ? (
            <motion.div 
              key={pendingCards[0].id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg"
            >
              <Card card={pendingCards[0]} onReviewed={handleCardReviewed} />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-16 text-center max-w-lg w-full flex flex-col items-center bg-gradient-to-br from-slate-900 to-blue-900/10"
            >
              <div className="bg-emerald-500/20 p-5 rounded-full mb-8">
                <PartyPopper size={64} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 font-outfit">Meta do Dia atingida!</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">Você revisou todos os cards agendados para HOJE. Fixação concluída com sucesso.</p>
              
              <div className="flex flex-col gap-4 w-full">
                <button 
                   onClick={() => window.location.href = '/dashboard'}
                   className="btn-premium w-full py-4 text-lg bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 border-none"
                >
                  <CheckCircle size={20} className="mr-2 inline" /> Ver Progresso No Dashboard
                </button>
                <button 
                   onClick={resetToday}
                   className="text-slate-500 hover:text-slate-300 text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <RefreshCcw size={16} /> Estudar tudo novamente (revisão livre)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
