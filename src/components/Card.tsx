'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as IFlashcard, ReviewInterval } from '@/lib/types';
import { updateCardReview, updateCardAssociation } from '@/lib/srs';

interface CardProps {
  card: IFlashcard;
  onReviewed?: () => void;
  showOnlyBack?: boolean;
}

export default function Card({ card, onReviewed, showOnlyBack = false }: CardProps) {
  const [showBack, setShowBack] = useState(showOnlyBack);
  const [association, setAssociation] = useState(card.association || '');

  const handleReview = (interval: ReviewInterval) => {
    updateCardReview(card.id, interval);
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
            className="premium-card w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[350px]"
            onClick={() => setShowBack(true)}
          >
            <span className="text-sm uppercase tracking-widest text-blue-400 mb-4">Inglês</span>
            <h2 className="text-4xl font-outfit font-bold">{card.front}</h2>
            <p className="mt-8 text-slate-400 text-sm italic">Clique para revelar</p>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="premium-card w-full h-full flex flex-col items-center justify-between p-8 text-center min-h-[350px]"
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-2">Português</span>
              <h2 className="text-4xl font-outfit font-bold text-emerald-50 mb-6">{card.back}</h2>
              
              <div className="w-full text-left">
                <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block font-semibold">
                  Minha Técnica de Memorização
                </label>
                <textarea 
                  value={association}
                  onChange={(e) => {
                    setAssociation(e.target.value);
                    updateCardAssociation(card.id, e.target.value);
                  }}
                  placeholder="Como você vai lembrar dessa palavra?"
                  className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all h-28 resize-none shadow-inner"
                />
              </div>
            </div>

            {!showOnlyBack && (
              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                {(['1h', '24h', '1s', '1m'] as ReviewInterval[]).map((interval) => (
                  <button
                    key={interval}
                    onClick={() => handleReview(interval)}
                    className="btn-premium py-2 px-1 text-xs bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                  >
                    {interval === '1s' ? '1 semana' : interval === '1m' ? '1 mês' : interval}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
