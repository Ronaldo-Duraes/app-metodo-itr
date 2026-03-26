'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, Filter } from 'lucide-react';
import { getDictionary } from '@/lib/srs';
import { DictionaryEntry } from '@/lib/types';

export default function DicionarioPage() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = getDictionary();
    // Ordenar alfabeticamente por padrão
    setDictionary([...data].sort((a, b) => a.word.localeCompare(b.word)));
  }, []);

  const filteredWords = dictionary.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
        <div>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">
            Repositório de Inteligência
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
            Dicionário <span className="text-emerald-500">Pessoal</span>
          </h1>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/10 p-6 flex flex-col items-center justify-center min-w-[200px]">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total de Vocabulário</span>
          <div className="text-4xl font-black text-white leading-none">
            {dictionary.length} <span className="text-sm text-emerald-500 uppercase tracking-tighter">palavras</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="BUSCAR NO DICIONÁRIO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 shadow-inner"
          />
        </div>
        <button className="bg-white/5 border border-white/10 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all flex items-center gap-3">
          <Filter size={16} /> Filtros
        </button>
      </div>

      {/* LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {filteredWords.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group relative flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter mb-1">
                {item.isMemorized ? '✓ Memorizada' : 'Em revisão'}
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                {item.word}
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                {item.translation}
              </p>
            </div>
            
            <div className="text-right flex flex-col items-end gap-2">
              <div className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                Freq: <span className="text-white">{item.usageFrequency}x</span>
              </div>
              <div className="text-[9px] font-bold text-slate-800 uppercase tracking-widest opacity-50">
                {new Date(item.dateAdded).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredWords.length === 0 && (
          <div className="col-span-full py-24 border border-dashed border-white/10 flex flex-col items-center justify-center italic text-slate-600">
            <Book size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhuma palavra encontrada no repositório.</p>
          </div>
        )}
      </div>
    </div>
  );
}
