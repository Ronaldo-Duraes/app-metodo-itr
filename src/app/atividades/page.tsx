'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Zap, BrainCircuit, Trophy } from 'lucide-react';
import ActivitiesRoadmap from '@/components/activities/ActivitiesRoadmap';

export default function ActivitiesPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3 block">Central de Treinamento</span>
        <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white">Expanda seus Limites</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Novos modos de jogo e desafios interativos estão sendo forjados para elevar sua fluência ao próximo nível.</p>
      </motion.div>

      {/* ROADMAP DE CACTOS NOVO */}
      <div className="mb-16">
        <ActivitiesRoadmap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-10">
        {[
          { title: 'Modo Sobrevivência', desc: 'Responda o máximo de cards possíveis com limite de tempo', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/20' },
          { title: 'Quiz de Áudio', desc: 'Treinamento focado em Listening e Compreensão Rápida', icon: BrainCircuit, color: 'text-blue-400', border: 'border-blue-500/20' },
          { title: 'Desafios Semanais', desc: 'Metas globais com recompensas exclusivas', icon: Trophy, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { title: 'Modo História', desc: 'Aprenda expressões com situações do mundo real', icon: Gamepad2, color: 'text-indigo-400', border: 'border-indigo-500/20' },
        ].map((mode, i) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`premium-card p-8 bg-slate-900/50 border ${mode.border} relative overflow-hidden group cursor-not-allowed`}
          >
            {/* Tag Em Breve */}
            <div className="absolute top-6 right-6 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-700">
              Em breve
            </div>
            
            <div className={`w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              <mode.icon size={28} className={mode.color} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-300 font-outfit mb-2">{mode.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{mode.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
