'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PATENTES, getUserPatente } from '@/lib/srs';
import { Sprout, Leaf, Activity, Shrub, Trees } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const ICON_MAP: Record<string, any> = {
  'Sprout': Sprout,
  'Leaf': Leaf,
  'Activity': Activity,
  'Shrub': Shrub,
  'Trees': Trees,
};

interface MaestriaRoadmapProps {
  masteredCount: number;
  highlightedMilestone?: number;
}

export default function MaestriaRoadmap({ masteredCount, highlightedMilestone }: MaestriaRoadmapProps) {
  const patenteInfo = getUserPatente(masteredCount);
  const { activeThemeName, setThemeByName } = useTheme();

  // Calcula a porcentagem real de progresso na jornada (níveis 1 a 5)
  const realProgressPercent = ((patenteInfo.current.level - 1) / (PATENTES.length - 1)) * 100;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full pb-4">
      <div className="flex justify-between items-center mb-10 px-2 md:px-6">
        <h3 className="text-lg md:text-xl font-bold font-outfit flex items-center gap-2" style={{ color: 'var(--itr-primary)' }}>
          Jornada de Maestria
        </h3>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-6 md:px-12 h-32">
        
        {/* --- ANCORA: LINHA JORNADA --- */}
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
        {/* --- FIM ANCORA: LINHA JORNADA --- */}

        <div className="flex flex-row justify-between items-start relative w-full h-full">
          {PATENTES.map((patente, i) => {
            if (patente.level === 1 && i === 0 && patente.minWords === 0) {
               // Semente é o ponto inicial, mas os marcos de maestria reais começam em 100
            }
            
            const isAchieved = masteredCount >= patente.minWords; 
            const isHighlighted = highlightedMilestone === patente.minWords;
            const Icon = ICON_MAP[patente.iconName];
            const isCurrentMode = activeThemeName === patente.name;

            // Pula a semente para focar nos marcos 100, 300, 700, 1500 conforme pedido
            if (patente.level === 1) return null;

            return (
              <motion.div
                key={patente.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: isCurrentMode ? 1.1 : 1,
                  filter: isAchieved ? 'grayscale(0)' : 'grayscale(1)'
                }}
                className={`flex flex-col items-center flex-1 cursor-pointer group z-10 transition-all ${!isAchieved ? 'opacity-40' : 'opacity-100'}`}
                onClick={() => setThemeByName(patente.name)}
              >
                <motion.div 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 z-10 relative`}
                  animate={isHighlighted ? {
                    boxShadow: [
                      '0 0 0px rgba(255, 215, 0, 0)',
                      '0 0 30px rgba(255, 215, 0, 0.8)',
                      '0 0 0px rgba(255, 215, 0, 0)'
                    ],
                    borderColor: ['#334155', '#FFD700', '#334155']
                  } : {}}
                  transition={isHighlighted ? { duration: 1, repeat: 3 } : {}}
                  style={{
                    borderColor: isAchieved ? 'var(--itr-primary)' : '#334155',
                    color: isAchieved ? 'white' : '#64748b',
                    backgroundColor: isAchieved ? 'var(--itr-primary)' : '#0f172a',
                    boxShadow: isAchieved ? '0 0 20px var(--itr-glow)' : 'none'
                  }}
                >
                  <Icon size={24} strokeWidth={isAchieved ? 2.5 : 2} />
                  
                  {isHighlighted && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.5, 0] }}
                      transition={{ duration: 1, repeat: 2 }}
                      className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl"
                    />
                  )}
                </motion.div>

                <div className="text-center mt-6 w-full px-1 flex flex-col items-center">
                  <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-tight mb-1"
                    style={{ color: isAchieved ? 'var(--itr-primary)' : '#94a3b8' }}>
                    {patente.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter opacity-80 whitespace-nowrap">
                    {patente.minWords} Palavras
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
