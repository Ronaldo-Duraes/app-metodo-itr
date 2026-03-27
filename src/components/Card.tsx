'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as IFlashcard, ReviewInterval } from '@/lib/types';
import { updateCardReview, updateCardAssociation, getCards, playVictorySound, playBlipSound, PATENTES } from '@/lib/srs';
import { Check } from 'lucide-react';

interface CardProps {
  card: IFlashcard;
  onReviewed?: () => void;
  showOnlyBack?: boolean;
}

export default function Card({ card, onReviewed, showOnlyBack = false }: CardProps) {
  const [showBack, setShowBack] = useState(showOnlyBack);
  const [association, setAssociation] = useState(card.association || '');
  const [showToast, setShowToast] = useState(false);

  const handleReview = (interval: ReviewInterval) => {
    const cardsBefore = getCards().filter(c => c.isLearned).length;
    updateCardReview(card.id, interval);
    const cardsAfter = getCards().filter(c => c.isLearned).length;
    
    // Se acabamos de dominar uma palavra e atingimos exatamente o limite da próxima patente
    if (cardsAfter > cardsBefore) {
       const thresholdReached = PATENTES.some(p => p.minWords === cardsAfter && p.minWords > 0);
       if (thresholdReached) {
          playVictorySound();
       } else {
          playBlipSound();
       }
       setShowToast(true);
       setTimeout(() => {
         setShowToast(false);
         setShowBack(false);
         if (onReviewed) onReviewed();
       }, 800);
       return;
    }

    setShowBack(false);
    if (onReviewed) onReviewed();
  };

  return (
    <div className="w-full h-full perspective-1000">
      <AnimatePresence mode="wait">
        {!showBack ? (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="premium-card relative w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[400px] border border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:border-blue-400 group overflow-hidden bg-slate-900"
            onClick={() => setShowBack(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-sm uppercase tracking-widest text-blue-400 mb-4 z-10 font-bold">Inglês</span>
            <h2 className="text-5xl font-outfit font-bold text-white z-10">{card.front}</h2>
            <p className="mt-8 text-slate-400 text-sm italic z-10">Clique para revelar a tradução</p>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="premium-card w-full h-full flex flex-col items-center justify-between p-8 text-center min-h-[400px] border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden bg-slate-900"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl pointer-events-none" />
            
            <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 mt-4">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-2 font-bold">Português</span>
              <h2 className="text-4xl font-outfit font-bold text-white mb-6">{card.back}</h2>
              
              <div className="w-full text-left max-w-sm mx-auto">
                <label className="text-xs uppercase tracking-wider text-slate-400 mb-2 block font-semibold flex justify-between items-center">
                  <span>Sua Técnica de Memorização</span>
                </label>
                <textarea 
                  value={association}
                  onChange={(e) => {
                    setAssociation(e.target.value);
                    updateCardAssociation(card.id, e.target.value);
                  }}
                  placeholder="Ex: Como você vai lembrar dessa palavra?"
                  className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all h-24 resize-none shadow-inner"
                />
              </div>
            </div>

            {!showOnlyBack && !showToast && (
              <div className="grid grid-cols-3 gap-3 w-full mt-8 relative z-10 max-w-sm mx-auto">
                <button
                  onClick={() => handleReview('10m')}
                  className="btn-premium py-3 px-2 text-sm bg-slate-900/80 border border-rose-500/30 text-rose-400 hover:border-rose-500 hover:bg-rose-500/10 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex flex-col items-center justify-center gap-1 font-bold rounded-2xl"
                >
                  <span className="text-[10px] text-rose-500/70 font-normal uppercase tracking-wider">&lt; 10 MIN</span>
                  Difícil
                </button>
                <button
                  onClick={() => handleReview('1d')}
                  className="btn-premium py-3 px-2 text-sm bg-slate-900/80 border border-amber-500/30 text-amber-400 hover:border-amber-500 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex flex-col items-center justify-center gap-1 font-bold rounded-2xl"
                >
                  <span className="text-[10px] text-amber-500/70 font-normal uppercase tracking-wider">&lt; 1 DIA</span>
                  Médio
                </button>
                <button
                  onClick={() => handleReview('4d')}
                  className="btn-premium py-3 px-2 text-sm bg-emerald-600/10 border border-emerald-500/50 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex flex-col items-center justify-center gap-1 font-bold rounded-2xl"
                >
                  <span className="text-[10px] text-emerald-500/70 font-normal uppercase tracking-wider">&lt; 4 DIAS</span>
                  Fácil
                </button>
              </div>
            )}

            <AnimatePresence>
              {showToast && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.5, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 border border-emerald-400 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.5)] z-20 whitespace-nowrap"
                >
                   <Check size={20} />
                   +1 Masterizada! Progresso Subindo.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
