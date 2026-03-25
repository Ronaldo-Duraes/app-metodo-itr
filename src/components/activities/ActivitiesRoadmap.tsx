'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Trophy, ShieldAlert, Star, Activity, Binary, Brain, Rocket } from 'lucide-react';

interface RoadmapModule {
  id: string;
  number: number;
  name: string;
  difficulty: 'INICIANTE' | 'INTERMEDIÁRIO' | 'AVANÇADO';
  color: string;
  glow: string;
  btnBg: string;
  icon: any;
}

const MODULES: RoadmapModule[] = [
  { id: '1', number: 1, name: 'GATEWAY', difficulty: 'INICIANTE', color: 'text-[#22c55e]', glow: 'rgba(34, 197, 94, 0.4)', btnBg: 'bg-[#22c55e]', icon: Zap },
  { id: '2', number: 2, name: 'ORIGIN', difficulty: 'INICIANTE', color: 'text-[#4ade80]', glow: 'rgba(74, 222, 128, 0.4)', btnBg: 'bg-[#4ade80]', icon: Activity },
  { id: '3', number: 3, name: 'UPLINK', difficulty: 'INICIANTE', color: 'text-[#22c55e]', glow: 'rgba(34, 197, 94, 0.4)', btnBg: 'bg-[#22c55e]', icon: Binary },
  { id: '4', number: 4, name: 'CORE', difficulty: 'INTERMEDIÁRIO', color: 'text-[#eab308]', glow: 'rgba(234, 179, 8, 0.4)', btnBg: 'bg-[#eab308]', icon: Brain },
  { id: '5', number: 5, name: 'OASIS', difficulty: 'INTERMEDIÁRIO', color: 'text-[#facc15]', glow: 'rgba(250, 204, 21, 0.4)', btnBg: 'bg-[#facc15]', icon: Star },
  { id: '6', number: 6, name: 'MIRAGE', difficulty: 'INTERMEDIÁRIO', color: 'text-[#eab308]', glow: 'rgba(234, 179, 8, 0.4)', btnBg: 'bg-[#eab308]', icon: Trophy },
  { id: '7', number: 7, name: 'ZENITH', difficulty: 'AVANÇADO', color: 'text-[#ef4444]', glow: 'rgba(239, 68, 68, 0.4)', btnBg: 'bg-[#ef4444]', icon: ShieldAlert },
  { id: '8', number: 8, name: 'SUPREME', difficulty: 'AVANÇADO', color: 'text-[#dc2626]', glow: 'rgba(220, 38, 38, 0.4)', btnBg: 'bg-[#dc2626]', icon: Rocket },
  { id: '9', number: 9, name: 'LEGACY', difficulty: 'AVANÇADO', color: 'text-[#ef4444]', glow: 'rgba(239, 68, 68, 0.4)', btnBg: 'bg-[#ef4444]', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-28 px-4 bg-[#050505] shadow-2xl relative overflow-hidden min-h-[1400px]">
      
      {/* LUZES RADIAIS DE FUNDO */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* ESPINHA DORSAL (Cyberpunk Backbone) com FADE ESTRUTURAL */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-[400px] bottom-40 w-[6px] z-0"
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div 
          className="w-full h-full opacity-40 shrink-0"
          style={{ 
            background: 'linear-gradient(to bottom, #22c55e, #eab308, #ef4444)',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
          }}
        />
        {/* Flare de Energia */}
        <motion.div 
          animate={{ y: ['-100%', '1000%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-white/30 to-transparent blur-xl opacity-20 shrink-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto font-outfit">
        {/* HEADER ESCALONADO */}
        <header className="text-center relative mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-500 mb-4 block opacity-40">
              Protocolo Industrial v2.2
            </span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-sutil
              bg-gradient-to-r from-green-400/80 via-emerald-500/80 to-blue-600/80 drop-shadow-lg">
              Protocolo<br/>Atividades
            </h2>
          </motion.div>
        </header>

        {/* Espaçador de 100px (Reduzido em 20px conforme solicitado) */}
        <div className="h-[100px] w-full" />

        {/* Layout Esguio (Slim Cards) */}
        <div className="flex flex-col gap-10 w-full">
          {MODULES.map((module, i) => {
            const isLeft = i % 2 !== 0; 
            const Icon = module.icon;
            const groupColor = i < 3 ? '#22c55e' : (i < 6 ? '#eab308' : '#ef4444');

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
                whileInView={{ opacity: 1, x: isLeft ? -5 : 5 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`flex w-full ${isLeft ? 'justify-start md:pl-4' : 'justify-end md:pr-4'} relative`}
              >
                {/* BLOCO GLASSMORFICO ESGUIO */}
                <div 
                  className="relative w-40 md:w-52 p-5 rounded-none border-2 bg-white/[0.02] backdrop-blur-2xl shadow-2xl flex flex-col items-center group
                    hover:translate-y-[-2px] transition-all duration-300 overflow-visible"
                  style={{ 
                    borderColor: `${groupColor}CC`,
                    boxShadow: `0 0 25px ${module.glow}`
                  }}
                >
                  {/* BADGE NUMERADO (Levemente externo) */}
                  <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-full bg-black border-2 flex items-center justify-center z-20 shadow-xl pointer-events-none`}
                    style={{ borderColor: groupColor }}>
                    <span className="text-white text-[10px] font-bold">{module.number}</span>
                  </div>

                  {/* Scan Line Interna */}
                  <div className="absolute inset-0 w-full h-[1px] bg-white/[0.03] top-0 animate-[scan_6s_linear_infinite] pointer-events-none" />

                  {/* Ícone Minimalista */}
                  <div className={`w-14 h-14 flex items-center justify-center mb-4 border border-white/5 bg-slate-950/60 shadow-inner`}>
                     <Icon size={28} className={module.color} strokeWidth={2} />
                  </div>

                  {/* Detalhes do Nível */}
                  <div className="text-center mb-6">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1.5 block ${module.color} opacity-70`}>
                      {module.difficulty}
                    </span>
                    <h3 className="font-black text-xl text-white tracking-tighter uppercase leading-none">
                      {module.name}
                    </h3>
                  </div>

                  {/* Botão ALTO CONTRASTE */}
                  <button 
                    className={`w-full py-3 rounded-none font-black text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all
                      text-black ${module.btnBg} hover:opacity-80 active:scale-95`}
                  >
                     <Play size={10} fill="currentColor" />
                     ACESSAR AGORA
                  </button>
                </div>

                {/* Seta Sutil de Direção */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-[1px] opacity-10 hidden md:block"
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
        @keyframes gradient-sutil {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-sutil {
          animation: gradient-sutil 10s ease infinite;
        }
      `}</style>
    </div>
  );
}
