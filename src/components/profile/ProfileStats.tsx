'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Zap, Award } from 'lucide-react';

interface ProfileStatsProps {
  masteredCount: number;
}

export default function ProfileStats({ masteredCount }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {[
        { label: 'Palavras Masterizadas', value: masteredCount, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
        { label: 'Dias de Ofensiva', value: '4', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10' },
        { label: 'Conquistas ITR', value: '8', icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-500/5', border: 'border-indigo-500/10' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className={`premium-card p-6 flex flex-col items-center text-center gap-4 ${stat.bg} border ${stat.border} hover:bg-slate-800/80 transition-all shadow-lg`}
        >
          <div className={`p-4 rounded-3xl ${stat.bg.replace('/5', '/20')} inline-flex shadow-inner`}>
            <stat.icon className={stat.color} size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold font-outfit text-white mb-1">{stat.value}</p>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider text-[10px]">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
