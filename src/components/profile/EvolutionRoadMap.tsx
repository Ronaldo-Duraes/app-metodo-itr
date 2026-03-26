'use client';

import { useState } from 'react';
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

  // Calcula a porcentagem real de progresso na jornada (níveis 1 a 5) sem atraso
  const realProgressPercent = ((patenteInfo.current.level - 1) / (PATENTES.length - 1)) * 100;

  // Estado para efeito hover ultra-rápido sincronizado com a linha
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full pb-4">
      <div className="flex justify-between items-center mb-10 px-2 md:px-6">
        <h3 className="text-lg md:text-xl font-bold font-outfit flex items-center gap-2" style={{ color: 'var(--itr-primary)' }}>
          Jornada de Maestria
        </h3>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-6 md:px-12 h-32">
        
        {/* Linha da Jornada (Industrial Minimalist) */}
        <div className="absolute left-[10%] right-[10%] top-[24px] md:top-[28px] h-[2px] -translate-y-1/2 z-0 overflow-visible rounded-full">
          {/* Fundo da Linha (Base Escura) */}
          <div className="absolute inset-0 bg-zinc-800 rounded-full" />
          
          {/* Progresso Iluminado (Ouro Lendário) */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ 
              width: `${realProgressPercent}%`,
              boxShadow: '0 0 15px #FFD700'
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute h-full rounded-full"
            style={{ 
              background: 'linear-gradient(to right, #B8860B, #FFD700, #FFFACD)'
            }}
          >
             {/* Efeito de Brilho Dinâmico */}
             <div className="absolute inset-0 bg-white/20" />
          </motion.div>
        </div>

        <div className="flex flex-row justify-between items-start relative w-full h-full">
          {PATENTES.map((patente, i) => {
            const isCurrentMode = activeThemeName === patente.name;
            const isAchieved = patenteInfo.current.level >= patente.level; 
            const Icon = ICON_MAP[patente.iconName];

            return (
              <motion.div
                key={patente.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.075 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center flex-1 cursor-pointer group z-10"
                onClick={() => setThemeByName(patente.name)}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-75 ease-out relative border-2 z-10
                  ${isCurrentMode ? 'scale-110' : 'opacity-80 group-hover:opacity-100'}`}
                  style={{
                    borderColor: isCurrentMode || isAchieved ? 'var(--itr-primary)' : '#334155',
                    color: isCurrentMode || isAchieved ? (isCurrentMode ? 'white' : 'var(--itr-primary)') : '#64748b',
                    backgroundColor: isCurrentMode ? 'var(--itr-primary)' : '#0f172a',
                    boxShadow: isCurrentMode || isAchieved ? '0 0 20px var(--itr-glow)' : 'none'
                  }}
                >
                  <Icon size={isCurrentMode ? 24 : 20} strokeWidth={isCurrentMode ? 2.5 : 2} />
                </div>

                <div className="text-center mt-6 w-full px-1 flex flex-col items-center">
                  <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-tight mb-1 transition-colors whitespace-nowrap duration-75"
                    style={{ color: isCurrentMode ? 'var(--itr-primary)' : '#94a3b8' }}>
                    {patente.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter opacity-80 whitespace-nowrap">
                    {patente.minWords}{patente.maxWords ? `-${patente.maxWords}` : '+'} pts
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
