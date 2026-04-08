'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Filter, Gem, Edit2, X, Check, Trash2, Trash, AlertTriangle } from 'lucide-react';
import { getDictionary, updateDictionaryEntry, deleteDictionaryEntry, saveDictionary, resetDictionarySRS } from '@/lib/srs';
import { DictionaryEntry } from '@/lib/types';

export default function DicionarioPage() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWord, setEditingWord] = useState<DictionaryEntry | null>(null);
  const [editForm, setEditForm] = useState({ word: '', translation: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<DictionaryEntry | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortMode, setSortMode] = useState<'recent' | 'oldest' | 'alphabetical'>('recent');
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [clearStep, setClearStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const loadData = () => {
    const data = getDictionary().filter(item => item.inDictionary !== false);
    let sorted = [...data];
    
    if (sortMode === 'recent') {
      // Mais recentes primeiro (decrescente por data)
      sorted.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());
    } else if (sortMode === 'oldest') {
      // Mais antigas primeiro (crescente por data)
      sorted.sort((a, b) => new Date(a.dateAdded || 0).getTime() - new Date(b.dateAdded || 0).getTime());
    } else if (sortMode === 'alphabetical') {
      // Ordem Alfabética (A-Z)
      sorted.sort((a, b) => a.translation.localeCompare(b.translation));
    }
    
    setDictionary(sorted);
  };

  const cycleSortMode = () => {
    if (sortMode === 'recent') setSortMode('oldest');
    else if (sortMode === 'oldest') setSortMode('alphabetical');
    else setSortMode('recent');
  };

  useEffect(() => {
    loadData();
  }, [sortMode]);

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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    const fullDict = getDictionary();
    const updated = fullDict.filter(item => !selectedIds.includes(item.id));
    saveDictionary(updated);
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    loadData();
  };

  const handleClearAll = () => {
    resetDictionarySRS();
    setIsClearAllModalOpen(false);
    setClearStep(1);
    setConfirmText('');
    loadData();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12 select-none">
      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }
        .select-none {
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-16 border-b border-white/5 pb-8 md:pb-12">
        <div>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">
            Repositório de Inteligência
          </span>
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none italic">
            Dicionário <span className="text-emerald-500">Pessoal</span>
          </h1>
          <button 
            onClick={() => {
              setClearStep(1);
              setConfirmText('');
              setIsClearAllModalOpen(true);
            }}
            className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors group"
          >
            <Trash size={14} className="group-hover:animate-bounce" />
            Limpar Visualização (Resetar Progresso)
          </button>
        </div>
        
        <div className="flex flex-row md:flex-col gap-3 md:gap-4 min-w-0 md:min-w-[240px]">
          {/* TOTAL VOCABULÁRIO */}
          <div className="bg-zinc-900/50 border border-white/10 p-4 md:p-6 flex flex-col items-center justify-center flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total de Vocabulário</span>
            <div className="text-2xl md:text-4xl font-black text-white leading-none">
              {dictionary.length} <span className="text-sm text-emerald-500 uppercase tracking-tighter">palavras</span>
            </div>
          </div>

          {/* MEMORIZADOS (LENDÁRIO) */}
          <div className="bg-zinc-900/80 border border-yellow-500/30 p-4 md:p-6 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.05)] relative overflow-hidden group flex-1">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gem size={32} className="text-yellow-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-2">Memorizados</span>
            <div className="text-2xl md:text-4xl font-black text-yellow-500 leading-none drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
              {dictionary.filter(item => item.isMemorized).length} <span className="text-sm text-yellow-700 uppercase tracking-tighter italic">mastery</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="relative z-[40] -mx-4 md:mx-0 px-4 py-4 md:p-0 bg-black/95 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none border-b border-white/5 md:border-0 flex flex-col md:flex-row gap-3 md:gap-4 md:mb-12 shadow-none transition-all">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="BUSCAR (PORTUGUÊS OU INGLÊS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 min-h-[52px] pl-12 text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 shadow-inner rounded-xl md:rounded-none"
          />
        </div>
        <button 
          onClick={cycleSortMode}
          className={`w-full md:w-auto min-h-[52px] px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border rounded-xl md:rounded-none active:scale-[0.98] md:active:scale-100 ${
            sortMode === 'alphabetical' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 
            sortMode === 'oldest' ? 'bg-white/10 border-white/20 text-white' : 
            'bg-white/5 border-white/10 text-slate-400'
          } hover:border-emerald-500/30`}
        >
          <Filter size={18} /> 
          <span>ORDEM: {sortMode === 'recent' ? 'RECENTES' : sortMode === 'oldest' ? 'ANTIGAS' : 'A-Z'}</span>
        </button>
      </div>

      <div className="pt-4 md:pt-0 relative z-0">
        {/* LIST HEADERS (DESKTOP) */}
        <div className="hidden md:grid grid-cols-[50px_1.5fr_1.5fr_120px] px-8 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
          <div className="flex justify-center">
            <div 
              onClick={() => {
                if (selectedIds.length === filteredWords.length) setSelectedIds([]);
                else setSelectedIds(filteredWords.map(w => w.id));
              }}
              className={`w-4 h-4 border transition-all cursor-pointer flex items-center justify-center ${selectedIds.length === filteredWords.length && filteredWords.length > 0 ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 hover:border-white/30'}`}
            >
               {selectedIds.length === filteredWords.length && filteredWords.length > 0 && <Check size={10} className="text-black" strokeWidth={4} />}
            </div>
          </div>
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
            className={`group relative flex flex-col md:grid md:grid-cols-[50px_1.5fr_1.5fr_120px] items-start md:items-center p-3 md:px-8 md:py-5 border transition-all cursor-pointer rounded-xl md:rounded-none w-full md:w-auto mb-2 md:mb-1 ${
              selectedIds.includes(item.id) 
                ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                : 'bg-zinc-900 border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800/60'
            }`}
            onClick={() => handleEditClick(item)}
          >
            {/* NO MOBILE: Topo com Checkbox e Status Compacto */}
            <div className="flex md:hidden justify-between items-center w-full mb-2 pb-2 border-b border-white/5">
              <div 
                onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                className="flex items-center gap-2 active:scale-95 transition-transform"
              >
                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                  selectedIds.includes(item.id) 
                    ? 'border-emerald-500 bg-emerald-500' 
                    : 'border-white/10 bg-black/50'
                }`}>
                  {selectedIds.includes(item.id) && <Check size={12} className="text-black" strokeWidth={4} />}
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SEL</span>
              </div>
              
              {item.isMemorized ? (
                <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[8px] font-black uppercase tracking-tighter rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center gap-1">
                  <Gem size={8} /> Memorizado
                </div>
              ) : (
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-tighter rounded-full">
                  Em Revisão
                </div>
              )}
            </div>

            {/* SELECTION CHECKBOX (DESKTOP) */}
            <div 
              onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
              className="hidden md:flex justify-center"
            >
              <div className={`w-5 h-5 border-2 transition-all flex items-center justify-center ${
                selectedIds.includes(item.id) 
                  ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'border-white/10 group-hover:border-white/30 bg-transparent'
              }`}>
                {selectedIds.includes(item.id) && <Check size={12} className="text-black" strokeWidth={4} />}
              </div>
            </div>
            
            {/* CONTEÚDO (Lado a Lado no Mobile) */}
            <div className="flex w-full md:contents items-center justify-between gap-2">
              <div className="grid grid-cols-2 gap-2 flex-1 md:contents items-center">
                {/* Português */}
                <div className="min-w-0 pr-1 md:pr-0">
                  <h3 className="text-xs md:text-base font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors truncate">
                    {item.translation}
                  </h3>
                </div>

                {/* Inglês */}
                <div className="min-w-0 border-l border-white/10 pl-2 md:border-0 md:pl-0">
                  <p className="text-xs md:text-sm text-emerald-500 md:text-slate-500 font-bold uppercase tracking-tight md:tracking-widest font-mono truncate">
                    {item.word}
                  </p>
                </div>
              </div>

              {/* Botões de Ação Mobile (Pequenos e Discretos) */}
              <div className="flex md:hidden justify-end items-center gap-1.5 shrink-0 bg-black/40 p-1 rounded-lg border border-white/5">
                <div className="w-7 h-7 text-slate-400 bg-white/5 rounded flex items-center justify-center">
                  <Edit2 size={12} />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setWordToDelete(item);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-7 h-7 text-red-500/80 hover:text-red-500 bg-red-500/10 rounded flex items-center justify-center active:scale-90 transition-transform"
                  title="Excluir Permanentemente"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            
            {/* Status & Actions (Apenas Desktop) */}
            <div className="hidden w-full md:w-auto md:flex justify-end items-center gap-4 relative">
              <div className="hidden md:block">
                {item.isMemorized ? (
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                    <Gem size={10} /> Memorizado
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-tighter">
                    Em Revisão
                  </div>
                )}
              </div>
              
              <div className="flex w-full md:w-auto justify-end items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setWordToDelete(item);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-12 h-12 md:w-auto md:h-auto md:p-2 text-slate-500 hover:text-red-500 bg-black/30 md:bg-transparent rounded-lg md:rounded-none transition-colors border border-white/5 md:border-0 flex items-center justify-center active:scale-90"
                  title="Excluir Permanentemente"
                >
                  <Trash2 size={18} />
                </button>
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

      {/* AO FUNDO: BARRA DE AÇÕES FLUTUANTE */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 100, x: '-50%', opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[100] bg-zinc-950 border-2 border-emerald-500/30 px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center gap-4 md:gap-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-[calc(100%-2rem)] sm:w-auto"
          >
            <div className="flex items-center gap-4 border-r border-white/10 pr-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                {selectedIds.length} <span className="text-emerald-500">Selecionados</span>
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-all text-[11px] font-black uppercase tracking-widest px-5 py-2 border border-red-500/20 hover:border-red-500 bg-red-500/5 active:scale-95"
              >
                <Trash size={16} /> APAGAR SELEÇÃO
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border-b border-transparent hover:border-white/50"
              >
                CANCELAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO EM MASSA */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#080808] border border-red-500/30 p-12 max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="text-red-600" size={40} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Confirmar <span className="text-red-500">Exclusão</span></h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-10">
              Deseja apagar os {selectedIds.length} vocabulários selecionados permanentemente? Esta ação reduzirá seu progresso global.
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={handleBulkDelete} className="w-full py-5 bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-red-500 transition-all shadow-xl shadow-red-500/10 active:scale-95">CONFIRMAR E APAGAR</button>
              <button onClick={() => setIsBulkDeleteModalOpen(false)} className="w-full py-5 bg-white/5 text-slate-500 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-all">MANTER REGISTROS</button>
            </div>
          </motion.div>
        </div>
      )}
      {/* MODAL DE LIMPEZA TOTAL (DUPLA CONFIRMAÇÃO) */}
      <AnimatePresence>
        {isClearAllModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsClearAllModalOpen(false)}
              className="absolute inset-0 bg-black/98 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-zinc-950 border border-red-500/40 p-10 w-full max-w-md shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 rounded-full">
                <AlertTriangle size={36} className="text-red-500 animate-pulse" />
              </div>

              {clearStep === 1 ? (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-white">Resetar progresso de <span className="text-red-500">estudo?</span></h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-10">
                    Atenção: Isso resetará todas as suas palavras para o nível 'Novo' e as removerá desta lista, mas elas continuarão salvas nos seus baralhos originais.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setClearStep(2)}
                      className="w-full bg-red-500 hover:bg-red-400 text-black py-4 text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Prosseguir para Confirmação
                    </button>
                    <button 
                      onClick={() => setIsClearAllModalOpen(false)}
                      className="w-full bg-white/5 border border-white/10 text-white py-4 text-xs font-black uppercase tracking-widest"
                    >
                      CANCELAR
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-white underline decoration-red-500/50">Confirmação Final</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                    Para prosseguir, digite <span className="text-red-500">confirmar</span> abaixo:
                  </p>
                  
                  <input 
                    type="text"
                    autoFocus
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value.toLowerCase())}
                    className="w-full bg-black border-2 border-red-500/20 focus:border-red-500 p-4 mb-8 text-center text-sm font-black tracking-[0.3em] uppercase transition-all outline-none"
                    placeholder="DIGITE AQUI..."
                  />

                  <div className="flex flex-col gap-3">
                    <button 
                      disabled={confirmText !== 'confirmar'}
                      onClick={handleClearAll}
                      className={`w-full py-4 text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
                        confirmText === 'confirmar' 
                          ? 'bg-red-600 text-white hover:bg-red-500 cursor-pointer shadow-red-500/20' 
                          : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      RESETAR PROGRESSO AGORA
                    </button>
                    <button 
                      onClick={() => {
                        setClearStep(1);
                        setIsClearAllModalOpen(false);
                      }}
                      className="w-full text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mt-2"
                    >
                      MUDEI DE IDEIA
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 md:right-10 z-[250] bg-emerald-500 text-black px-6 py-3 md:px-8 md:py-4 font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 -translate-x-1/2 md:translate-x-0 md:left-auto w-[calc(100%-3rem)] md:w-auto"
          >
            <Check size={18} strokeWidth={3} />
            Progresso resetado com sucesso
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
