'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Filter, Gem, Edit2, X, Check, Trash2 } from 'lucide-react';
import { getDictionary, updateDictionaryEntry, deleteDictionaryEntry } from '@/lib/srs';
import { DictionaryEntry } from '@/lib/types';

export default function DicionarioPage() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWord, setEditingWord] = useState<DictionaryEntry | null>(null);
  const [editForm, setEditForm] = useState({ word: '', translation: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<DictionaryEntry | null>(null);

  const loadData = () => {
    const data = getDictionary();
    setDictionary([...data].sort((a, b) => a.translation.localeCompare(b.translation)));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditClick = (item: DictionaryEntry) => {
    setEditingWord(item);
    setEditForm({ word: item.word, translation: item.translation });
  };

  const handleSaveEdit = () => {
    if (editingWord) {
      updateDictionaryEntry(editingWord.id, editForm.word, editForm.translation);
      setEditingWord(null);
      loadData();
    }
  };

  const handleConfirmDelete = () => {
    if (wordToDelete) {
      deleteDictionaryEntry(wordToDelete.id);
      setIsDeleteModalOpen(false);
      setWordToDelete(null);
      loadData();
    }
  };

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
        
        <div className="flex flex-col gap-4 min-w-[240px]">
          {/* TOTAL VOCABULÁRIO */}
          <div className="bg-zinc-900/50 border border-white/10 p-6 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total de Vocabulário</span>
            <div className="text-4xl font-black text-white leading-none">
              {dictionary.length} <span className="text-sm text-emerald-500 uppercase tracking-tighter">palavras</span>
            </div>
          </div>

          {/* MEMORIZADOS (LENDÁRIO) */}
          <div className="bg-zinc-900/80 border border-yellow-500/30 p-6 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gem size={32} className="text-yellow-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-2">Memorizados</span>
            <div className="text-4xl font-black text-yellow-500 leading-none drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
              {dictionary.filter(item => item.isMemorized).length} <span className="text-sm text-yellow-700 uppercase tracking-tighter italic">mastery</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="BUSCAR (PORTUGUÊS OU INGLÊS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 shadow-inner"
          />
        </div>
        <button className="bg-white/5 border border-white/10 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all flex items-center gap-3">
          <Filter size={16} /> Filtros
        </button>
      </div>

      {/* LIST HEADERS (DESKTOP) */}
      <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_120px] px-8 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
        <div>Português</div>
        <div>Inglês</div>
        <div className="text-right">Status</div>
      </div>

      {/* LIST ROWS */}
      <div className="flex flex-col gap-1 relative z-0">
        {filteredWords.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.01 }}
            onClick={() => handleEditClick(item)}
            className="group relative flex flex-col md:grid md:grid-cols-[1.5fr_1.5fr_120px] items-center p-4 md:px-8 md:py-5 bg-zinc-900 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800/60 transition-all cursor-pointer"
          >
            {/* Português (Destaque) */}
            <div className="w-full md:w-auto mb-2 md:mb-0">
              <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                {item.translation}
              </h3>
            </div>

            {/* Inglês */}
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                {item.word}
              </p>
            </div>
            
            {/* Status & Actions */}
            <div className="w-full md:w-auto flex justify-start md:justify-end items-center gap-4">
              {item.isMemorized ? (
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center gap-1">
                  <Gem size={10} /> Memorizado
                </div>
              ) : (
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-tighter">
                  Em Revisão
                </div>
              )}
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setWordToDelete(item);
                  setIsDeleteModalOpen(true);
                }}
                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                title="Excluir Permanentemente"
              >
                <Trash2 size={16} />
              </button>

              {/* Indicador Mobile de Edit */}
              <div className="md:hidden text-slate-700">
                <Edit2 size={12} />
              </div>
            </div>
          </motion.div>
        ))}

        {filteredWords.length === 0 && (
          <div className="col-span-full py-24 border border-dashed border-white/10 flex flex-col items-center justify-center italic text-slate-600">
            <Book size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">Repositório vazio ou nenhum resultado para a busca.</p>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingWord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingWord(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-zinc-900 border border-white/10 p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Editar <span className="text-emerald-500">Termo</span></h2>
                <button onClick={() => setEditingWord(null)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">Português (Destaque)</label>
                  <input 
                    type="text" 
                    value={editForm.translation}
                    onChange={(e) => setEditForm(prev => ({ ...prev, translation: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Inglês</label>
                  <input 
                    type="text" 
                    value={editForm.word}
                    onChange={(e) => setEditForm(prev => ({ ...prev, word: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  />
                </div>
                
                <button 
                  onClick={handleSaveEdit}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black p-4 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Check size={18} /> Salvar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && wordToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-zinc-900 border border-red-500/20 p-10 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 rounded-full">
                <Trash2 size={32} className="text-red-500" />
              </div>
              
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Confirmar <span className="text-red-500">Exclusão</span></h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-10">
                Deseja excluir este vocabulário permanentemente? Isso reduzirá seu progresso no perfil.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmDelete}
                  className="w-full bg-red-500 hover:bg-red-400 text-black py-4 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/10"
                >
                  EXCLUIR AGORA
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 text-xs font-black uppercase tracking-widest transition-all"
                >
                  CANCELAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
