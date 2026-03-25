'use client';

import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  Lock, 
  ChevronRight, 
  Star,
  BookOpen,
  MessageCircle,
  Headphones
} from 'lucide-react';

const modules = [
  { id: 1, title: 'Módulo 1: Primeiros Passos', status: 'completed', duration: '20 min', items: 12, icon: Star },
  { id: 2, title: 'Módulo 2: O Verbo To Be', status: 'available', duration: '45 min', items: 25, icon: BookOpen },
  { id: 3, title: 'Módulo 3: Construindo Sentenças', status: 'locked', duration: '1h', items: 40, icon: MessageCircle },
  { id: 4, title: 'Módulo 4: Treino de Audição', status: 'locked', duration: '30 min', items: 15, icon: Headphones },
];

export default function ActivitiesPage() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3 block">Roteiro de Estudos</span>
        <h1 className="text-4xl font-bold font-outfit mb-4">Trilha de Aprendizagem</h1>
        <p className="text-slate-400 text-lg">Siga o caminho definido pelo Método ITR para atingir a fluência.</p>
      </motion.div>

      <div className="relative space-y-8">
        {/* Progress Line */}
        <div className="absolute left-10 top-0 bottom-0 w-1 bg-slate-800 -z-10 rounded-full" />

        {modules.map((module, i) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex items-center gap-10 p-6 rounded-3xl transition-all border ${
              module.status === 'locked' 
                ? 'bg-slate-900/20 border-slate-800 opacity-60' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer'
            }`}
          >
            {/* Status Icon Indicator */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              module.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              module.status === 'available' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 ring-4 ring-blue-500/10' :
              'bg-slate-800/50 text-slate-500 border border-slate-700/50'
            }`}>
              <module.icon size={36} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                  module.status === 'completed' ? 'text-emerald-400 border-emerald-400/30' :
                  module.status === 'available' ? 'text-blue-400 border-blue-400/30' :
                  'text-slate-500 border-slate-700'
                }`}>
                  {module.status === 'completed' ? 'Concluído' : 
                   module.status === 'available' ? 'Em Progresso' : 'Bloqueado'}
                </span>
                <span className="text-xs text-slate-500">• {module.duration} de conteúdo</span>
              </div>
              <h3 className="text-xl font-bold mb-1 font-outfit">{module.title}</h3>
              <p className="text-sm text-slate-500">{module.items} vocabulários e exercícios práticos</p>
            </div>

            <div className="flex items-center justify-center p-3">
              {module.status === 'locked' ? (
                <Lock size={20} className="text-slate-700" />
              ) : (
                <div className="flex items-center gap-2 text-blue-400 group">
                  <span className="text-xs font-bold uppercase tracking-widest">Acessar</span>
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 text-center"
      >
        <h2 className="text-2xl font-bold mb-3 font-outfit">Sua Trilha é Personalizada</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          À medida que você adiciona palavras manualmente no menu "Adicionar", o conteúdo dos módulos se adapta para priorizar o seu contexto real.
        </p>
      </motion.div>
    </div>
  );
}
