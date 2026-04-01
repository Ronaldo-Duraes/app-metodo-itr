'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Zap, Target, Maximize2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRoleGuard } from '@/hooks/useRoleGuard';

// Estrutura de Dados dos 50 Gatilhos
const MIRROR_CATEGORIES = [
  {
    title: '📆 Rotina & cotidiano',
    items: [
      'Fale sobre sua rotina matinal.',
      'O que você faz à noite?',
      'Descreva seu domingo ideal.',
      'Fale sobre sua última segunda-feira.',
      'O que você costuma fazer no fim de semana?'
    ]
  },
  {
    title: '🍽️ Comida',
    items: [
      'O que você come no café da manhã?',
      'Fale sobre um prato que você ama.',
      'O que você não gosta de comer?',
      'Como seria sua refeição perfeita?',
      'Descreva um restaurante que você visitou.'
    ]
  },
  {
    title: '🎬 Filmes, livros e séries',
    items: [
      'Fale sobre seu filme favorito.',
      'Descreva o enredo de um livro que você leu.',
      'Qual série você recomenda?',
      'O que você assistiu recentemente?',
      'Quem é seu personagem favorito?'
    ]
  },
  {
    title: '🗣️ Expressões específicas',
    items: [
      'Fale 3 frases com "because".',
      'Use "have to" em 3 frases.',
      'Use "can" e "can’t" para descrever o que você consegue fazer.',
      'Fale 3 frases usando "there is / there are".',
      'Use "I would like to..." em 3 contextos.'
    ]
  },
  {
    title: '🧳 Viagem & lugares',
    items: [
      'Fale sobre um lugar que você quer visitar.',
      'Descreva uma viagem inesquecível.',
      'Fale sobre sua cidade.',
      'O que você gosta ou não gosta no Brasil?',
      'Fale sobre um lugar calmo.'
    ]
  },
  {
    title: '🎯 Desejos e planos',
    items: [
      'O que você vai fazer amanhã?',
      'Fale sobre seus planos para este ano.',
      'O que você faria se ganhasse na loteria?',
      'Fale sobre seus objetivos pessoais.',
      'O que você gostaria de aprender?'
    ]
  },
  {
    title: '👤 Você mesmo',
    items: [
      'Fale sobre você.',
      'Descreva sua personalidade.',
      'O que você fazia quando era criança?',
      'Como você se sente hoje?',
      'O que te deixa feliz?'
    ]
  },
  {
    title: '⏳ Tempos verbais',
    items: [
      'Fale sobre algo que aconteceu ontem (past).',
      'Fale sobre o que está fazendo agora (present continuous).',
      'Fale sobre algo que já fez na vida (present perfect).',
      'Fale sobre algo que fará semana que vem (future).',
      'Use "used to" para falar do passado.'
    ]
  },
  {
    title: '🧠 Opiniões e argumentos',
    items: [
      'Você prefere café ou chá? Por quê?',
      'Qual é sua opinião sobre redes sociais?',
      'Educação online é melhor que presencial?',
      'Fale sobre algo que te incomoda.',
      'Qual é o melhor estilo musical?'
    ]
  },
  {
    title: '⚡ Situações reais',
    items: [
      'Finja que está pedindo comida no telefone.',
      'Imagine que está se apresentando para uma entrevista.',
      'Finja que está explicando um problema a um médico.',
      'Você está em um aeroporto e perdeu o voo. E agora?',
      'Você está conhecendo alguém novo. Como se apresenta?'
    ]
  }
];

const STORAGE_KEY = 'itr_mirror_triggers';

export default function MirrorTriggersPage() {
  const { executeProtectedAction } = useRoleGuard();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try { setCompleted(JSON.parse(stored)); } catch (e) { console.error(e); }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    }
  }, [completed, isLoaded]);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    executeProtectedAction(() => {
      setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
    });
  };

  const total = 50;
  const count = Object.values(completed).filter(Boolean).length;
  const progress = (count / total) * 100;

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white font-outfit pb-40 relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#062417_0%,#000000_70%)] -z-10" />

      <div className="max-w-5xl mx-auto px-6 pt-12">
        {/* HEADER NAVIGATION */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/app" className="group flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Arsenal ITR</span>
          </Link>
          <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/5 px-4 py-2">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Técnica do Espelho</span>
          </div>
        </div>

        {/* TITLE & PROGRESS */}
        <div className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8"
          >
            50 Gatilhos<br/>
            <span className="text-emerald-500">Lendários</span>
          </motion.h1>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1 max-w-xl">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">Domínio do Espelho</span>
                <span className="text-4xl font-black tracking-tighter tabular-nums">{count}<span className="text-zinc-700 mx-1">/</span>50</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                />
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest max-w-[240px] leading-relaxed">
              Pratique em frente ao espelho. <br/>A confiança visual acelera a fluência.
            </p>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="space-y-16">
          {MIRROR_CATEGORIES.map((cat, catIdx) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              <div className="flex items-center gap-6 mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-200">{cat.title}</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {cat.items.map((item, itemIdx) => {
                  const id = `t-${catIdx}-${itemIdx}`;
                  const isExpanded = expanded === id;
                  return (
                    <motion.div
                      key={id}
                      onClick={() => setExpanded(isExpanded ? null : id)}
                      layout
                      className={`relative overflow-hidden cursor-pointer transition-all duration-500 group border-2 ${
                        isExpanded 
                        ? 'border-emerald-500 bg-emerald-950/20 p-10 z-20' 
                        : 'border-white/5 bg-white/[0.02] hover:border-emerald-500/30 p-6'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-1">
                          <span className={`text-[10px] font-black transition-colors ${isExpanded ? 'text-emerald-500' : 'text-zinc-800'}`}>
                            {String(itemIdx + 1).padStart(2, '0')}
                          </span>
                          <span className={`font-black uppercase tracking-tight transition-all duration-500 ${
                            isExpanded ? 'text-4xl text-white' : 'text-sm text-zinc-400 group-hover:text-zinc-200'
                          } ${completed[id] ? 'line-through opacity-30 text-zinc-600' : ''}`}>
                            {item}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => toggleComplete(id, e)}
                            className={`w-10 h-10 border-2 flex items-center justify-center transition-all duration-300 ${
                              completed[id] 
                              ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                              : 'border-white/10 hover:border-emerald-500 group-hover:scale-110'
                            }`}
                          >
                            {completed[id] && <Check size={18} className="text-black stroke-[4]" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-12 flex items-center justify-center border-t border-emerald-500/10 pt-10"
                        >
                          <div className="flex flex-col items-center">
                            <Zap size={32} className="text-emerald-500 mb-6 animate-pulse" />
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Modo Prática Ativo</p>
                            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest text-center px-12 italic leading-relaxed">
                              Mantenha o contato visual com seu reflexo enquanto responde a este comando.
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {!isExpanded && (
                         <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Maximize2 size={14} className="text-white" />
                         </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FINAL MASTERY SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 p-20 border-2 border-dashed border-zinc-900 bg-white/[0.01] flex flex-col items-center text-center relative"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
          <Target size={48} className="text-zinc-900 mb-8" />
          <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter mb-4">Protocolo Concluído?</h3>
          <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-[0.4em] max-w-sm leading-relaxed">
            Se você dominou os 50 gatilhos, seu cérebro já está condicionado à fala instintiva.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
