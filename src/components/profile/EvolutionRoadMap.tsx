'use client';

import { motion } from 'framer-motion';
import { PATENTES, getUserPatente } from '@/lib/srs';
import { Sprout, Leaf, Activity, Shrub, Trees, Lock } from 'lucide-react';

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

  return (
    <div className="w-full pb-4">
      <div className="flex justify-between items-center mb-8 px-2 md:px-6">
        <h3 className="text-lg md:text-xl font-bold text-white font-outfit flex items-center gap-2">
          Sua Jornada de Patentes
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-md border border-indigo-500/20">
          Experience Bar
        </span>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-2 md:px-8 h-32">
        {/* Linha Fundo */}
        <div className="absolute left-[10%] right-[10%] top-6 h-1 w-[80%] bg-slate-800 -z-10 rounded-full" />
        
        {/* Progresso Dinâmico */}
        <div className="absolute left-[10%] top-6 h-1 w-[80%] flex -z-10">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full transition-all duration-1000" 
            style={{ width: `${((patenteInfo.current.level - 1) / (PATENTES.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex flex-row justify-between items-start relative w-full h-full">
          {PATENTES.map((patente, i) => {
            const isCurrent = patenteInfo.current.level === patente.level;
            const isAchieved = patenteInfo.current.level > patente.level;
            const isLocked = patenteInfo.current.level < patente.level;
            const Icon = ICON_MAP[patente.iconName];

            return (
              <motion.div
                key={patente.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center flex-1"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 relative bg-slate-900 border-2
                  ${isAchieved ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/5' : 
                    isCurrent ? 'border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110 bg-blue-500/10' : 
                    'border-slate-700 text-slate-500 grayscale opacity-80'}`}
                >
                  <Icon size={isCurrent ? 24 : 20} className={isCurrent ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : ''} />
                  {isLocked && <Lock size={12} className="absolute -bottom-2 -right-1 md:-right-2 text-slate-500 bg-slate-900 border border-slate-700 rounded-full p-[2px]" />}
                </div>

                <div className="text-center mt-3 md:mt-4">
                  <h4 className={`text-[9px] md:text-xs font-bold uppercase tracking-wider leading-tight mb-1
                    ${isCurrent ? 'text-blue-400' : isAchieved ? 'text-slate-300' : 'text-slate-600'}`}>
                    {patente.name}
                  </h4>
                  <span className="text-[8px] md:text-[10px] text-slate-500 font-medium">
                    {patente.minWords}{patente.maxWords ? ` - ${patente.maxWords}` : '+'}
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
