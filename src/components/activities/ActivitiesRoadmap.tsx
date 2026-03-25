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
  // VERDE NEON (1-3)
  { id: '1', name: 'GATEWAY', range: '0-100 pts', color: 'text-green-500', glow: 'rgba(34, 197, 94, 0.4)', icon: Zap },
  { id: '2', name: 'ORIGIN', range: '100-200 pts', color: 'text-green-400', glow: 'rgba(74, 222, 128, 0.4)', icon: Activity },
  { id: '3', name: 'UPLINK', range: '200-300 pts', color: 'text-green-500', glow: 'rgba(34, 197, 94, 0.4)', icon: Binary },
  // DOURADO NEON (4-6)
  { id: '4', name: 'CORE', range: '300-500 pts', color: 'text-yellow-500', glow: 'rgba(234, 179, 8, 0.4)', icon: Brain },
  { id: '5', name: 'OASIS', range: '500-700 pts', color: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.4)', icon: Star },
  { id: '6', name: 'MIRAGE', range: '700-900 pts', color: 'text-yellow-500', glow: 'rgba(234, 179, 8, 0.4)', icon: Trophy },
  // VERMELHO NEON (7-9)
  { id: '7', name: 'ZENITH', range: '900-1100 pts', color: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', icon: ShieldAlert },
  { id: '8', name: 'SUPREME', range: '1100-1500 pts', color: 'text-red-600', glow: 'rgba(220, 38, 38, 0.4)', icon: Rocket },
  { id: '9', name: 'LEGACY', range: '1500+ pts', color: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-20 px-4 bg-[#050505] rounded-[3rem] border border-slate-950 shadow-2xl relative overflow-hidden min-h-[1500px]">
      
      {/* LINHA NEON VERTICAL (Nervo Central) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-[2px] z-0 opacity-40">
        <div 
          className="w-full h-full"
          style={{ 
            background: 'linear-gradient(to bottom, #22c55e, #eab308, #ef4444)',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.5), 0 0 30px rgba(234, 179, 8, 0.5), 0 0 45px rgba(239, 68, 68, 0.5)'
          }}
        />
        {/* Flare Animado que desce pela linha */}
        <motion.div 
          animate={{ y: ['-100%', '1000%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent blur-md shrink-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        <header className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tighter">Jornada de Atividades</h2>
        </header>

        <div className="flex flex-col gap-16 w-full">
          {MODULES.map((module, i) => {
            const isLeft = i % 2 !== 0; // Alternar levemente: Centro-Esquerda / Centro-Direita
            const Icon = module.icon;
            const groupColor = i < 3 ? '#22c55e' : (i < 6 ? '#eab308' : '#ef4444');

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: isLeft ? -20 : 20 }}
                viewport={{ once: true }}
                className={`flex w-full ${isLeft ? 'justify-start md:pl-8' : 'justify-end md:pr-8'} relative`}
              >
                {/* CARD UNIFICADO (Game Interface Style) */}
                <div 
                  className="relative w-40 md:w-44 px-4 py-6 rounded-[2rem] border backdrop-blur-3xl bg-slate-950/60 shadow-2xl flex flex-col items-center group
                    hover:scale-105 transition-all duration-300"
                  style={{ 
                    borderColor: `${groupColor}80`,
                    boxShadow: `0 0 30px ${module.glow}, inset 0 0 10px rgba(255,255,255,0.02)`
                  }}
                >
                  {/* Ícone Integrado (Topo) */}
                  <div className={`w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-white/5`}>
                     <Icon size={28} className={module.color} strokeWidth={2} />
                  </div>

                  {/* Info Módulo (Meio) */}
                  <div className="text-center mb-6">
                    <h3 className="font-black font-outfit text-lg tracking-tight text-white mb-1">
                      {module.name}
                    </h3>
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                      {module.range}
                    </div>
                  </div>

                  {/* Botão ACESSAR (Base) */}
                  <button 
                    className="w-full py-2 rounded-xl font-black font-outfit text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 border bg-transparent transition-all
                      text-white hover:bg-white hover:text-black group-hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95 duration-200"
                    style={{ borderColor: groupColor }}
                  >
                     <Play size={10} fill="currentColor" />
                     Acessar
                  </button>
                </div>

                {/* Linha Lateral de Conexão com o Nervo Central */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-8 h-[2px] opacity-30 hidden md:block
                    ${isLeft ? 'left-full ml-1' : 'right-full mr-1'}
                  `}
                  style={{ background: groupColor }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
