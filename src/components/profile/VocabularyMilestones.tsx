'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Crown, Flame } from 'lucide-react';

interface VocabularyMilestonesProps {
  masteredCount: number;
}

const MILESTONES = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  150, 200, 250, 300,
  400, 500, 600, 700, 1100, 1500
];

export default function VocabularyMilestones({ masteredCount }: VocabularyMilestonesProps) {
  const [lastCollected, setLastCollected] = useState<number | null>(null);

  const handleCollect = (m: number) => {
    if (masteredCount >= m) {
      setLastCollected(m);
      setTimeout(() => setLastCollected(null), 1500);
    }
  };

  const isMaxReached = masteredCount >= 1500;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-white font-outfit">Marcos de Vocabulário</h3>
        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Micro-Recompensas</span>
      </div>

      <div className="relative mb-12 py-4">
        {/* Linha Conectora de Neon */}
        <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full z-0" />
        <div 
          className="absolute top-1/2 left-4 h-1.5 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
          style={{ 
            width: `calc(${Math.min(100, (masteredCount / 1500) * 100)}% - 2rem)`,
            backgroundColor: 'var(--itr-primary)',
            boxShadow: '0 0 25px var(--itr-glow)'
          }}
        />

        <div className="grid grid-cols-5 md:grid-cols-10 gap-x-3 gap-y-6 md:gap-y-8 relative z-10 w-full">
          {MILESTONES.map((m, i) => {
            const reached = masteredCount >= m;
            const isCollecting = lastCollected === m;
            const isLegendary = m === 1500;
            
            return (
              <motion.button
                key={m}
                onClick={() => handleCollect(m)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                disabled={!reached}
                className={`relative flex items-center justify-center font-black font-outfit transition-all duration-300 mx-auto
                  ${isLegendary ? 'w-full h-14 md:h-16 rounded-2xl text-[16px] md:text-lg z-20' : 'w-full h-12 md:h-14 rounded-xl text-sm md:text-base'}
                `}
                style={{
                  borderColor: isLegendary ? (reached ? '#fbbf24' : '#1e293b') : (reached ? 'var(--itr-primary)' : '#1e293b'),
                  borderWidth: isLegendary ? '3px' : '2px',
                  backgroundColor: isLegendary ? (reached ? '#281a02' : '#0f172a') : (reached ? 'var(--itr-primary)' : '#0f172a'),
                  color: isLegendary ? (reached ? '#fbbf24' : '#475569') : (reached ? '#fff' : '#475569'),
                  boxShadow: reached && lastCollected !== m ? (isLegendary ? '0 0 30px rgba(251, 191, 36, 0.6)' : '0 0 20px var(--itr-glow)') : 'none',
                  cursor: reached ? 'pointer' : 'not-allowed',
                  backgroundImage: isLegendary && reached ? 'linear-gradient(45deg, rgba(251,191,36,0.1), rgba(251,191,36,0.3))' : 'none',
                }}
                whileHover={reached ? { scale: 1.15 } : {}}
                whileTap={reached ? { scale: 0.95 } : {}}
              >
                {isCollecting ? (
                  <motion.div animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }} transition={{ duration: 0.5 }}>
                    <Star size={isLegendary ? 24 : 16} fill="currentColor" />
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-1.5">
                     {isLegendary && reached && <Crown size={14} className="mb-0.5" />}
                     {m}
                  </span>
                )}

                <AnimatePresence>
                  {isCollecting && (
                    <motion.div 
                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -50, scale: 1.8 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute pointer-events-none"
                      style={{ zIndex: 50, color: isLegendary ? '#fbbf24' : 'var(--itr-primary)', filter: `drop-shadow(0 0 15px ${isLegendary ? 'rgba(251,191,36,0.8)' : 'var(--itr-glow)'})` }}
                    >
                      <Flame fill="currentColor" size={32} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* EPIC CARD PARA LEVEL MAXIMO */}
      {isMaxReached && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative overflow-hidden border-none p-[2px] rounded-[32px] mt-10"
          style={{ 
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
            boxShadow: '0 0 60px rgba(251, 191, 36, 0.4)'
          }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
          
          <div className="bg-slate-950/90 w-full h-full rounded-[30px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0 border-4 border-amber-400/50 relative shadow-[0_0_50px_rgba(251,191,36,0.6)] bg-gradient-to-br from-amber-600 to-amber-400">
                 <Crown size={48} className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
                 <div className="absolute -bottom-3 bg-slate-900 border border-amber-400/50 uppercase font-black text-xs px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)] text-amber-400">Lendário</div>
              </div>
              <div>
                <span className="font-bold uppercase tracking-widest text-xs mb-2 block text-amber-500">1500+ Palavras Dominadas</span>
                <h2 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2">Árvore da Fluência</h2>
                <p className="text-slate-300 text-sm max-w-sm">Você alcançou a maestria máxima do Método ITR. Seu vocabulário suporta qualquer nível avançado de comunicação de forma sublime.</p>
              </div>
            </div>

            <button 
              className="px-8 py-4 text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 font-bold rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-105 hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] transition-all flex items-center gap-2 shrink-0 group"
            >
               <Star fill="currentColor" size={20} className="group-hover:rotate-180 transition-transform duration-700" /> Resgatar Ouro
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
