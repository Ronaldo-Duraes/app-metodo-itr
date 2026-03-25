'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PATENTES, getUserPatente } from '@/lib/srs';
import { Sprout, Leaf, Activity, Shrub, Trees, Lock } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const ICON_MAP: Record<string, any> = {
  'Sprout': Sprout,
  'Leaf': Leaf,
  'Activity': Activity,
  'Shrub': Shrub,
  'Trees': Trees,
};

interface EvolutionRoadMapProps {
  masteredCount: number;
}

export default function EvolutionRoadMap({ masteredCount }: EvolutionRoadMapProps) {
  const patenteInfo = getUserPatente(masteredCount);
  const { activeThemeName, setThemeByName, customColor, setCustomColor } = useTheme();

  return (
    <div className="w-full pb-4">
      <div className="flex justify-between items-center mb-8 px-2 md:px-6">
        <h3 className="text-lg md:text-xl font-bold font-outfit flex items-center gap-2" style={{ color: 'var(--itr-primary)' }}>
          Road Map Visual
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
          Modo Exibição
        </span>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-2 md:px-8 h-28">
        
        {/* Color picker exclusivo para Árvore da fluência no top */}
        <AnimatePresence>
          {activeThemeName === 'Árvore da Fluência' && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="absolute right-8 -top-8 flex items-center gap-3 bg-slate-900 border border-slate-700 p-2 rounded-xl shadow-[0_0_20px_var(--itr-glow)] z-50"
            >
               <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Sua Cor:</span>
               <input 
                  type="color" 
                  value={customColor} 
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-6 h-6 rounded shrink-0 cursor-pointer border-none bg-transparent"
               />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Linha Fundo */}
        <div className="absolute left-[10%] right-[10%] top-[1.3rem] h-1.5 w-[80%] bg-slate-800 -z-10 rounded-full" />
        
        {/* Progresso Dinâmico da Linha */}
        <div className="absolute left-[10%] top-[1.3rem] h-1.5 w-[80%] flex -z-10">
          <div 
            className="h-full rounded-full transition-all duration-1000" 
            style={{ 
              width: `${((patenteInfo.current.level - 1) / (PATENTES.length - 1)) * 100}%`,
              backgroundColor: 'var(--itr-primary)',
              boxShadow: '0 0 25px var(--itr-glow)'
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-start relative w-full h-full">
          {PATENTES.map((patente, i) => {
            const isCurrentMode = activeThemeName === patente.name;
            const isAchieved = patenteInfo.current.level >= patente.level;
            const isLocked = patenteInfo.current.level < patente.level;
            const Icon = ICON_MAP[patente.iconName];

            return (
              <motion.div
                key={patente.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center flex-1 cursor-pointer group"
                onClick={() => isAchieved && setThemeByName(patente.name)}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative border-2 bg-slate-900 z-10
                  ${isCurrentMode ? 'scale-125' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-110 group-hover:z-20'}`}
                  style={{
                    borderColor: isCurrentMode || (isAchieved && !isCurrentMode) ? 'var(--itr-primary)' : '#334155',
                    color: isCurrentMode || isAchieved ? (isCurrentMode ? 'white' : 'var(--itr-primary)') : '#64748b',
                    backgroundColor: isCurrentMode ? 'var(--itr-primary)' : '#0f172a',
                    boxShadow: isCurrentMode ? '0 0 35px var(--itr-glow)' : (isAchieved ? '0 0 10px var(--itr-glow)' : 'none')
                  }}
                >
                  <motion.div
                    animate={isCurrentMode ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                     <Icon size={isCurrentMode ? 22 : 18} />
                  </motion.div>
                  {isLocked && <Lock size={12} className="absolute -bottom-1 -right-1 text-slate-500 bg-slate-900 border border-slate-700 rounded-full p-[2px]" />}
                </div>

                <div className="text-center mt-5 transition-transform group-hover:translate-y-1">
                  <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-tight mb-0.5 transition-colors"
                    style={{ color: isCurrentMode ? 'var(--itr-primary)' : '#64748b', textShadow: isCurrentMode ? '0 0 10px var(--itr-glow)' : 'none' }}>
                    {patente.name}
                  </h4>
                  <span className="text-[8px] text-slate-500 font-bold block">
                    {patente.minWords}{patente.maxWords ? `-${patente.maxWords}` : '+'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
