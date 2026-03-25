'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Zap, Trophy, ShieldAlert, Star } from 'lucide-react';

interface RoadmapModule {
  id: string;
  name: string;
  range: string;
  isUnlocked: boolean;
  color: string;
  glow: string;
  icon: any;
}

const MODULES: RoadmapModule[] = [
  { id: '1', name: 'INÍCIO', range: '0-100 pts', isUnlocked: true, color: 'text-amber-500', glow: 'rgba(245, 158, 11, 0.4)', icon: Zap },
  { id: '2', name: 'MIRAGE', range: '100-300 pts', isUnlocked: false, color: 'text-emerald-500', glow: 'rgba(16, 185, 129, 0.4)', icon: Trophy },
  { id: '3', name: 'OASIS', range: '300-700 pts', isUnlocked: false, color: 'text-slate-300', glow: 'rgba(203, 213, 225, 0.4)', icon: Star },
  { id: '4', name: 'LEGACY', range: '700-1100 pts', isUnlocked: false, color: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.4)', icon: ShieldAlert },
  { id: '5', name: 'SUPREME', range: '1100+ pts', isUnlocked: false, color: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-16 px-4 bg-[#050505] rounded-[3rem] border border-slate-900 shadow-2xl relative overflow-hidden min-h-[1000px]">
      
      {/* CAMINHO DO TESOURO (Snake Path SVG) - Posicionado para conectar os centros */}
      <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block" style={{ top: '240px' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M 280 0 Q 700 120 280 240 Q -140 360 280 480 Q 700 600 280 720 Q -140 840 280 960" 
            stroke="var(--itr-primary)" 
            strokeWidth="3" 
            strokeDasharray="10 15"
            initial={{ strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* MOBILE PATH (Simplificado) */}
      <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-[240px] bottom-12 w-[1px] border-l-2 border-dotted border-slate-800 opacity-30 z-0" />
      
      <div className="relative z-10 flex flex-col items-center">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black font-outfit text-white">Jornada de Atividades</h2>
        </header>

        {/* Layout Snake Compactado (gap-24 vertical / pl-24 Horizontal) */}
        <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-24 md:gap-28">
          {MODULES.map((module, i) => {
            const isEven = i % 2 !== 0; 
            const isActive = module.isUnlocked;
            const Icon = module.icon;

            return (
              <div 
                key={module.id}
                className={`flex w-full ${isEven ? 'justify-end md:pr-12' : 'justify-start md:pl-12'} relative`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center group z-10"
                >
                  {/* CARD CACTO 3D COMPACTO (w-32) */}
                  <div className={`relative w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all duration-500 border backdrop-blur-md shadow-2xl overflow-hidden
                    ${isActive ? `bg-slate-900/60 border-slate-700` : 'bg-slate-950/20 border-slate-900 grayscale cursor-not-allowed opacity-20'}
                  `}>
                    {/* Glow Especial de Ativação */}
                    {isActive && (
                      <div className="absolute inset-0 opacity-10 blur-2xl" style={{ backgroundColor: module.glow }} />
                    )}

                    {/* Ícone Minimalista */}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        animate={isActive ? { y: [0, -5, 0] } : {}}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`p-5 rounded-2xl bg-slate-950/40 border border-white/5 shadow-inner`}
                        style={{ boxShadow: isActive ? `0 0 25px ${module.glow}` : 'none' }}
                      >
                         <Icon size={32} className={`drop-shadow-xl ${isActive ? module.color : 'text-slate-800'}`} strokeWidth={2} />
                      </motion.div>
                    </div>

                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                         <Lock size={18} className="text-slate-800" />
                      </div>
                    )}
                  </div>

                  {/* Detalhes do Nível */}
                  <div className="mt-4 text-center">
                    <h3 className={`font-black font-outfit text-lg tracking-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                      {module.name}
                    </h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-700 mt-0.5">
                      {module.range}
                    </p>

                    {/* Botão de Ação Reduzido */}
                    <button 
                      disabled={!isActive}
                      className={`mt-4 px-6 py-1.5 rounded-lg font-black font-outfit text-[9px] tracking-widest transition-all uppercase flex items-center gap-2 border
                        ${isActive 
                          ? `bg-slate-950 border-slate-800 text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95` 
                          : 'bg-transparent border-slate-900 text-slate-800 cursor-not-allowed'}
                      `}
                    >
                       <Play size={8} fill="currentColor" />
                       Iniciar
                    </button>
                  </div>
                </motion.div>

                {/* Linha Conectora Mobile (Fallback se o SVG falhar/estiver offline) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full h-24 w-[1px] border-l border-dotted border-slate-900 md:hidden opacity-10" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
