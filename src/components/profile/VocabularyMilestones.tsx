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
        <h3 className="text-xl md:text-2xl font-black text-white font-outfit">Marcos de Vocabulário</h3>
        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Evolução</span>
      </div>

      <div className="relative mb-12 py-2">
        {/* Linha Fina (Base) */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-slate-800 rounded-full z-0" />
        {/* Linha Fina (Progresso) */}
        <div 
          className="absolute top-1/2 left-4 h-0.5 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
          style={{ 
            width: `calc(${Math.min(100, (masteredCount / 1500) * 100)}% - 2rem)`,
            backgroundColor: 'var(--itr-primary)',
          }}
        />

        <div className="grid grid-cols-5 md:grid-cols-10 gap-x-3 gap-y-6 md:gap-y-8 relative z-10 w-full">
          {MILESTONES.map((m, i) => {
            // USUÁRIO SOLICITOU: Forçar desbloqueio em todos para teste de design
            const reached = true; 
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
                  ${isLegendary ? 'w-full h-12 md:h-14 rounded-xl text-sm md:text-base' : 'w-full h-10 md:h-12 rounded-lg text-xs md:text-sm'}
                `}
                style={{
                  borderColor: reached ? 'var(--itr-primary)' : '#1e293b',
                  borderWidth: '1px',
                  backgroundColor: reached ? (isCollecting ? 'var(--itr-primary)' : '#0f172a') : '#0f172a',
                  color: reached ? (isCollecting ? '#fff' : 'var(--itr-primary)') : '#475569',
                  boxShadow: reached ? '0 0 10px var(--itr-glow)' : 'none',
                  cursor: reached ? 'pointer' : 'not-allowed',
                }}
                whileHover={reached ? { scale: 1.1, boxShadow: '0 0 20px var(--itr-glow)' } : {}}
                whileTap={reached ? { scale: 0.95 } : {}}
              >
                {isCollecting ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }}>
                    <Star size={16} fill="currentColor" />
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-1">
                     {isLegendary && <Crown size={12} />}
                     {m}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* EPIC CARD PARA LEVEL MAXIMO - VERSÃO PREMIUM CLEAN */}
      {isMaxReached && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-slate-900 border border-slate-800 rounded-[24px] p-8 mt-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'var(--itr-primary)' }}></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border bg-slate-950 relative"
                 style={{ borderColor: 'var(--itr-glow)' }}>
               <Crown size={36} style={{ color: 'var(--itr-primary)' }} />
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold uppercase tracking-widest text-[10px] mb-1 block" style={{ color: 'var(--itr-primary)' }}>Maestria Suprema Alcançada</span>
              <h2 className="text-2xl md:text-3xl font-black font-outfit text-white mb-2">Árvore da Fluência</h2>
              <p className="text-slate-400 text-sm max-w-sm">Você dominou o vocabulário base oficial. Seu domínio do idioma agora é sólido e elegante.</p>
            </div>
          </div>

          <button 
            className="px-8 py-3 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105"
            style={{ backgroundColor: 'var(--itr-primary)' }}
          >
             Resgatar Premiação
          </button>
        </motion.div>
      )}
    </div>
  );
}
