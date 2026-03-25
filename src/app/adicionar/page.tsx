'use client';

import { useState } from 'react';
import { addCustomCard, playBlipSound, playVictorySound, getCards, PATENTES } from '@/lib/srs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  BookOpen, 
  Languages, 
  Lightbulb, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function AddVocabularyPage() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [association, setAssociation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back) return;

    const cardsBefore = getCards().filter(c => c.isLearned).length;
    addCustomCard(front, back, association);
    const cardsAfter = getCards().filter(c => c.isLearned).length;
    
    const thresholdReached = PATENTES.some((p: any) => p.minWords === cardsAfter && p.minWords > 0);
    
    if (cardsAfter > cardsBefore && thresholdReached) {
       playVictorySound();
    } else {
       playBlipSound();
    }
    
    setFront('');
    setBack('');
    setAssociation('');
    
    // Feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Base de Conhecimento</span>
        <h1 className="text-4xl font-bold font-outfit mb-4">Novo Vocabulário</h1>
        <p className="text-slate-400 text-lg">Alimente seu dicionário pessoal com novas descobertas em inglês.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block font-bold">Termo em Inglês</label>
              <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 focus-within:border-blue-500/50 transition-all">
                <BookOpen size={20} className="text-blue-400" />
                <input 
                  type="text" 
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="Ex: 'Sustainable'"
                  className="bg-transparent border-none focus:outline-none w-full text-lg placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block font-bold">Tradução em Português</label>
              <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 focus-within:border-emerald-500/50 transition-all">
                <Languages size={20} className="text-emerald-400" />
                <input 
                  type="text" 
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  placeholder="Ex: 'Sustentável'"
                  className="bg-transparent border-none focus:outline-none w-full text-lg placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block font-bold">Técnica de Memorização</label>
              <div className="flex items-start gap-4 bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 focus-within:border-amber-500/50 transition-all">
                <Lightbulb size={20} className="text-amber-400 mt-1" />
                <textarea 
                  value={association}
                  onChange={(e) => setAssociation(e.target.value)}
                  placeholder="Sustentável -> Sustentabilidade no mundo atual..."
                  className="bg-transparent border-none focus:outline-none w-full h-28 text-slate-200 resize-none placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-premium w-full py-5 text-lg flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 border-none shadow-blue-500/30"
          >
            <PlusCircle size={22} />
            Salvar e Adicionar à Fila
          </button>
        </motion.form>

        <div className="space-y-8 hidden md:block">
          <div className="premium-card p-8 border-slate-800 bg-slate-900/20">
            <h3 className="text-xl font-bold mb-4 font-outfit">Preview do Card</h3>
            <div className="w-full h-56 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-all" />
              <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">Frente</p>
              <p className="text-3xl font-bold">{front || 'Palavra'}</p>
              <div className="mt-8 flex items-center gap-2 text-slate-500 text-sm italic">
                <span>Clique para ver tradução</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl flex items-center gap-4 text-emerald-400 shadow-xl shadow-emerald-500/5"
              >
                <div className="bg-emerald-500/20 p-2 rounded-full">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">+1 Palavra para a evolução!</p>
                  <p className="text-sm text-emerald-500/70">Sua contagem de Palavras Masterizadas aumentou no sistema.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
