'use client';

import { motion } from 'framer-motion';
import ActivitiesRoadmap from '@/components/roadmap/ActivitiesRoadmap';

export default function ActivitiesPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-40">
      {/* Header Estilizado - Foco na Evolução */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center md:text-left"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 mb-4 block">
          Central de Treinamento
        </span>
        <h1 className="text-5xl md:text-7xl font-black font-outfit mb-6 text-white tracking-tighter">
          Expanda seus Limites
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl font-bold leading-relaxed">
          Domine a gramática através de uma jornada visual imersiva. Cada módulo desbloqueia 
          novos desafios e eleva sua fluência ao próximo nível.
        </p>
      </motion.div>

      {/* ROADMAP DE ATIVIDADES CAKTO - ESTRELA DA PÁGINA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ActivitiesRoadmap />
      </motion.div>

      {/* Footer / Nota Sutil no Final da Jornada */}
      <div className="mt-24 text-center">
        <p className="text-slate-700 font-black text-xs uppercase tracking-widest opacity-40">
          Mais módulos em desenvolvimento • Continue progredindo
        </p>
      </div>
    </div>
  );
}
