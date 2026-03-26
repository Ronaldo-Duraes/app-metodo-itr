'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Search, Filter, MoreVertical, Zap, Layers, Play, X, Edit2, Trash2, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { getCards, getDecks, addDeck, getTodayPendingCards, renameDeck, deleteDeck, addFullCard, deleteCard, updateCard } from '@/lib/srs';
import { Flashcard, Deck } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- COMPONENTE: DECK SELECTOR CUSTOM (INDUSTRIAL) ---
interface DeckSelectorProps {
  decks: Deck[];
  selectedDeckName: string;
  onSelect: (name: string) => void;
  disabled?: boolean;
}

const DeckSelector = ({ decks, selectedDeckName, onSelect, disabled = false }: DeckSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full font-outfit">
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full p-4 flex items-center justify-between border-2 transition-all cursor-pointer ${
          disabled ? 'bg-white/5 border-white/5 opacity-50' : 
          isOpen ? 'bg-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <Layers size={16} className={disabled ? 'text-slate-600' : 'text-emerald-500'} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${selectedDeckName ? 'text-white' : 'text-slate-500'}`}>
            {selectedDeckName || 'Selecione um Baralho'}
          </span>
        </div>
        {!disabled && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={16} className="text-slate-500" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop para fechar ao clicar fora */}
            <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-black border border-emerald-500/30 shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar"
            >
              {decks.map((deck) => (
                <div 
                  key={deck.id}
                  onClick={() => {
                    onSelect(deck.name);
                    setIsOpen(false);
                  }}
                  className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer border-b border-white/5 last:border-0"
                >
                  {deck.name}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default function FlashcardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- EFEITO: CLIQUE FORA E ESC PARA FECHAR MENU ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Se clicar fora do menu, fecha
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenuId(null);
      }
    };

    if (activeMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [activeMenuId]);
  const [newDeckName, setNewDeckName] = useState('');
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [newCardData, setNewCardData] = useState({ front: '', back: '', association: '', deckName: '' });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // DECK EDITOR STATE
  const [viewingDeck, setViewingDeck] = useState<Deck | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedCards = getCards();
    const loadedDecks = getDecks();
    setCards(loadedCards);
    setDecks(loadedDecks);
    setIsLoading(false);
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    addDeck(newDeckName.trim());
    setNewDeckName('');
    setIsModalOpen(false);
    loadData();
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeck || !newDeckName.trim()) return;
    renameDeck(activeDeck.id, newDeckName.trim());
    setNewDeckName('');
    setActiveDeck(null);
    setIsRenameModalOpen(false);
    loadData();
  };

  const handleDelete = () => {
    if (!activeDeck) return;
    deleteDeck(activeDeck.id);
    setActiveDeck(null);
    setIsDeleteModalOpen(false);
    loadData();
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    const { front, back, association, deckName } = newCardData;
    
    // Lógica de Segurança
    if (!deckName && decks.length === 0) {
      if (!newDeckName.trim()) return;
      const d = addDeck(newDeckName.trim());
      addFullCard(front, back, association, d.name);
    } else {
      if (!front || !back || !deckName) return;
      addFullCard(front, back, association, deckName);
    }

    setNewCardData({ front: '', back: '', association: '', deckName: '' });
    setNewDeckName('');
    setIsCardModalOpen(false);
    loadData();
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    loadData();
  };

  const getTimeLeft = (card: Flashcard) => {
    if (card.isMemorized) return { text: 'Memorizado', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <Check size={12} /> };
    
    const diff = new Date(card.nextReview).getTime() - Date.now();
    if (diff <= 0) return { text: 'Revisar Agora', color: 'text-red-500', bg: 'bg-red-500/10', icon: null };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return { text: `Em ${days}d`, color: 'text-emerald-500/60', bg: 'bg-white/5', icon: null };
    }
    
    return { text: `Em ${hours}h`, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: null };
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    updateCard(editingCard.id, {
      front: editingCard.front,
      back: editingCard.back,
      association: editingCard.association
    });
    setIsEditCardModalOpen(false);
    setEditingCard(null);
    loadData();
  };

  const pendingCards = getTodayPendingCards(cards);
  const totalMastered = cards.filter(c => c.isLearned).length;

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

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsCardModalOpen(true)}
              className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-none font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              Novo Card
            </button>
            <button 
              onClick={() => {
                setNewDeckName('');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-3 bg-transparent border-2 border-white/10 text-white px-6 py-3 rounded-none font-black text-xs tracking-widest uppercase hover:border-emerald-500/50 transition-colors active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              Novo Deck
            </button>
            <button className="flex items-center gap-3 bg-transparent border-2 border-white/40 text-white/40 px-6 py-3 rounded-none font-black text-xs tracking-widest uppercase hover:border-emerald-500/50 hover:text-white transition-colors active:scale-95">
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
                    {pendingCards.length} pendentes
                  </div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-widest uppercase">
                    Mastered: {totalMastered}
                  </div>
                </div>

                <Link href="/app/estudar" className="w-full block">
                  <button className="w-full py-4 bg-emerald-500 text-black font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl">
                    <Play size={14} fill="currentColor" />
                    Iniciar Estudo
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* STATUS SUMMARY */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border border-white/5 bg-white/[0.01]">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Total Decks</span>
                <span className="text-2xl font-black text-white tracking-tighter">{decks.length}</span>
              </div>
              <div className="p-6 border border-white/5 bg-white/[0.01]">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Cards Ativos</span>
                <span className="text-2xl font-black text-white tracking-tighter">{cards.length}</span>
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

            {/* --- ANCORA: MEUS DECKS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {decks.map((deck) => {
                const deckCards = cards.filter(c => c.deck === deck.name || c.deck === deck.id);
                return (
                  <motion.div 
                    key={deck.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      setViewingDeck(deck);
                      setSearchTerm('');
                    }}
                    className={`p-6 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all flex flex-col gap-6 group cursor-pointer relative ${
                      activeMenuId === deck.id ? 'z-[60] border-emerald-500/20' : 'z-auto'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className="relative group/play">
                          <div className="w-12 h-12 flex items-center justify-center border border-white/5 bg-slate-900 group-hover:border-emerald-500/50 transition-colors">
                            <Layers size={20} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                          </div>
                          {/* BOTÃO PLAY SOBREPOSTO (HOVER) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deckCards.length > 0) {
                                router.push(`/app/estudar?deck=${deck.id}`);
                              }
                            }}
                            className={`absolute inset-0 w-full h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-all scale-75 group-hover/play:scale-100 cursor-pointer ${deckCards.length === 0 ? 'cursor-not-allowed opacity-0 group-hover/play:opacity-40 grayscale' : ''}`}
                            title={deckCards.length > 0 ? "Iniciar Estudo" : "Adicione cards primeiro"}
                          >
                            <Play size={18} fill="black" className="text-black ml-1" />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-black text-white text-sm uppercase tracking-tight">{deck.name}</h4>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{deckCards.length} CARDS</span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === deck.id ? null : deck.id);
                          }}
                          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
                          title="Opções do Baralho"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {activeMenuId === deck.id && (
                          <div 
                            ref={menuRef}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-zinc-800 shadow-2xl z-[110] py-2 overflow-hidden"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingDeck(deck);
                                setSearchTerm('');
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-zinc-900 transition-all border-b border-zinc-800/50"
                            >
                              <ArrowRight size={12} /> Editar Cards
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDeck(deck);
                                setNewDeckName(deck.name);
                                setIsRenameModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-900 transition-all border-b border-zinc-800/50"
                            >
                              <Edit2 size={12} /> Renomear
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDeck(deck);
                                setIsDeleteModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-zinc-900 transition-all"
                            >
                              <Trash2 size={12} /> Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FOOTER DO CARD */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${deckCards.length > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`} />
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{deckCards.length > 0 ? 'Ativo' : 'Vazio'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        Gerenciar <ArrowRight size={10} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                onClick={() => setIsModalOpen(true)}
                className="p-6 border border-dashed border-white/10 bg-transparent hover:border-emerald-500/50 transition-all flex items-center justify-center group cursor-pointer h-[88px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <Plus size={20} className="text-slate-700 group-hover:text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">Novo Baralho</span>
                </div>
              </motion.div>
            </div>
            {/* --- FIM ANCORA: MEUS DECKS --- */}

            {decks.length === 0 && !isLoading && (
              <div className="mt-12 p-12 border-2 border-dashed border-white/5 flex flex-col items-center text-center opacity-40">
                <BookOpen size={40} className="mb-6 text-slate-700" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-xs">
                  Ainda sem conteúdo. Comece criando seu primeiro baralho de estudos.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- ANCORA: LISTA_CARDS_DECK --- */}
      <AnimatePresence>
        {viewingDeck && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-[60] bg-[#050505] p-8 md:p-12 overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => {
                      setViewingDeck(null);
                      setSearchTerm('');
                      setIsCardModalOpen(false);
                      setIsEditCardModalOpen(false);
                    }}
                    className="p-3 border border-white/10 text-white hover:bg-white/5 transition-all"
                  >
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                  <div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Editor de Conteúdo</span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{viewingDeck.name}</h2>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-2xl justify-end">
                  {cards.filter(c => c.deck === viewingDeck.name || c.deck === viewingDeck.id).length > 0 && (
                    <button 
                      onClick={() => router.push(`/app/estudar?deck=${viewingDeck.id}`)}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 text-black px-6 py-4 rounded-none font-black text-[10px] tracking-widest uppercase hover:bg-emerald-400 transition-all shadow-xl"
                    >
                      <Play size={14} fill="currentColor" />
                      INICIAR ESTUDO
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setNewCardData({ ...newCardData, deckName: viewingDeck.name });
                      setIsCardModalOpen(true);
                    }}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-6 py-4 rounded-none font-black text-[10px] tracking-widest uppercase hover:bg-emerald-500 transition-all shadow-xl"
                  >
                    <Plus size={14} strokeWidth={3} />
                    ADICIONAR NOVO CARD
                  </button>
                  <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="BUSCAR CARDS NESTE DECK..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-white font-bold uppercase tracking-widest text-xs outline-none focus:border-emerald-500/50 h-[52px]"
                    />
                  </div>
                </div>
              </header>

              <div className="space-y-4">
                {cards
                  .filter(c => (c.deck === viewingDeck.name || c.deck === viewingDeck.id) && 
                    (c.front.toLowerCase().includes(searchTerm.toLowerCase()) || c.back.toLowerCase().includes(searchTerm.toLowerCase())))
                  .map(card => (
                    <div key={card.id} className="p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 block">INGLÊS</span>
                          <p className="text-white font-black uppercase text-lg tracking-tight">{card.front}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 block">PORTUGUÊS</span>
                          <p className="text-emerald-500 font-bold uppercase text-lg tracking-tight">{card.back}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* CRONÔMETRO / STATUS */}
                        <div className={`flex items-center gap-2 px-4 py-2 border border-white/5 ${getTimeLeft(card).bg}`}>
                          {card.isMemorized ? (
                             <Check size={12} className="text-emerald-500" strokeWidth={4} />
                          ) : (
                             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${getTimeLeft(card).color.replace('text-', 'bg-')}`} />
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest ${getTimeLeft(card).color}`}>
                            {getTimeLeft(card).text}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingCard(card);
                            setIsEditCardModalOpen(true);
                          }}
                          className="p-3 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-3 bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 hover:border-red-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                
                {cards.filter(c => (c.deck === viewingDeck.name || c.deck === viewingDeck.id)).length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 opacity-20">
                     <Layers size={48} className="mx-auto mb-4 text-slate-500" />
                     <p className="text-xs font-black uppercase tracking-widest text-slate-500">Este baralho está vazio.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- FIM ANCORA: LISTA_CARDS_DECK --- */}

      {/* --- MODAIS --- */}
      <AnimatePresence>
        
        {/* MODAL: NOVO DECK */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-emerald-500/20 p-8 rounded-none shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Criar Baralho</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateDeck} className="space-y-6">
                <div>
                  <label className="block text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3">Nome da Coleção</label>
                  <input autoFocus type="text" value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} placeholder="EX: PHRASAL VERBS..." className="w-full bg-white/5 border border-white/10 p-4 text-white font-bold uppercase tracking-widest focus:border-emerald-500/50 outline-none transition-colors" />
                </div>
                <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black text-xs tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all">Salvar Baralho</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL: RENOMEAR DECK */}
        {isRenameModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-emerald-500/20 p-8 rounded-none shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Renomear</h2>
                <button onClick={() => setIsRenameModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleRename} className="space-y-6">
                <div>
                  <label className="block text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3">Novo Nome</label>
                  <input autoFocus type="text" value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-white font-bold uppercase tracking-widest focus:border-emerald-500/50 outline-none transition-colors" />
                </div>
                <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black text-xs tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all">Atualizar</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL: EXCLUIR DECK (CONFIRMAÇÃO) */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-red-500/30 p-10 rounded-none shadow-2xl text-center"
            >
              <div className="p-4 bg-red-500/10 border border-red-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Excluir "{activeDeck?.name}"?</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                Esta ação é irreversível. Todos os cards deste baralho serão permanentemente apagados.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} className="w-full py-4 bg-red-600 text-white font-black text-xs tracking-[0.2em] uppercase hover:bg-red-500 transition-all">Confirmar Exclusão</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-white/5 text-white/40 font-black text-xs tracking-[0.2em] uppercase hover:text-white transition-all">Manter Baralho</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: NOVO CARD */}
        {isCardModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-emerald-500/20 p-10 rounded-none shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Adicionar Flashcard</h2>
                <button onClick={() => setIsCardModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreateCard} className="space-y-8">
                {decks.length === 0 ? (
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-4 block">Primeiro Passo Necessário</span>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Dê um nome ao seu primeiro Baralho</label>
                    <input autoFocus type="text" value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} placeholder="EX: FRASES DO DIA..." className="w-full bg-white/5 border border-white/10 p-4 text-white font-bold uppercase tracking-widest outline-none focus:border-emerald-500/50" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Selecione o Baralho</label>
                    <DeckSelector 
                      decks={decks}
                      selectedDeckName={viewingDeck ? viewingDeck.name : newCardData.deckName}
                      onSelect={(name) => setNewCardData({...newCardData, deckName: name})}
                      disabled={!!viewingDeck}
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">INGLÊS</label>
                      <input autoFocus type="text" value={newCardData.front} onChange={(e) => setNewCardData({...newCardData, front: e.target.value})} placeholder="INGLÊS" className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-bold uppercase tracking-widest outline-none focus:border-emerald-500/40" />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">PORTUGUÊS</label>
                      <input type="text" value={newCardData.back} onChange={(e) => setNewCardData({...newCardData, back: e.target.value})} placeholder="PORTUGUÊS" className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-bold uppercase tracking-widest outline-none focus:border-emerald-500/40" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">TÉCNICA DE MEMORIZAÇÃO</label>
                    <textarea rows={3} value={newCardData.association} onChange={(e) => setNewCardData({...newCardData, association: e.target.value})} placeholder="Dica mental para não esquecer..." className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-bold uppercase tracking-widest outline-none focus:border-emerald-500/40 resize-none h-24" />
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-white text-black font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-500 transition-all shadow-xl flex items-center justify-center gap-3">
                  Salvar Flashcard <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL: EDITAR CARD INDIVIDUAL */}
        {isEditCardModalOpen && editingCard && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-emerald-500/20 p-10 rounded-none shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Editar Flashcard</h2>
                <button onClick={() => setIsEditCardModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleUpdateCard} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">INGLÊS</label>
                    <input 
                      type="text" 
                      value={editingCard.front} 
                      onChange={(e) => setEditingCard({...editingCard, front: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-black uppercase tracking-widest outline-none focus:border-emerald-500/40" 
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">PORTUGUÊS</label>
                    <input 
                      type="text" 
                      value={editingCard.back} 
                      onChange={(e) => setEditingCard({...editingCard, back: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-black uppercase tracking-widest outline-none focus:border-emerald-500/40" 
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">Técnica de Memorização</label>
                    <textarea 
                      rows={3} 
                      value={editingCard.association || ''} 
                      onChange={(e) => setEditingCard({...editingCard, association: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-bold uppercase tracking-widest outline-none focus:border-emerald-500/40 resize-none h-24" 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-emerald-500 text-black font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-400 transition-all shadow-xl">
                  ATUALIZAR CARD
                </button>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
