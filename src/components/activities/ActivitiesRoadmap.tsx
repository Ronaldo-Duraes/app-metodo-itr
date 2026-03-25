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
  // INICIANTE (1-3)
  { id: '1', number: 1, name: 'GATEWAY', difficulty: 'INICIANTE', color: 'text-[#22c55e]', glow: 'rgba(34, 197, 94, 0.4)', btnBg: 'bg-[#22c55e]', icon: Zap },
  { id: '2', number: 2, name: 'ORIGIN', difficulty: 'INICIANTE', color: 'text-[#4ade80]', glow: 'rgba(74, 222, 128, 0.4)', btnBg: 'bg-[#4ade80]', icon: Activity },
  { id: '3', number: 3, name: 'UPLINK', difficulty: 'INICIANTE', color: 'text-[#22c55e]', glow: 'rgba(34, 197, 94, 0.4)', btnBg: 'bg-[#22c55e]', icon: Binary },
  // INTERMEDIÁRIO (4-6)
  { id: '4', number: 4, name: 'CORE', difficulty: 'INTERMEDIÁRIO', color: 'text-[#eab308]', glow: 'rgba(234, 179, 8, 0.4)', btnBg: 'bg-[#eab308]', icon: Brain },
  { id: '5', number: 5, name: 'OASIS', difficulty: 'INTERMEDIÁRIO', color: 'text-[#facc15]', glow: 'rgba(250, 204, 21, 0.4)', btnBg: 'bg-[#facc15]', icon: Star },
  { id: '6', number: 6, name: 'MIRAGE', difficulty: 'INTERMEDIÁRIO', color: 'text-[#eab308]', glow: 'rgba(234, 179, 8, 0.4)', btnBg: 'bg-[#eab308]', icon: Trophy },
  // AVANÇADO (7-9)
  { id: '7', number: 7, name: 'ZENITH', difficulty: 'AVANÇADO', color: 'text-[#ef4444]', glow: 'rgba(239, 68, 68, 0.4)', btnBg: 'bg-[#ef4444]', icon: ShieldAlert },
  { id: '8', number: 8, name: 'SUPREME', difficulty: 'AVANÇADO', color: 'text-[#dc2626]', glow: 'rgba(220, 38, 38, 0.4)', btnBg: 'bg-[#dc2626]', icon: Rocket },
  { id: '9', number: 9, name: 'LEGACY', difficulty: 'AVANÇADO', color: 'text-[#ef4444]', glow: 'rgba(239, 68, 68, 0.4)', btnBg: 'bg-[#ef4444]', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-28 px-4 bg-[#050505] shadow-2xl relative overflow-hidden min-h-[1400px]">
      
      {/* BRILHOS RADIAIS PARA PROFUNDIDADE INFINITA */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] left-1/3 w-[800px] h-[800px] bg-purple-500/5 blur-[180px] rounded-full pointer-events-none z-0" />

      {/* ESPINHA DORSAL ROBUSTA (Cyberpunk Backbone) com 60px de Respiro */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[320px] bottom-40 w-[6px] z-0">
        <div 
          className="w-full h-full opacity-60"
          style={{ 
            background: 'linear-gradient(to bottom, #22c55e, #eab308, #ef4444)',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(234, 179, 8, 0.2)'
          }}
        />
        {/* Flare de Energia que percorre o nervo */}
        <motion.div 
          animate={{ y: ['-100%', '800%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-white/40 to-transparent blur-xl opacity-30 shrink-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        {/* HEADER DE IMPACTO COM GRADIENTE ANIMADO */}
        <header className="text-center mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-400 mb-6 block opacity-60">
              Protocolo Industrial v2.0
            </span>
            <h2 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase leading-[0.9] !bg-clip-text text-transparent !bg-[length:200%_auto] animate-gradient-x
              bg-gradient-to-r from-green-400 via-emerald-500 to-blue-600 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              Protocolo<br/>Atividades
            </h2>
          </motion.div>
          {/* Brilho suave atrás do título */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] -z-10 rounded-full" />
        </header>

        {/* Layout Compacto (ZigZag Sutil) */}
        <div className="flex flex-col gap-10 w-full">
          {MODULES.map((module, i) => {
            const isLeft = i % 2 !== 0; 
            const Icon = module.icon;
            const groupColor = i < 3 ? '#22c55e' : (i < 6 ? '#eab308' : '#ef4444');

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: isLeft ? -15 : 15 }}
                whileInView={{ opacity: 1, x: isLeft ? -10 : 10 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex w-full ${isLeft ? 'justify-start md:pl-0' : 'justify-end md:pr-0'} relative`}
              >
                {/* BLOCO GLASSMORFICO RETANGULAR */}
                <div 
                  className="relative w-44 md:w-64 p-6 rounded-none border-2 bg-white/[0.03] backdrop-blur-xl shadow-2xl flex flex-col items-center group
                    hover:translate-y-[-4px] transition-all duration-300 overflow-visible"
                  style={{ 
                    borderColor: `${groupColor}EE`, // Máximo contraste
                    boxShadow: `0 0 35px ${module.glow}`
                  }}
                >
                  {/* BADGE NUMERADO DE ELITE */}
                  <div className={`absolute -top-3 -left-3 w-9 h-9 rounded-full bg-black border-2 flex items-center justify-center z-20 shadow-2xl`}
                    style={{ borderColor: groupColor }}>
                    <span className="text-white text-xs font-black">{module.number}</span>
                  </div>

                  {/* Scan Line Interna (Estilo Radar) */}
                  <div className="absolute inset-0 w-full h-[1px] bg-white/[0.05] top-0 animate-[scan_6s_linear_infinite] pointer-events-none" />

                  {/* Ícone Minimalista */}
                  <div className={`w-16 h-16 flex items-center justify-center mb-5 border-2 border-white/5 bg-slate-950 shadow-inner group-hover:scale-110 transition-transform`}>
                     <Icon size={32} className={module.color} strokeWidth={2} />
                  </div>

                  {/* Detalhes do Nível */}
                  <div className="text-center mb-8">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 block ${module.color} opacity-90`}>
                      {module.difficulty}
                    </span>
                    <h3 className="font-black font-outfit text-2xl text-white tracking-tighter uppercase leading-none">
                      {module.name}
                    </h3>
                  </div>

                  {/* Botão ALTO CONTRASTE (Sólido) */}
                  <button 
                    className={`w-full py-4 rounded-none font-black font-outfit text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all
                      text-black ${module.btnBg} hover:opacity-90 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
                  >
                     <Play size={12} fill="currentColor" />
                     ACESSAR AGORA
                  </button>
                </div>

                {/* Linha de União Sutil (Desktop) */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-[2px] opacity-20 hidden md:block"
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
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
