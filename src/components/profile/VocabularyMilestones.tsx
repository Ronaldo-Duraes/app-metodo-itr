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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-white font-outfit">Marcos de Vocabulário</h3>
        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Micro-Recompensas</span>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4 mb-10">
        {MILESTONES.filter(m => m < 1500).map((m, i) => {
          const reached = masteredCount >= m;
          const isCollecting = lastCollected === m;
          
          return (
            <motion.button
              key={m}
              onClick={() => handleCollect(m)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              disabled={!reached}
              className="relative flex items-center justify-center h-12 w-full rounded-xl border-2 font-black font-outfit transition-all duration-300"
              style={{
                borderColor: reached ? 'var(--itr-primary)' : '#1e293b',
                backgroundColor: reached ? 'var(--itr-primary)' : '#0f172a',
                color: reached ? '#fff' : '#475569',
                boxShadow: reached && lastCollected !== m ? '0 0 15px var(--itr-glow)' : 'none',
                cursor: reached ? 'pointer' : 'not-allowed'
              }}
              whileHover={reached ? { scale: 1.05 } : {}}
              whileTap={reached ? { scale: 0.95 } : {}}
            >
              {isCollecting ? (
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }} transition={{ duration: 0.5 }}>
                  <Star size={16} fill="currentColor" />
                </motion.div>
              ) : (
                reached ? m : m
              )}

              <AnimatePresence>
                {isCollecting && (
                  <motion.div 
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -40, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute pointer-events-none"
                    style={{ zIndex: 50, color: 'var(--itr-primary)', dropShadow: '0 0 10px var(--itr-glow)' }}
                  >
                    <Flame fill="currentColor" size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* EPIC CARD PARA LEVEL MAXIMO */}
      {isMaxReached && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative overflow-hidden border-none p-[2px] rounded-[32px]"
          style={{ 
            background: 'linear-gradient(45deg, var(--itr-primary), transparent)',
            boxShadow: '0 0 40px var(--itr-glow)'
          }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
          
          <div className="bg-slate-950/90 w-full h-full rounded-[30px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0 border-4 border-white/20 relative animate-[pulse_3s_infinite]"
                   style={{ backgroundColor: 'var(--itr-primary)', boxShadow: '0 0 40px var(--itr-glow)' }}>
                 <Crown size={48} className="text-white" />
                 <div className="absolute -bottom-3 bg-white uppercase font-black text-xs px-3 py-1 rounded-full shadow-lg" style={{ color: 'var(--itr-primary)' }}>Lendário</div>
              </div>
              <div>
                <span className="font-bold uppercase tracking-widest text-xs mb-2 block" style={{ color: 'var(--itr-primary)' }}>1500+ Palavras Dominadas</span>
                <h2 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2">Árvore da Fluência</h2>
                <p className="text-slate-300 text-sm max-w-sm">Você alcançou a maestria máxima do Método ITR. Seu vocabulário suporta qualquer nível avançado de comunicação.</p>
              </div>
            </div>

            <button 
              className="px-8 py-4 text-white font-bold rounded-2xl transition-transform flex items-center gap-2 shrink-0 hover:scale-105"
              style={{ backgroundColor: 'var(--itr-primary)', boxShadow: '0 0 20px var(--itr-glow)' }}
            >
               <Star fill="currentColor" size={20} /> Resgatar Medalha
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
