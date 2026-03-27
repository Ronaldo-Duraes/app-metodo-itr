'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Trophy, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Estrutura de Dados
const GRAMMAR_DATA = {
  Iniciante: [
    'Verb To Be', 'Personal Pronouns', 'Articles (a/an/the)', 'Plural Nouns',
    'Present Simple', 'Possessive Adjectives', 'Prepositions of Time', 'Question Words'
  ],
  Intermediário: [
    'Present Continuous', 'Past Simple', 'Comparative/Superlative', 'Modal Verbs',
    'Present Perfect', 'Adverbs of Frequency', 'Future (Will/Going to)', 'Countable/Uncountable'
  ],
  Avançado: [
    'Past Perfect', 'Passive Voice', 'Conditionals (Zero, 1, 2, 3)', 'Relative Clauses',
    'Reported Speech', 'Phrasal Verbs', 'Gerunds/Infinitives', 'Past Modals'
  ]
};

const STORAGE_KEY = 'itr_grammar_checklist';

export default function GrammarChecklistPage() {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar do localStorage com Blindagem SSR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCompletedItems(JSON.parse(stored));
        } catch (e) {
          console.error("Erro ao carregar checklist", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Salvar no localStorage com Blindagem SSR
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedItems));
    }
  }, [completedItems, isLoaded]);

  const toggleItem = (item: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const totalItems = Object.values(GRAMMAR_DATA).flat().length;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / totalItems) * 100);

  // Evita Hydration Mismatch
  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent font-outfit text-white pb-32">
      {/* BACKGROUND GRADIENT HOMOGÊNEO */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#061a12] to-black -z-10" />
      
      {/* Efeito de Brilho de Fundo */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/app" className="group flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Arsenal</span>
          </Link>
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2">
             <Target size={16} className="text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Mapeamento de Elite</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic leading-[0.9]">
            Mapa da Mina:<br />
            <span className="text-emerald-500">Gramática ITR</span>
          </h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em] mb-16">
            Estrutura Completa • {completedCount}/{totalItems} Tópicos Dominados
          </p>
        </motion.div>

        {/* BARRA DE PROGRESSO GLOBAL ESTÁTICA (RELATIVA) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mb-20 p-8 bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Maestria Gramatical</span>
              <span className="text-5xl font-black tracking-tighter tabular-nums">{progressPercentage}%</span>
            </div>
            {progressPercentage === 100 ? (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              >
                <Trophy size={16} /> Mestre Absoluto
              </motion.div>
            ) : (
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Status Ativo</span>
                <span className="text-[11px] font-bold text-zinc-400 uppercase italic">Sincronização Vitalícia...</span>
              </div>
            )}
          </div>
          <div className="w-full h-3 bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:50px_50px] animate-[shimmer_2s_linear_infinite]" />
            </motion.div>
          </div>
        </motion.div>

        {/* SEÇÕES POR NÍVEL */}
        <div className="space-y-24">
          {(Object.entries(GRAMMAR_DATA) as [keyof typeof GRAMMAR_DATA, string[]][]).map(([level, items], idx) => {
            const colors = {
              Iniciante: { text: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', dot: 'bg-emerald-500', hoverBorder: 'hover:border-emerald-500/50' },
              Intermediário: { text: 'text-yellow-500', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', dot: 'bg-yellow-500', hoverBorder: 'hover:border-yellow-500/50' },
              Avançado: { text: 'text-rose-500', border: 'border-rose-500/30', bg: 'bg-rose-500/5', dot: 'bg-rose-500', hoverBorder: 'hover:border-rose-500/50' }
            }[level];

            return (
              <motion.section 
                key={level} 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className={`w-4 h-4 rounded-none ${colors.dot} shadow-[0_0_20px_currentColor] rotate-45`} />
                  <h2 className={`text-3xl font-black uppercase tracking-tighter ${colors.text}`}>
                    {level}
                  </h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleItem(item)}
                      className={`group relative flex items-center p-6 border-2 transition-all duration-500 text-left ${
                        completedItems[item] 
                        ? `${colors.bg} ${colors.border} opacity-80 scale-[0.98]` 
                        : `bg-white/[0.02] border-white/5 ${colors.hoverBorder} hover:bg-white/[0.04] scale-100`
                      }`}
                    >
                      {/* Checkbox Customizado */}
                      <div className={`w-7 h-7 border-2 flex items-center justify-center transition-all duration-500 mr-5 shrink-0 ${
                        completedItems[item] 
                        ? `bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]` 
                        : 'border-white/10 group-hover:border-white/30'
                      }`}>
                        {completedItems[item] && (
                          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>
                            <Check size={18} className="text-black stroke-[4]" />
                          </motion.div>
                        )}
                      </div>

                      {/* Texto do Tópico */}
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                          completedItems[item] ? 'text-zinc-600 line-through decoration-emerald-500/50 decoration-2' : 'text-zinc-300 group-hover:text-white'
                        }`}>
                          {item}
                        </span>
                        {completedItems[item] && (
                          <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-[0.2em] mt-1">Concluído</span>
                        )}
                      </div>
                      
                      {/* Efeito de Scanline ao marcar */}
                      {completedItems[item] && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* MENSAGEM FINAL */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-16 border-2 border-white/5 bg-white/[0.01] flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_15px_emerald-500]" />
          <BookOpen size={48} className="text-zinc-800 mb-8" />
          <h3 className="text-2xl font-black text-zinc-500 uppercase tracking-tighter mb-4">Arquitetura Mental</h3>
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.4em] max-w-md leading-relaxed">
            O domínio da gramática é o que diferencia o falante do mestre. <br /> Continue construindo seus alicerces.
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
