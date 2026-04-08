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
  const [isMobile, setIsMobile] = React.useState(true);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className={`w-full py-16 md:py-28 px-4 relative overflow-hidden min-h-[1400px] font-outfit ${isMobile ? 'opacity-100' : ''}`}
         style={{ 
           maskImage: isMobile ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 150px, black calc(100% - 150px), transparent 100%)',
           WebkitMaskImage: isMobile ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 150px, black calc(100% - 150px), transparent 100%)'
         }}>
      
      {/* GLOBAL ATMOSPHERIC GLOW (FEATHERED) - HIDDEN ON MOBILE */}
      {!isMobile && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent pointer-events-none -z-20" />
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
          <div className="absolute top-[40%] left-[20%] w-[600px] h-[600px] bg-yellow-500/5 blur-[180px] rounded-full pointer-events-none z-0" />
          <div className="absolute top-[70%] right-[10%] w-[700px] h-[700px] bg-red-500/5 blur-[200px] rounded-full pointer-events-none z-0" />
        </>
      )}

      {/* ROBUST NEON BACKBONE */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-[150px] bottom-40 md:w-[6px] w-[2px] z-0"
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div 
          className="w-full h-full opacity-40 shrink-0"
          style={{ 
            background: 'linear-gradient(to bottom, #22c55e, #eab308, #ef4444)',
            boxShadow: isMobile ? 'none' : '0 0 20px rgba(34, 197, 94, 0.2)'
          }}
        />
        {/* Animated Flare - HIDDEN ON MOBILE */}
        {!isMobile && (
          <motion.div 
            animate={{ y: ['-100%', '1000%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-white/40 to-transparent blur-xl opacity-20 shrink-0"
          />
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        {/* IMPACT HEADER */}
        <header className="text-center mb-16 md:mb-28">
          <motion.div 
            initial={isMobile ? false : { opacity: 0, y: -20 }}
            whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-500 mb-6 block md:opacity-40">
              Protocolo Industrial
            </span>
            <div className="relative inline-block">
              {/* Localized Header Glow - HIDDEN ON MOBILE */}
              {!isMobile && <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full -z-10 animate-pulse" />}
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-emerald-500 md:bg-clip-text md:text-transparent md:bg-[length:200%_auto] md:animate-gradient-x
                md:bg-gradient-to-r md:from-green-400 md:via-emerald-500 md:to-blue-600 md:drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                Protocolo<br/>Atividades
              </h1>
            </div>
          </motion.div>
        </header>

        {/* COMPACT VERTICAL TIMELINE */}
        <div className="flex flex-col gap-8 md:gap-10 w-full">
          {MODULES.map((module, i) => {
            const isLeft = i % 2 !== 0; 
            const Icon = module.icon;
            const groupColor = i < 3 ? '#22c55e' : (i < 6 ? '#eab308' : '#ef4444');
            const groupGlow = i < 3 ? 'rgba(34, 197, 94, 0.1)' : (i < 6 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)');

            return (
              <motion.div
                key={module.id}
                initial={isMobile ? false : { opacity: 0, x: isLeft ? -15 : 15 }}
                whileInView={isMobile ? {} : { opacity: 1, x: isLeft ? -10 : 10 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex w-full ${isLeft ? 'justify-start md:pl-0' : 'justify-end md:pr-0'} relative py-2 md:py-4 justify-center md:justify-end mx-auto`}
              >
                {/* Ambient Module Glow - HIDDEN ON MOBILE */}
                {!isMobile && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] blur-[100px] rounded-full pointer-events-none -z-10 opacity-30" 
                       style={{ background: groupGlow }} />
                )}
                
                {/* SLENDER CARDS - SOLID ON MOBILE, GLASSMORPHIC ON DESKTOP */}
                <div 
                  className="relative w-48 md:w-56 p-6 rounded-none border-2 bg-[#121212] md:bg-white/[0.03] md:backdrop-blur-xl shadow-none md:shadow-2xl flex flex-col items-center group
                    md:hover:translate-y-[-4px] transition-all duration-300 overflow-visible"
                  style={{ 
                    borderColor: `${groupColor}EE`,
                    boxShadow: isMobile ? 'none' : `0 0 35px ${module.glow}`
                  }}
                >
                  {/* ELITE NUMBERED BADGE */}
                  <div className={`absolute -top-4 -left-4 w-9 h-9 rounded-full bg-black border-2 flex items-center justify-center z-20 shadow-none md:shadow-2xl`}
                    style={{ borderColor: groupColor }}>
                    <span className="text-white text-xs font-black">{module.number}</span>
                  </div>

                  {/* Internal Scan Line - HIDDEN ON MOBILE */}
                  {!isMobile && <div className="absolute inset-0 w-full h-[1px] bg-white/[0.05] top-0 animate-[scan_6s_linear_infinite] pointer-events-none" />}

                  {/* Minimalist Icon */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4 border border-white/5 bg-slate-950/80 shadow-none md:shadow-inner md:group-hover:scale-110 transition-transform`}>
                     <Icon size={24} className={`md:w-[28px] md:h-[28px] ${module.color}`} strokeWidth={2} />
                  </div>

                  {/* Level Details */}
                  <div className="text-center mb-6 md:mb-8">
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 block ${module.color} opacity-90`}>
                      {module.difficulty}
                    </span>
                    <h3 className="font-black text-xl md:text-2xl text-white tracking-tighter uppercase leading-none">
                      {module.name}
                    </h3>
                  </div>

                  {/* HIGH-CONTRAST SOLID BUTTON */}
                  <button 
                    className={`w-full py-4 rounded-none font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all
                      text-black ${module.btnBg} hover:opacity-90 active:scale-95 shadow-none md:shadow-xl`}
                  >
                     <Play size={12} fill="currentColor" />
                     ACESSAR AGORA
                  </button>
                </div>

                {/* Settle Connecting Line (Desktop Only) */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] opacity-20 hidden md:block"
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
