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
  const { activeThemeName, setThemeByName } = useTheme();

  return (
    <div className="w-full pb-4">
      <div className="flex justify-between items-center mb-8 px-2 md:px-6">
        <h3 className="text-lg md:text-xl font-bold font-outfit flex items-center gap-2" style={{ color: 'var(--itr-primary)' }}>
          Jornada de Maestria
        </h3>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-2 md:px-8 h-28">
        
        {/* Linha Fundo (Cinza discreta) */}
        <div className="absolute left-[10%] right-[10%] top-[1.3rem] h-0.5 w-[80%] bg-slate-800 -z-10 rounded-full" />
        
        {/* Progresso Dinâmico da Linha (Cor da Patente) - FORÇADO 100% PARA TESTE */}
        <div className="absolute left-[10%] top-[1.3rem] h-0.5 w-[80%] flex -z-10">
          <div 
            className="h-full rounded-full transition-all duration-1000" 
            style={{ 
              width: `100%`, // Forçado para o usuário ver o design da linha
              backgroundColor: 'var(--itr-primary)',
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-start relative w-full h-full">
          {PATENTES.map((patente, i) => {
            const isCurrentMode = activeThemeName === patente.name;
            // USUÁRIO SOLICITOU: Forçar visual de conquistado para teste
            const isAchieved = true; 
            const isLocked = false; 
            const Icon = ICON_MAP[patente.iconName];

            return (
              <motion.div
                key={patente.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                className={`flex flex-col items-center flex-1 transition-transform group ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => isAchieved && setThemeByName(patente.name)}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative border-2 bg-slate-900 z-10
                  ${isCurrentMode ? 'scale-125' : 'opacity-90 group-hover:scale-110'}`}
                  style={{
                    borderColor: isCurrentMode || (isAchieved && !isCurrentMode) ? 'var(--itr-primary)' : '#334155',
                    color: isCurrentMode || isAchieved ? (isCurrentMode ? 'white' : 'var(--itr-primary)') : '#64748b',
                    backgroundColor: isCurrentMode ? 'var(--itr-primary)' : '#0f172a',
                    boxShadow: isCurrentMode ? '0 0 20px var(--itr-glow)' : 'none'
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
                    style={{ color: isCurrentMode ? 'var(--itr-primary)' : '#64748b' }}>
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
