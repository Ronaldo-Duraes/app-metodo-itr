'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Search, Filter, MoreVertical, Zap, Layers, Play } from 'lucide-react';

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 font-outfit">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER AREA */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 mb-4 block">Módulo de Retenção</span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Flashcards
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-none font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
              <Plus size={16} strokeWidth={3} />
              Novo Card
            </button>
            <button className="flex items-center gap-3 bg-transparent border-2 border-white/10 text-white px-6 py-3 rounded-none font-black text-xs tracking-widest uppercase hover:border-emerald-500/50 transition-colors active:scale-95">
              Importar
            </button>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: ACTION BOARDS */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* STUDY ACTION CARD */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative p-8 rounded-none border-2 border-emerald-500 bg-white/[0.02] backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.1)] group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Zap size={40} className="text-emerald-500" />
              </div>
              
              <div className="flex flex-col h-full">
                <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase mb-4">Ação Prioritária</span>
                <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase whitespace-pre-line">
                  Revisar Agora
                </h2>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                    24 pendentes
                  </div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-widest uppercase">
                    Level 04
                  </div>
                </div>

                <button className="w-full py-4 bg-emerald-500 text-black font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl">
                  <Play size={14} fill="currentColor" />
                  Iniciar Estudo
                </button>
              </div>
            </motion.div>

            {/* STATUS SUMMARY */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border border-white/5 bg-white/[0.01]">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Total Decks</span>
                <span className="text-2xl font-black text-white tracking-tighter">12</span>
              </div>
              <div className="p-6 border border-white/5 bg-white/[0.01]">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Cards Ativos</span>
                <span className="text-2xl font-black text-white tracking-tighter">458</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DECK EXPLORER */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Meus Decks</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Search size={18} /></button>
                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Filter size={18} /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Essenciais ITR', count: 156, color: 'emerald' },
                { title: 'Verbos Comuns', count: 85, color: 'blue' },
                { title: 'Mirage Deck', count: 42, color: 'yellow' },
                { title: 'Core Grammar', count: 210, color: 'emerald' },
              ].map((deck, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center border border-white/5 bg-slate-900 group-hover:border-emerald-500/50 transition-colors`}>
                      <Layers size={20} className="text-slate-500 group-hover:text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm uppercase tracking-tight">{deck.title}</h4>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{deck.count} CARDS</span>
                    </div>
                  </div>
                  <MoreVertical size={16} className="text-slate-700 group-hover:text-white" />
                </motion.div>
              ))}
            </div>

            {/* EMPTY STATE / CALL TO ACTION */}
            <div className="mt-12 p-12 border-2 border-dashed border-white/5 flex flex-col items-center text-center opacity-40">
              <BookOpen size={40} className="mb-6 text-slate-700" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-xs">
                Explore seus decks ou aumente seu vocabulário adicionando novos cards
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
