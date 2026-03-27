'use client';
 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCards, getPriorityCards } from '@/lib/srs';
import { Play, Zap, CheckCircle2, Shield, Book, BookOpen as BookIcon, Video, Lightbulb, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Flashcard } from '@/lib/types';

export default function HomePage() {
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
 
  useEffect(() => {
    // Carregar dados de cards
    setAllCards(getCards());
  }, []);

  const priorityCards = React.useMemo(() => {
    return getPriorityCards(allCards);
  }, [allCards]);

  const pendingCount = priorityCards.length;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center py-8 md:py-16 font-outfit relative overflow-hidden">
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: MAIN ACTIONS (70%) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-8 flex flex-col items-center"
        >
          {/* CABEÇALHO SUTIL (SEM POLUIÇÃO) */}
          <div className="text-left w-full mb-12 border-l-4 border-emerald-500 pl-6">
            <span className="text-[10px] font-black text-emerald-500/50 tracking-[0.4em] uppercase block mb-2">Workspace Principal</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Painel de Maestria</h2>
          </div>

          {/* AÇÃO PRIORITÁRIA BUTTON / EMPTY STATE */}
          {pendingCount > 0 ? (
            <Link href="/app/estudar" className="w-full">
              <button className="w-full group relative p-10 border-2 border-emerald-500/50 bg-white/[0.02] backdrop-blur-xl hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Zap size={48} className="text-emerald-500" />
                </div>
                
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase mb-4">Ação Prioritária</span>
                  <h2 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-tight group-hover:text-emerald-500 transition-colors">
                    Revisar Agora
                  </h2>
                  
                  <div className="flex items-center gap-6 mb-10">
                    <div className="px-5 py-2 bg-emerald-500 text-black text-[11px] font-black tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                      {pendingCount} Pendentes
                    </div>
                    <div className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase italic">
                      Time to Elite
                    </div>
                  </div>

                  <div className="w-full h-14 bg-emerald-500 flex items-center justify-center gap-3 group-hover:bg-emerald-400 transition-colors">
                    <Play size={16} fill="black" stroke="black" />
                    <span className="text-black font-black text-xs tracking-[0.3em] uppercase">Iniciar Sessão</span>
                  </div>
                </div>
              </button>
            </Link>
          ) : (
            <div className="w-full p-16 border-2 border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center">
              <div className="mb-8 p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                Tudo em dia!
              </h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
                Seu vocabulário está consolidado.
              </p>
            </div>
          )}

          <div className="mt-12 text-center opacity-10 hover:opacity-100 transition-opacity cursor-default w-full">
            <p className="text-[9px] font-black text-white uppercase tracking-[1em]">Sistema SRS de Elite v2.2</p>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: ARSENAL ITR (30%) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          {/* ARSENAL BUTTON CARD */}
          <div className="relative group overflow-hidden">
            {/* Animated Golden Border Effect */}
            <div className="absolute inset-0 bg-yellow-500 opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-700 -z-10" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-shimmer" />
            
            <div className="bg-[#0a0a0a] border border-yellow-500/30 p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.4)] hover:border-yellow-500/60 transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <Shield size={24} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Arsenal ITR</h3>
                  <span className="text-[9px] font-black text-yellow-500 tracking-[0.3em] uppercase">Acesso Rápido</span>
                </div>
              </div>

              {/* RESOURCE LIST */}
              <div className="space-y-2">
                {[
                  { icon: CheckCircle2, text: 'Check List + Gramática no Inglês', color: 'text-emerald-500', link: '/app/grammar-checklist' },
                  { icon: Book, text: '+500 vocabulários essenciais', color: 'text-blue-500', link: '#' },
                  { icon: BookIcon, text: '50 Gatilhos técnica do espelho', color: 'text-orange-500', link: '#' },
                  { icon: Video, text: 'Ações para PAC', color: 'text-rose-500', link: '#' },
                  { icon: Lightbulb, text: 'PROMPTS - Para IA', color: 'text-yellow-500', link: '#' },
                ].map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.link} 
                    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group/item"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className={`${item.color} group-hover/item:scale-110 transition-transform`} />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover/item:text-white transition-colors">
                        {item.text}
                      </span>
                    </div>
                    <ExternalLink size={12} className="text-slate-700 opacity-0 group-hover/item:opacity-100 transition-all" />
                  </a>
                ))}
              </div>

              {/* SHIMMERING CALL TO ACTION BUTTON */}
              <button className="relative w-full mt-8 py-4 bg-slate-900 border border-yellow-500/40 overflow-hidden group/btn hover:border-yellow-500 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer-fast" />
                <span className="relative text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">
                  Explorar Arsenal Completo
                </span>
              </button>
            </div>
          </div>

          {/* SESSÃO DE APOIO (OPCIONAL/DECORATIVA) */}
          <div className="p-6 border border-white/5 bg-white/[0.01]">
             <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest block mb-4 italic">Protocolo de Elite ITR v2.2</span>
             <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed tracking-wider">
               Recursos exclusivos para alunos do Método ITR. Sincronização vitalícia ativa.
             </p>
          </div>
        </motion.div>

      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite ease-in-out;
        }
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .group-hover\/btn\:animate-shimmer-fast {
          animation: shimmer-fast 1s infinite linear;
        }
      `}</style>
    </div>
  );
}
