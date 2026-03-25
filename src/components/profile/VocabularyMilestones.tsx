'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Crown, Flame, Trees, Zap } from 'lucide-react';
import { redeemReward } from '@/lib/firebase';

interface VocabularyMilestonesProps {
  masteredCount: number;
  uid: string;
  unlockedRewards: string[];
}

const MILESTONES = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  150, 200, 250, 300, 400, 
  500, 600, 700, 1100, 1500
];

export default function VocabularyMilestones({ masteredCount, uid, unlockedRewards }: VocabularyMilestonesProps) {
  const [lastCollected, setLastCollected] = useState<number | null>(null);

  const handleCollect = (m: number) => {
    if (masteredCount >= m) {
      setLastCollected(m);
      setTimeout(() => setLastCollected(null), 1500);
    }
  };

  const onRedeem = async (rewardKey: string) => {
    try {
      await redeemReward(uid, rewardKey);
      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao resgatar:", error);
    }
  };

  const isRubyClaimed = unlockedRewards.includes('ruby_500');
  const isGoldClaimed = unlockedRewards.includes('gold_1500');

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-black text-white font-outfit">Marcos de Vocabulário</h3>
        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Evolução</span>
      </div>

      <div className="relative mb-12">
        {/* Linha Fina (Base) - Centralizada entre as fileiras */}
        <div className="absolute top-[50%] left-2 right-2 h-[1px] md:h-0.5 -translate-y-1/2 bg-slate-800 rounded-full z-0 opacity-50" />
        
        {/* Linha Fina (Progresso) - Centralizada entre as fileiras */}
        <div 
          className="absolute top-[50%] left-2 h-[1px] md:h-0.5 -translate-y-1/2 rounded-full z-0 transition-all duration-200 ease-out"
          style={{ 
            width: `calc(${Math.min(100, (masteredCount / 1500) * 100)}% - 1rem)`,
            backgroundColor: 'var(--itr-primary)',
            boxShadow: '0 0 10px var(--itr-glow)'
          }}
        />

        <div className="grid grid-cols-5 md:grid-cols-10 gap-x-3 gap-y-6 md:gap-y-10 relative z-10 w-full items-center">
          {MILESTONES.map((m, i) => {
            const reached = masteredCount >= m; 
            const prev = i === 0 ? 0 : MILESTONES[i-1];
            const isNext = !reached && masteredCount >= prev;
            const fillPercent = isNext ? Math.min(100, Math.max(0, ((masteredCount - prev) / (m - prev)) * 100)) : 0;
            
            const isCollecting = lastCollected === m;
            const isGold = m === 1500;
            const isRuby = m === 500;
            const isLegendary = isGold || isRuby;
            
            return (
              <motion.button
                key={m}
                onClick={() => handleCollect(m)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isLegendary ? { 
                  opacity: (reached || isNext) ? 1 : 0.4,
                  scale: reached ? 1.1 : 1,
                  filter: (reached || isNext) ? 'grayscale(0)' : 'grayscale(1)',
                  boxShadow: reached 
                    ? (isGold 
                        ? ['0 0 15px rgba(251, 191, 36, 0.3)', '0 0 35px rgba(251, 191, 36, 0.6)', '0 0 15px rgba(251, 191, 36, 0.3)']
                        : ['0 0 15px rgba(239, 68, 68, 0.3)', '0 0 35px rgba(239, 68, 68, 0.6)', '0 0 15px rgba(239, 68, 68, 0.3)'])
                    : 'none'
                } : {
                  opacity: (reached || isNext) ? 1 : 0.4,
                  scale: 1,
                  filter: (reached || isNext) ? 'grayscale(0)' : 'grayscale(1)',
                  boxShadow: reached ? '0 0 10px var(--itr-glow)' : 'none'
                }}
                transition={isLegendary && reached ? { 
                  boxShadow: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  delay: i * 0.01
                } : { delay: i * 0.01 }}
                disabled={!reached && !isNext}
                className={`relative flex items-center justify-center font-black font-outfit transition-all duration-200 ease-out mx-auto w-full h-10 md:h-12 rounded-lg text-xs md:text-sm flex-shrink-0 z-20 overflow-hidden ${!reached && !isNext ? 'grayscale opacity-40 cursor-not-allowed' : ''}`}
                style={{
                  borderColor: isGold ? '#fbbf24' : (isRuby ? '#ef4444' : 'var(--itr-primary)'),
                  borderWidth: isLegendary ? '2px' : '1px',
                  backgroundColor: '#0f172a',
                  color: (reached || isCollecting) ? (isGold ? '#fbbf24' : (isRuby ? '#ef4444' : '#fff')) : (isNext ? 'rgba(255,255,255,0.7)' : 'var(--itr-primary)'),
                  background: reached 
                    ? (isCollecting ? 'var(--itr-primary)' : (isLegendary ? '#050505' : 'var(--itr-primary)'))
                    : (isNext 
                        ? `linear-gradient(to top, var(--itr-primary) ${fillPercent}%, transparent ${fillPercent}%)`
                        : '#0f172a'
                      )
                }}
                whileHover={reached ? { 
                  scale: isLegendary ? 1.2 : 1.1, 
                  boxShadow: isGold 
                    ? '0 0 50px rgba(251, 191, 36, 0.8)' 
                    : (isRuby ? '0 0 50px rgba(239, 68, 68, 0.8)' : '0 0 20px var(--itr-glow)') 
                } : {}}
              >
                {/* Overlay sutil para o efeito de preenchimento parecer 'fluido' */}
                {isNext && (
                   <div 
                     className="absolute inset-0 bg-white/5 pointer-events-none transition-all duration-200 ease-out" 
                     style={{ height: `${fillPercent}%`, top: 'auto', bottom: 0 }}
                   />
                )}
                
                {isCollecting ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }}>
                    <Star size={16} fill="currentColor" />
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-1 relative z-10">
                     {isGold && <Crown size={14} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}
                     {isRuby && <Zap size={14} className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" />}
                     {m}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Seção Rubi (500 Palavras) */}
      <div className={`mt-8 transition-all duration-700 ${masteredCount < 500 ? 'grayscale opacity-40' : 'opacity-100'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2rem] border-2 bg-[#050505] flex flex-col md:flex-row items-center justify-between gap-6 border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.1)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/50 flex items-center justify-center border border-[#ef4444]/30">
               <Zap size={28} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </div>
            <div>
              <h4 className="text-lg font-black font-outfit text-white">Recompensa Rubi</h4>
              <p className="text-xs text-slate-400">Desbloqueado ao atingir 500 palavras masterizadas.</p>
            </div>
          </div>
          <button 
            disabled={masteredCount < 500 || isRubyClaimed}
            onClick={() => onRedeem('ruby_500')}
            className={`px-8 py-3 rounded-xl font-black font-outfit text-xs tracking-widest transition-all border-2 border-[#ef4444] bg-[#050505] text-[#ef4444] hover:bg-[#ef4444] hover:text-white flex items-center gap-2 
              ${masteredCount >= 500 && !isRubyClaimed ? 'animate-pulse cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              ${isRubyClaimed ? 'bg-[#ef4444] text-white border-transparent' : ''}
            `}
          >
             {isRubyClaimed ? <Star size={16} fill="white" /> : <Zap size={16} />}
             {isRubyClaimed ? 'RESGATADO' : 'RESGATAR RUBI'}
          </button>
        </motion.div>
      </div>

      {/* Card Épico da Árvore da Fluência */}
      <div className={`transition-all duration-700 ${masteredCount < 1500 ? 'grayscale opacity-40' : 'opacity-100'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 p-8 rounded-[2.5rem] border-2 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(255,215,0,0.15)]"
          style={{ 
            backgroundColor: '#050505',
            borderColor: '#FFD700',
            background: 'linear-gradient(to bottom, #0a0a0a, #050505)'
          }}
        >
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
            disabled={masteredCount < 1500 || isGoldClaimed}
            onClick={() => onRedeem('gold_1500')}
            animate={masteredCount >= 1500 && !isGoldClaimed ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`px-10 py-5 font-black font-outfit rounded-2xl transition-all border-2 border-[#FFD700] active:scale-95 flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)] relative group overflow-hidden
              ${masteredCount >= 1500 && !isGoldClaimed ? 'bg-[#050505] text-[#FFD700] hover:bg-[#FFD700] hover:text-black cursor-pointer' : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'}
              ${isGoldClaimed ? 'bg-[#FFD700] text-black border-transparent' : ''}
            `}
          >
             <Trees size={24} />
             <span className="tracking-widest uppercase">{isGoldClaimed ? 'RESGATADO' : 'RESGATAR OURO'}</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
