'use client';

import { useEffect, useState } from 'react';
import { getCards, importEssentialVocabulary } from '@/lib/srs';
import { Flashcard } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  Library, 
  CheckCircle, 
  TrendingUp, 
  Database,
  ArrowBigUpDash
} from 'lucide-react';
import Card from '@/components/Card';

export default function DashboardPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCards(getCards());
    setIsLoaded(true);
  }, []);

  const totalWords = cards.length;
  const learnedWords = cards.filter(c => c.isLearned).length;

  const getLevel = (count: number) => {
    if (count <= 50) return { name: 'Survivor', range: [0, 50] };
    if (count <= 200) return { name: 'Explorer', range: [51, 200] };
    if (count <= 500) return { name: 'Communicator', range: [201, 500] };
    if (count <= 1000) return { name: 'Fluent in Progress', range: [501, 1000] };
    return { name: 'Mastery', range: [1001, 10000] };
  };

  const currentLevel = getLevel(learnedWords);
  const progressPercent = Math.min(100, (learnedWords / currentLevel.range[1]) * 100);

  if (!isLoaded) return null;

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold font-outfit mb-2">Seu Progresso de Fluência</h1>
          <p className="text-slate-400">Acompanhe seu vocabulário e conquistas no Método ITR</p>
        </div>
        
        {totalWords === 0 && (
          <button
            onClick={() => {
              importEssentialVocabulary();
              setCards(getCards());
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all"
          >
            <Database size={20} />
            Importar Vocabulário Essencial
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Dicionário Pessoal', value: totalWords, icon: Library, color: 'text-blue-400' },
          { label: 'Palavras Aprendidas', value: learnedWords, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Nível Atual', value: currentLevel.name, icon: TrendingUp, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={28} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Global</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className={`text-4xl font-bold font-outfit ${stat.label === 'Nível Atual' ? 'text-2xl' : ''}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ArrowBigUpDash className="text-blue-400" />
              Rumo à Maestria
            </h2>
            <p className="text-slate-400 max-w-lg">Você já dominou {learnedWords} de {currentLevel.range[1]} palavras para o próximo nível.</p>
          </div>
          <p className="font-bold text-4xl text-blue-400">{Math.round(progressPercent)}%</p>
        </div>

        <div className="h-6 w-full bg-slate-800 rounded-full p-1 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
          />
        </div>

        <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>{currentLevel.name}</span>
          <span>Próximo: {learnedWords >= 1000 ? 'Mastery' : getLevel(currentLevel.range[1] + 1).name}</span>
        </div>
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-outfit">Palavras Que Você Já Domina</h2>
        {learnedWords === 0 ? (
          <p className="text-slate-500 italic">Continue estudando! Suas palavras aprendidas aparecerão aqui.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cards.filter(c => c.isLearned).map(card => (
              <div 
                key={card.id} 
                className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center group relative overflow-hidden"
              >
                <p className="font-bold text-blue-100 mb-1">{card.front}</p>
                <p className="text-xs text-slate-500 mb-1">{card.back}</p>
                <div className="h-1 w-full bg-emerald-500 opacity-50 absolute bottom-0 left-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
