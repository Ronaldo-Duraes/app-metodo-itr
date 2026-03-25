'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, ChevronRight, ChevronLeft, Zap, Trophy, ShieldAlert } from 'lucide-react';

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
  { id: '3', name: 'OASIS', range: '300-700 pts', isUnlocked: false, color: 'text-slate-300', glow: 'rgba(203, 213, 225, 0.4)', icon: ShieldAlert },
  { id: '4', name: 'LEGACY', range: '700-1100 pts', isUnlocked: false, color: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.4)', icon: ShieldAlert },
  { id: '5', name: 'SUPREME', range: '1100+ pts', isUnlocked: false, color: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', icon: ShieldAlert },
];

export default function ActivitiesRoadmap() {
  return (
    <div className="w-full py-16 px-4 bg-[#0a0a0a] rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Linha Pontilhada Neon de Fundo (Snake Path) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ filter: 'blur(1px)' }}>
        <path 
          d="M 250 150 Q 800 300 250 450 Q -300 600 250 750" 
          fill="none" 
          stroke="var(--itr-primary)" 
          strokeWidth="3" 
          strokeDasharray="8 12" 
          className="animate-[dash_60s_linear_infinite]"
        />
      </svg>
      
      <div className="relative z-10 flex flex-col items-center">
        <header className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black font-outfit text-white mb-3">Jornada de Atividades</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px]">Cakto Style • Snake Roadmap</p>
        </header>

        <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-32">
          {MODULES.map((module, i) => {
            const isEven = i % 2 !== 0; // Se par (0, 2, 4...) -> Esquerda. Impar (1, 3...) -> Direita (ZigZag)
            const isActive = module.isUnlocked;
            const Icon = module.icon;

            return (
              <div 
                key={module.id}
                className={`flex w-full ${isEven ? 'justify-end md:pr-20' : 'justify-start md:pl-20'} relative`}
              >
                {/* Linha Conectora Sutil (Mobile) */}
                {i < MODULES.length - 1 && (
                   <div className="absolute top-full left-1/2 -translate-x-1/2 h-32 w-[2px] border-l-2 border-dotted border-slate-800 md:hidden" />
                )}

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center group"
                >
                  {/* CARD DO CACTO 3D (Estilo Cakto) */}
                  <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 border-2 backdrop-blur-xl shadow-2xl overflow-hidden
                    ${isActive ? `bg-slate-900/80 border-slate-700` : 'bg-slate-900/40 border-slate-800 grayscale cursor-not-allowed opacity-50'}
                  `}>
                    {/* Brilho Interno (Glow) */}
                    {isActive && (
                      <div className="absolute inset-0 opacity-20" style={{ backgroundColor: module.glow, filter: 'blur(40px)' }} />
                    )}

                    {/* Ícone Cacto/Módulo (Simulado como Cacto 3D) */}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        animate={isActive ? { y: [0, -10, 0] } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`p-6 rounded-3xl bg-slate-950/80 border border-white/5 relative shadow-inner`}
                        style={{ boxShadow: isActive ? `0 0 40px ${module.glow}` : 'none' }}
                      >
                         <Icon size={48} className={`drop-shadow-2xl ${isActive ? module.color : 'text-slate-600'}`} strokeWidth={1.5} />
                      </motion.div>
                    </div>

                    {/* Overlay Bloqueado */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                         <Lock size={24} className="text-slate-700" />
                      </div>
                    )}
                  </div>

                  {/* Informações do Módulo */}
                  <div className="mt-6 text-center">
                    <h3 className={`font-black font-outfit text-2xl tracking-tighter ${isActive ? 'text-white' : 'text-slate-600'}`}>
                      {module.name}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                      {module.range}
                    </p>

                    {/* Botão Iniciar Atividade */}
                    <button 
                      disabled={!isActive}
                      className={`mt-4 px-8 py-2.5 rounded-xl font-black font-outfit text-[11px] tracking-widest transition-all uppercase flex items-center gap-2 border-2
                        ${isActive 
                          ? `bg-slate-950 border-slate-700 text-white hover:bg-white hover:text-black hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95` 
                          : 'bg-transparent border-slate-800 text-slate-700 cursor-not-allowed'}
                      `}
                    >
                       <Play size={12} fill="currentColor" />
                       Iniciar Atividade
                    </button>
                  </div>
                </motion.div>

                {/* Seta de Direção (ZigZag) - Apenas Desktop */}
                {i < MODULES.length - 1 && (
                  <div className={`absolute top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 text-slate-800 ${isEven ? 'right-[100%] mr-12' : 'left-[100%] ml-12'}`}>
                     {isEven ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
}
