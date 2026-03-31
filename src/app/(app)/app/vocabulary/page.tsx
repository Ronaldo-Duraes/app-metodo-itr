'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, LayoutGrid, ArrowLeft, Loader2, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VOCABULARY_SPRINTS, EssentialWord } from '@/lib/vocabularyData';
import { 
  getVocabularyProgress, 
  toggleVocabularyMemorized, 
  generateSprintCards,
  getCurrentSprint,
  setVocabularySprint,
  resetSprintProgress
} from '@/lib/srs';
import ResetSprintModal from '@/components/ResetSprintModal';

export default function VocabularyPage() {
  const router = useRouter(); 
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [activeSprint, setActiveSprint] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  // Drag-to-scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleDragDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragUp = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    setMounted(true);
    setProgress(getVocabularyProgress());
    setActiveSprint(getCurrentSprint());
  }, []);

  if (!mounted) return null;

  const totalWords = 600;
  const memorizedCount = progress.length;
  const progressPercentage = (memorizedCount / totalWords) * 100;

  const currentSprintWords = VOCABULARY_SPRINTS.filter(w => w.sprint === activeSprint);
  const sprintMemorized = currentSprintWords.filter(w => progress.includes(w.id)).length;
  const sprintTotal = currentSprintWords.length;

  const handleToggle = (word: EssentialWord) => {
    toggleVocabularyMemorized({ id: word.id, en: word.en, pt: word.pt });
    setProgress(getVocabularyProgress());
  };

  const handleGenerateCards = async () => {
    setIsGenerating(true);
    // Simula processamento para UX
    await new Promise(r => setTimeout(r, 1500));
    
    // Filtra palavras não memorizadas do sprint atual
    const wordsToGenerate = currentSprintWords
      .filter(w => !progress.includes(w.id))
      .map(w => ({ en: w.en, pt: w.pt, category: w.category, phonetic: w.phonetic }));
    
    const finalDeckName = generateSprintCards(wordsToGenerate, activeSprint);
    
    // Pequeno delay extra para UX de conclusão
    await new Promise(r => setTimeout(r, 500));
    setIsGenerating(false);
    
    // Redirecionamento automático
    router.push('/app/flashcards');
  };

  const handleResetSprint = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    const wordIds = currentSprintWords.map(w => w.id);
    const wordData = currentSprintWords.map(w => ({ en: w.en, pt: w.pt }));
    resetSprintProgress(wordIds, wordData);
    setProgress(getVocabularyProgress());
  };

  const changeSprint = (s: number) => {
    setActiveSprint(s);
    setVocabularySprint(s);
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header Fixo de Progresso */}
      <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  <ArrowLeft size={18} />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Vocabulários Essenciais</h1>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Maestria de 600 Palavras</p>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progresso Global</span>
                <span className="text-sm font-black text-white">{memorizedCount} <span className="text-slate-600">/ {totalWords}</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerateCards}
              disabled={isGenerating || sprintMemorized === sprintTotal}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                isGenerating || sprintMemorized === sprintTotal
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              }`}
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
              {isGenerating ? 'Processando...' : `Gerar Sprint ${activeSprint}`}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {/* Sprint Selector with drag-to-scroll */}
        <div 
          ref={scrollRef}
          onMouseDown={handleDragDown}
          onMouseLeave={handleDragLeave}
          onMouseUp={handleDragUp}
          onMouseMove={handleDragMove}
          className={`flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar active:cursor-grabbing ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const sprintNum = i + 1;
            const isSelected = activeSprint === sprintNum;
            return (
              <button
                key={sprintNum}
                onClick={() => changeSprint(sprintNum)}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border select-none ${
                  isSelected 
                    ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-white'
                }`}
              >
                Sprint {sprintNum}
              </button>
            );
          })}
        </div>

        <div className="mb-12 flex items-center justify-between border-l-4 border-emerald-500/30 pl-6">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Sprint {activeSprint}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Foco: {activeSprint === 1 ? 'Verbos e Conectivos Básicos' : activeSprint === 2 ? 'Objetos do Dia a Dia' : 'Expansão de Vocabulário'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleResetSprint}
              className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors px-3 py-1 border border-red-500/10 hover:border-red-500/30 rounded-md"
            >
              Resetar Sprint
            </button>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{sprintMemorized} / {sprintTotal}</span>
            </div>
          </div>
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {currentSprintWords.map((word, idx) => {
              const isMemorized = progress.includes(word.id);
              return (
                <motion.div
                  key={word.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.01 }}
                  className={`group relative p-5 bg-[#0a0a0a] border rounded-2xl transition-all duration-300 ${
                    isMemorized 
                      ? 'border-emerald-500/20 bg-slate-900/20 opacity-40' 
                      : 'border-white/5 hover:border-emerald-500/30 bg-gradient-to-br from-white/[0.03] to-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.2em] block mb-1">
                        {word.category}
                      </span>
                      <h3 className={`text-lg font-black tracking-tight truncate transition-colors ${isMemorized ? 'text-slate-500 line-through' : 'text-white'}`}>
                        {word.en}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-xs font-medium tracking-wide truncate ${isMemorized ? 'text-slate-600' : 'text-slate-400'}`}>
                          {word.pt}
                        </p>
                        {word.phonetic && word.phonetic !== '...' && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border bg-white/5 font-mono ${isMemorized ? 'text-slate-700 border-white/5' : 'text-emerald-500/70 border-emerald-500/10'}`}>
                            /{word.phonetic}/
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleToggle(word)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isMemorized 
                          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                          : 'bg-white/5 text-slate-700 hover:bg-emerald-500/10 hover:text-emerald-500 border border-white/10 group-hover:border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <ResetSprintModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmReset}
        sprintNumber={activeSprint}
      />
    </div>
  );
}
