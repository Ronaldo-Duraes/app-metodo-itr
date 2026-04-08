'use client';
 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCards, getPriorityCards } from '@/lib/srs';
import { Play, Zap, CheckCircle2, Shield, Book, BookOpen as BookIcon, Video, Lightbulb, ExternalLink, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Flashcard } from '@/lib/types';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useAuth } from '@/context/AuthContext';

const CAKTO_CHECKOUT = 'https://pay.cakto.com.br/36u8zua_785324';
const CAKTO_MEMBERS = 'https://aluno.cakto.com.br/app/courses/cmm3k0qt50006jp04z4cjcg0m/view?lesson=cmm3k0qvk0009jp04jm12m6ac';

export default function HomePage() {
  const router = useRouter();
  const { executeProtectedAction, isAluno } = useRoleGuard();
  const { user, profile, isVisitor } = useAuth();
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [isInverted, setIsInverted] = useState(false);
 
  useEffect(() => {
    setAllCards(getCards());
    setIsInverted(localStorage.getItem('itr_invert_cards') === 'true');
  }, []);

  const toggleInvert = () => {
    const newVal = !isInverted;
    setIsInverted(newVal);
    localStorage.setItem('itr_invert_cards', String(newVal));
  };

  const priorityCards = React.useMemo(() => {
    return getPriorityCards(allCards);
  }, [allCards]);

  const pendingCount = priorityCards.length;
  const activeCount = allCards.filter(c => !c.isMemorized).length;
  const memorizedCount = allCards.filter(c => c.isMemorized).length;

  // Redirect inteligente: aluno → members, outros → checkout
  const handleCourseRedirect = () => {
    if (isAluno) {
      window.open(CAKTO_MEMBERS, '_blank');
    } else if (isVisitor) {
      router.push('/login');
    } else {
      window.open(CAKTO_CHECKOUT, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center py-2 md:py-8 md:pt-0 md:pb-16 font-outfit relative overflow-hidden">
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl px-3 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
        
        {/* LEFT COLUMN: MAIN ACTIONS (70%) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-8 flex flex-col items-center"
        >
          {/* CABEÇALHO SUTIL */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-5 md:mb-12 border-l-4 border-emerald-500 pl-3 md:pl-6 gap-3 md:gap-0">
            <div>
              <span className="text-[9px] md:text-[10px] font-black text-emerald-500/50 tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-1 md:mb-2">Workspace Principal</span>
              <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter">Painel de Maestria</h2>
            </div>
            
            {/* TOGGLE INVERSÃO */}
            <button 
              onClick={toggleInvert}
              className="flex items-center gap-2 group bg-black/40 p-2 md:p-3 border border-white/5 rounded-xl md:rounded-2xl transition-all w-full md:w-auto min-h-[44px] md:min-h-0"
              title="Inverter Flashcards: Mostrar Português primeiro"
            >
              <div className={`w-10 h-5 md:w-10 md:h-5 rounded-full p-1 transition-colors flex items-center shrink-0 ${isInverted ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`w-3.5 h-3.5 md:w-3.5 md:h-3.5 rounded-full bg-white shadow-md transform transition-transform ${isInverted ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="text-[9px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors text-left flex-1 md:flex-none">
                <span className={`${isInverted ? 'text-emerald-500' : ''}`}>Inverter: PT</span> <span className="opacity-50">→</span> EN
              </span>
            </button>
          </div>

          {/* AÇÃO PRIORITÁRIA BUTTON / EMPTY STATE */}
          <div id="tour-acao-prioritaria" className="w-full">
            {pendingCount > 0 ? (
              <div className="w-full text-center">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => executeProtectedAction(() => router.push('/app/estudar?mode=srs'))}
                  className="w-full cursor-pointer text-left"
                >
                  <div className="w-full relative p-5 md:p-10 border-2 border-emerald-500/50 bg-white/[0.02] backdrop-blur-xl hover:bg-emerald-500/5 hover:border-emerald-400 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.6)] group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Zap size={48} className="text-emerald-500" />
                    </div>
                    
                    <div className="flex flex-col items-start text-left relative z-10">
                      <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase mb-4">Ação Prioritária</span>
                      <h2 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-8 tracking-tighter uppercase leading-tight group-hover:text-amber-500 transition-colors">
                        Revisar Agora
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6 md:mb-10">
                        <div className="px-4 md:px-5 py-2 bg-amber-500 text-black text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                          {pendingCount} Pendentes
                        </div>
                        <div className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase italic hidden md:block">
                          Time to Elite
                        </div>
                      </div>

                      <div className="w-full h-12 md:h-14 bg-emerald-500 flex items-center justify-center gap-2 md:gap-3 group-hover:bg-emerald-400 transition-all min-h-[48px] shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.4),_0_0_40px_rgba(16,185,129,0.8)]">
                        <Play size={16} fill="black" stroke="black" />
                        <span className="text-black font-black text-[11px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase">Iniciar Sessão</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="w-full p-6 md:p-16 border-2 border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center">
                <div className="mb-8 p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-3">
                  Tudo em dia!
                </h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
                  Seu vocabulário está consolidado.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-12 flex items-center justify-center gap-6 md:gap-12 border-t border-white/5 pt-6 md:pt-12 w-full">
            <div className="text-center">
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-2">Cards Ativos</span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{activeCount}</h3>
            </div>
            <div className="text-center">
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-2">Memorizadas</span>
              <h3 className="text-3xl md:text-4xl font-black text-yellow-500 tracking-tighter drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]">{memorizedCount}</h3>
            </div>
          </div>

          <div className="mt-6 md:mt-12 text-center opacity-10 hover:opacity-100 transition-opacity cursor-default w-full">
            <p className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.5em] md:tracking-[1em]">Sistema SRS de Elite v2.2</p>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: ARSENAL ITR (30%) — SEM CARD "OLÁ" */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          {/* ARSENAL BUTTON CARD — AGORA NO TOPO */}
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-yellow-500 opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-700 -z-10" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-shimmer" />
            
            <div id="tour-arsenal" className="bg-[#0a0a0a] border border-yellow-500/30 p-4 md:p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.4)] hover:border-yellow-500/60 transition-colors">
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
                <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <Shield size={24} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter leading-none">Arsenal ITR</h3>
                  <span className="text-[9px] font-black text-yellow-500 tracking-[0.3em] uppercase">Acesso Rápido</span>
                </div>
              </div>

              {/* RESOURCE LIST */}
              <div className="space-y-2">
                {[
                  { icon: Book, text: '+500 vocabulários essenciais', color: 'text-blue-500', link: '/app/vocabulary' },
                  { icon: CheckCircle2, text: 'Check List + Gramática no Inglês', color: 'text-emerald-500', link: '/app/grammar-checklist' },
                  { icon: BookIcon, text: '50 Gatilhos técnica do espelho', color: 'text-orange-500', link: '/app/mirror-triggers' },
                  { icon: Video, text: 'Ações para PAC', color: 'text-rose-500', link: '/app/pac-actions' },
                  { icon: Lightbulb, text: 'PROMPT - Para IA', color: 'text-yellow-500', link: '/app/prompts' },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => executeProtectedAction(() => router.push(item.link))}
                    className="flex items-center justify-between p-3 md:p-4 min-h-[48px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group/item cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className={`${item.color} group-hover/item:scale-110 transition-transform`} />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover/item:text-white transition-colors">
                        {item.text}
                      </span>
                    </div>
                    <ExternalLink size={12} className="text-slate-700 opacity-0 group-hover/item:opacity-100 transition-all" />
                  </div>
                ))}
              </div>

              {/* EXPLORAR ARSENAL */}
              <button 
                onClick={() => executeProtectedAction(() => router.push('/app/pac-actions'))}
                className="relative w-full mt-8 py-4 bg-slate-900 border border-yellow-500/40 overflow-hidden group/btn hover:border-yellow-500 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer-fast" />
                <span className="relative text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">
                  Explorar Arsenal Completo
                </span>
              </button>
            </div>
          </div>

          {/* ACESSAR CURSO - CARD PREMIUM */}
          <div 
            onClick={handleCourseRedirect}
            className="bg-[#0a0a0a] border border-emerald-500/20 p-5 md:p-8 flex items-center gap-4 md:gap-6 shadow-[0_0_50px_rgba(0,0,0,0.4)] cursor-pointer hover:border-emerald-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-5 w-full">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <GraduationCap size={28} className="text-emerald-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                  {isAluno ? 'Acessar Curso' : 'Conhecer o Método ITR'}
                </h4>
                <span className="text-[9px] font-black text-emerald-500/70 tracking-[0.2em] uppercase">
                  {isAluno ? 'Cakto Members' : 'Desbloqueie seu acesso'}
                </span>
              </div>
              <ExternalLink size={16} className="text-emerald-500/30 group-hover:text-emerald-500 transition-colors shrink-0" />
            </div>
          </div>

          {/* SESSÃO DE APOIO */}
          <div className="p-3 md:p-6 border border-white/5 bg-white/[0.01]">
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
