'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Crown, Flame, Trees } from 'lucide-react';

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

  // USUÁRIO SOLICITOU: Forçar visual completo para teste de design
  const isMaxReached = true; 

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
                animate={isLegendary ? { 
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    '0 0 15px rgba(251, 191, 36, 0.3)', 
                    '0 0 35px rgba(251, 191, 36, 0.6)', 
                    '0 0 15px rgba(251, 191, 36, 0.3)'
                  ] 
                } : {
                  opacity: 1,
                  scale: 1,
                  boxShadow: reached ? '0 0 10px var(--itr-glow)' : 'none'
                }}
                transition={isLegendary ? { 
                  opacity: { delay: i * 0.02 },
                  scale: { delay: i * 0.02 },
                  boxShadow: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                } : {
                  delay: i * 0.02
                }}
                disabled={!reached}
                className={`relative flex items-center justify-center font-black font-outfit transition-all duration-500 mx-auto
                  ${isLegendary ? 'w-full h-14 md:h-16 rounded-2xl text-[16px] md:text-lg z-20' : 'w-full h-10 md:h-12 rounded-lg text-xs md:text-sm'}
                `}
                style={{
                  borderColor: isLegendary ? '#fbbf24' : 'var(--itr-primary)',
                  borderWidth: isLegendary ? '2px' : '1px',
                  backgroundColor: isLegendary ? '#1e1b10' : (isCollecting ? 'var(--itr-primary)' : '#0f172a'),
                  color: isLegendary ? '#fbbf24' : (isCollecting ? '#fff' : 'var(--itr-primary)'),
                  cursor: reached ? 'pointer' : 'not-allowed',
                }}
                whileHover={reached ? { scale: 1.1, boxShadow: isLegendary ? '0 0 50px rgba(251, 191, 36, 0.8)' : '0 0 20px var(--itr-glow)' } : {}}
                whileTap={reached ? { scale: 0.95 } : {}}
              >
                {isCollecting ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }}>
                    <Star size={isLegendary ? 20 : 16} fill="currentColor" />
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-1.5">
                     {isLegendary && <Crown size={isLegendary ? 18 : 12} className="text-amber-400" />}
                     {m}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Card Épico da Árvore da Fluência (Sempre Lendário: Ouro & Preto) */}
      {isMaxReached && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 p-8 rounded-[2.5rem] border-2 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(255,215,0,0.15)]"
          style={{ 
            backgroundColor: '#050505',
            borderColor: '#FFD700',
            background: 'linear-gradient(to bottom, #0a0a0a, #050505)'
          }}
        >
          {/* Efeito de Metal Escovado / Brilho de Borda */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-900/50 flex items-center justify-center border border-[#FFD700]/30 relative group">
              <Crown size={40} className="text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]" />
              <div className="absolute inset-0 bg-[#FFD700]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700] opacity-80 mb-2 block drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                MAESTRIA SUPREMA ALCANÇADA
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                Árvore da Fluência
              </h2>
              <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                Você dominou o vocabulário base oficial. Seu domínio do idioma agora é sólido e elegante.
              </p>
            </div>
          </div>

          <motion.button 
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="px-10 py-5 text-[#FFD700] font-black font-outfit rounded-2xl transition-all border-2 border-[#FFD700] bg-[#050505] hover:bg-[#FFD700] hover:text-black active:scale-95 flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] relative group overflow-hidden"
          >
             <Trees size={24} className="transition-colors duration-300" />
             <span className="tracking-widest uppercase transition-colors duration-300">RESGATAR OURO</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
