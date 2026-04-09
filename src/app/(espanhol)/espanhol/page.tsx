'use client';
 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCards, getPriorityCards } from '@/lib/srs';
import { Play, Zap, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Flashcard } from '@/lib/types';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function HomePageES() {
  const router = useRouter();
  const { executeProtectedAction } = useRoleGuard();
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [isInverted, setIsInverted] = useState(false);
 
  useEffect(() => {
    setAllCards(getCards());
    setIsInverted(localStorage.getItem('itr_espanhol_invert_cards') === 'true');
  }, []);

  const toggleInvert = () => {
    const newVal = !isInverted;
    setIsInverted(newVal);
    localStorage.setItem('itr_espanhol_invert_cards', String(newVal));
  };

  const priorityCards = React.useMemo(() => {
    return getPriorityCards(allCards);
  }, [allCards]);

  const pendingCount = priorityCards.length;
  const activeCount = allCards.filter(c => !c.isMemorized).length;
  const memorizedCount = allCards.filter(c => c.isMemorized).length;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center py-2 md:py-8 md:pt-0 md:pb-16 font-outfit relative overflow-hidden">
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[180px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl px-3 md:px-8 mx-auto flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          {/* CABEÇALHO SUTIL */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-5 md:mb-12 border-l-4 border-orange-500 pl-3 md:pl-6 gap-3 md:gap-0">
            <div>
              <span className="text-[9px] md:text-[10px] font-black text-orange-500/50 tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-1 md:mb-2">Workspace Principal</span>
              <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter">Panel de Maestría</h2>
            </div>
            
            {/* TOGGLE INVERSÃO */}
            <button 
              onClick={toggleInvert}
              className="flex items-center gap-2 group bg-black/40 p-2 md:p-3 border border-white/5 rounded-xl md:rounded-2xl transition-all w-full md:w-auto min-h-[44px] md:min-h-0"
              title="Invertir Flashcards: Mostrar Español primero"
            >
              <div className={`w-10 h-5 md:w-10 md:h-5 rounded-full p-1 transition-colors flex items-center shrink-0 ${isInverted ? 'bg-orange-500' : 'bg-white/10'}`}>
                <div className={`w-3.5 h-3.5 md:w-3.5 md:h-3.5 rounded-full bg-white shadow-md transform transition-transform ${isInverted ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="text-[9px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors text-left flex-1 md:flex-none">
                <span className={`${isInverted ? 'text-orange-500' : ''}`}>Invertir: ES</span> <span className="opacity-50">→</span> PT
              </span>
            </button>
          </div>

          {/* AÇÃO PRIORITÁRIA BUTTON / EMPTY STATE */}
          <div id="tour-acao-prioritaria" className="w-full">
            {pendingCount > 0 ? (
              <div className="w-full text-center">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => executeProtectedAction(() => router.push('/espanhol/estudar?mode=srs'))}
                  className="w-full cursor-pointer text-left"
                >
                  <div className="w-full relative p-5 md:p-10 border-2 border-orange-500/50 bg-white/[0.02] backdrop-blur-xl hover:bg-orange-500/5 hover:border-orange-400 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.6)] group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Zap size={48} className="text-orange-500" />
                    </div>
                    
                    <div className="flex flex-col items-start text-left relative z-10">
                      <span className="text-[10px] font-black text-orange-500 tracking-[0.4em] uppercase mb-4">Acción Prioritaria</span>
                      <h2 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-8 tracking-tighter uppercase leading-tight group-hover:text-amber-500 transition-colors">
                        Revisar Ahora
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6 md:mb-10">
                        <div className="px-4 md:px-5 py-2 bg-amber-500 text-black text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                          {pendingCount} Pendientes
                        </div>
                        <div className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase italic hidden md:block">
                          Time to Elite
                        </div>
                      </div>

                      <div className="w-full h-12 md:h-14 bg-orange-500 flex items-center justify-center gap-2 md:gap-3 group-hover:bg-orange-400 transition-all min-h-[48px] shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.4),_0_0_40px_rgba(249,115,22,0.8)]">
                        <Play size={16} fill="black" stroke="black" />
                        <span className="text-black font-black text-[11px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase">Iniciar Sesión</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="w-full p-6 md:p-16 border-2 border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center">
                <div className="mb-8 p-6 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                  <CheckCircle2 size={48} className="text-orange-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-3">
                  ¡Todo al día!
                </h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
                  Tu vocabulario está consolidado.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-12 flex items-center justify-center gap-6 md:gap-12 border-t border-white/5 pt-6 md:pt-12 w-full">
            <div className="text-center">
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-2">Cartas Activas</span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{activeCount}</h3>
            </div>
            <div className="text-center">
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-2">Memorizadas</span>
              <h3 className="text-3xl md:text-4xl font-black text-yellow-500 tracking-tighter drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]">{memorizedCount}</h3>
            </div>
          </div>

          <div className="mt-6 md:mt-12 text-center opacity-10 hover:opacity-100 transition-opacity cursor-default w-full">
            <p className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.5em] md:tracking-[1em]">Sistema SRS de Elite v2.2 - ES</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
