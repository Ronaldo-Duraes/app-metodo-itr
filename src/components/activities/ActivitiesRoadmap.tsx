'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Trophy, ShieldAlert, Star, Activity, Binary, Brain, Rocket } from 'lucide-react';

interface RoadmapModule {
  id: string;
  name: string;
  range: string;
  color: string;
  glow: string;
  icon: any;
}

const MODULES: RoadmapModule[] = [
  // GRUPO ALFA (Verde)
  { id: '1', name: 'GATEWAY', range: '0-100 pts', color: 'text-green-500', glow: 'rgba(34, 197, 94, 0.4)', icon: Zap },
  { id: '2', name: 'ORIGIN', range: '100-200 pts', color: 'text-green-400', glow: 'rgba(74, 222, 128, 0.4)', icon: Activity },
  { id: '3', name: 'UPLINK', range: '200-300 pts', color: 'text-green-500', glow: 'rgba(34, 197, 94, 0.4)', icon: Binary },
  // GRUPO BETA (Ouro)
  { id: '4', name: 'CORE', range: '300-500 pts', color: 'text-yellow-500', glow: 'rgba(234, 179, 8, 0.4)', icon: Brain },
  { id: '5', name: 'OASIS', range: '500-700 pts', color: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.4)', icon: Star },
  { id: '6', name: 'MIRAGE', range: '700-900 pts', color: 'text-yellow-500', glow: 'rgba(234, 179, 8, 0.4)', icon: Trophy },
  // GRUPO GAMA (Vermelho)
  { id: '7', name: 'ZENITH', range: '900-1100 pts', color: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', icon: ShieldAlert },
  { id: '8', name: 'SUPREME', range: '1100-1500 pts', color: 'text-red-600', glow: 'rgba(220, 38, 38, 0.4)', icon: Rocket },
  { id: '9', name: 'LEGACY', range: '1500+ pts', color: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-20 px-4 bg-[#030303] shadow-2xl relative overflow-hidden min-h-[1400px]">
      
      {/* ESPINHA DORSAL ROBUSTA (Cyberpunk Backbone) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-[6px] z-0">
        <div 
          className="w-full h-full animate-[pulse_2s_infinite]"
          style={{ 
            background: 'linear-gradient(to bottom, #22c55e, #eab308, #ef4444)',
            boxShadow: '0 0 25px rgba(255,255,255,0.1), 0 0 40px rgba(34, 197, 94, 0.3)'
          }}
        />
        {/* Flare de Energia que percorre o nervo */}
        <motion.div 
          animate={{ y: ['-100%', '800%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-white/50 to-transparent blur-xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
        <header className="text-center mb-16 px-6">
          <h2 className="text-3xl md:text-5xl font-black font-mono text-white tracking-[0.2em] uppercase">Protocolo Atividades</h2>
        </header>

        {/* Layout Compacto e Denso (gap-8) */}
        <div className="flex flex-col gap-6 w-full">
          {MODULES.map((module, i) => {
            const isLeft = i % 2 !== 0; 
            const Icon = module.icon;
            const groupColor = i < 3 ? '#22c55e' : (i < 6 ? '#eab308' : '#ef4444');

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: isLeft ? -10 : 10 }}
                viewport={{ once: true }}
                className={`flex w-full ${isLeft ? 'justify-start pl-4' : 'justify-end pr-4'} relative z-10`}
              >
                {/* BLOCO RETANGULAR INDUSTRIAL (rounded-none) */}
                <div 
                  className="relative w-40 md:w-52 p-4 rounded-none border-2 bg-black/90 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center group
                    hover:scale-[1.02] transition-all duration-150 cursor-pointer overflow-hidden"
                  style={{ 
                    borderColor: groupColor,
                    boxShadow: `0 0 15px ${module.glow}`
                  }}
                >
                  {/* Scan Line Animada Interna */}
                  <div className="absolute inset-0 w-full h-[1px] bg-white/5 top-0 animate-[scan_3s_linear_infinite] pointer-events-none" />

                  {/* Ícone Integrado (Topo) */}
                  <div className={`w-12 h-12 flex items-center justify-center mb-3 border border-white/10 bg-slate-900/40`}>
                     <Icon size={24} className={module.color} strokeWidth={2} />
                  </div>

                  {/* Detalhes do Nível (Fonte Mono) */}
                  <div className="text-center mb-4">
                    <h3 className="font-black font-mono text-lg text-white mb-0.5 tracking-tighter">
                      [{module.name}]
                    </h3>
                    <div className={`text-[9px] font-mono tracking-widest ${module.color} font-bold opacity-80 uppercase`}>
                      WORD_COUNT: {module.range}
                    </div>
                  </div>

                  {/* Botão Industrial */}
                  <button 
                    className="w-full py-2 rounded-none font-black font-mono text-[10px] tracking-tighter uppercase flex items-center justify-center gap-2 border bg-transparent transition-all
                      text-white hover:bg-white hover:text-black duration-75"
                    style={{ borderColor: groupColor }}
                  >
                     <Play size={10} fill="currentColor" />
                     ACESSAR_MODULO
                  </button>
                </div>

                {/* Linha de União Curta (Conectando ao nervo central) */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 md:w-6 h-[2px] opacity-20"
                  style={{ 
                    background: groupColor,
                    [isLeft ? 'left' : 'right']: '100%' 
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          from { top: -10%; }
          to { top: 110%; }
        }
      `}</style>
    </div>
  );
}
