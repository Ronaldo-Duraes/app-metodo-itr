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
  // INICIANTE (1-3) - Verde
  { id: '1', number: 1, name: 'GATEWAY', difficulty: 'INICIANTE', color: 'text-[#22c55e]', glow: 'rgba(34, 197, 94, 0.4)', btnBg: 'bg-[#22c55e]', icon: Zap },
  { id: '2', number: 2, name: 'ORIGIN', difficulty: 'INICIANTE', color: 'text-[#4ade80]', glow: 'rgba(74, 222, 128, 0.4)', btnBg: 'bg-[#4ade80]', icon: Activity },
  { id: '3', number: 3, name: 'UPLINK', difficulty: 'INICIANTE', color: 'text-[#22c55e]', glow: 'rgba(34, 197, 94, 0.4)', btnBg: 'bg-[#22c55e]', icon: Binary },
  // INTERMEDIÁRIO (4-6) - Ouro
  { id: '4', number: 4, name: 'CORE', difficulty: 'INTERMEDIÁRIO', color: 'text-[#eab308]', glow: 'rgba(234, 179, 8, 0.4)', btnBg: 'bg-[#eab308]', icon: Brain },
  { id: '5', number: 5, name: 'OASIS', difficulty: 'INTERMEDIÁRIO', color: 'text-[#facc15]', glow: 'rgba(250, 204, 21, 0.4)', btnBg: 'bg-[#facc15]', icon: Star },
  { id: '6', number: 6, name: 'MIRAGE', difficulty: 'INTERMEDIÁRIO', color: 'text-[#eab308]', glow: 'rgba(234, 179, 8, 0.4)', btnBg: 'bg-[#eab308]', icon: Trophy },
  // AVANÇADO (7-9) - Vermelho
  { id: '7', number: 7, name: 'ZENITH', difficulty: 'AVANÇADO', color: 'text-[#ef4444]', glow: 'rgba(239, 68, 68, 0.4)', btnBg: 'bg-[#ef4444]', icon: ShieldAlert },
  { id: '8', number: 8, name: 'SUPREME', difficulty: 'AVANÇADO', color: 'text-[#dc2626]', glow: 'rgba(220, 38, 38, 0.4)', btnBg: 'bg-[#dc2626]', icon: Rocket },
  { id: '9', number: 9, name: 'LEGACY', difficulty: 'AVANÇADO', color: 'text-[#ef4444]', glow: 'rgba(239, 68, 68, 0.4)', btnBg: 'bg-[#ef4444]', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-24 px-4 bg-[#0A0A0B] shadow-2xl relative overflow-hidden min-h-[1400px]">
      
      {/* GRADIENTE RADIAL DE FUNDO PARA PROFUNDIDADE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* ESPINHA DORSAL ROBUSTA (Cyberpunk Backbone) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-52 bottom-40 w-[6px] z-0">
        <div 
          className="w-full h-full"
          style={{ 
            background: 'linear-gradient(to bottom, #22c55e, #eab308, #ef4444)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.2), 0 0 80px rgba(0,0,0,0.5)'
          }}
        />
        {/* Flare de Energia que percorre o nervo */}
        <motion.div 
          animate={{ y: ['-100%', '800%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-60 bg-gradient-to-b from-transparent via-white/50 to-transparent blur-2xl opacity-40 shrink-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        <header className="text-center mb-28">
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 mb-4 block">Central de Evolução</span>
          <h2 className="text-4xl md:text-6xl font-black font-outfit text-white tracking-tighter uppercase">
            Protocolo Atividades
          </h2>
        </header>

        {/* Layout Compacto (ZigZag Sutil) */}
        <div className="flex flex-col gap-8 w-full">
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
                  className="relative w-44 md:w-60 p-5 rounded-none border-2 bg-white/[0.03] backdrop-blur-xl shadow-2xl flex flex-col items-center group
                    hover:translate-y-[-4px] transition-all duration-300 overflow-visible"
                  style={{ 
                    borderColor: `${groupColor}CC`, // Mais contraste (opacity 0.8)
                    boxShadow: `0 0 30px ${module.glow}`
                  }}
                >
                  {/* BALÃO FLUTUANTE NUMERADO (Badge) */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black border-2 flex items-center justify-center z-20 shadow-lg`}
                    style={{ borderColor: groupColor }}>
                    <span className="text-white text-[10px] font-black">{module.number}</span>
                  </div>

                  {/* Scan Line Interna */}
                  <div className="absolute inset-0 w-full h-[1px] bg-white/[0.05] top-0 animate-[scan_5s_linear_infinite] pointer-events-none" />

                  {/* Ícone Minimalista */}
                  <div className={`w-14 h-14 flex items-center justify-center mb-4 border-2 border-white/5 bg-slate-950 shadow-inner group-hover:scale-110 transition-transform`}>
                     <Icon size={28} className={module.color} strokeWidth={2} />
                  </div>

                  {/* Detalhes do Nível */}
                  <div className="text-center mb-6">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 block opacity-80 ${module.color}`}>
                      {module.difficulty}
                    </span>
                    <h3 className="font-black font-outfit text-xl text-white tracking-tighter uppercase">
                      {module.name}
                    </h3>
                  </div>

                  {/* Botão ALTO CONTRASTE (Sólido) */}
                  <button 
                    className={`w-full py-3 rounded-none font-black font-outfit text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all
                      text-black ${module.btnBg} hover:opacity-90 active:scale-95 shadow-xl`}
                  >
                     <Play size={10} fill="currentColor" />
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
      `}</style>
    </div>
  );
}
