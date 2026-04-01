'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown, ShieldCheck, HelpCircle } from 'lucide-react';
import { startTour } from '@/lib/tour';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleStartTour = () => {
    // Redireciona para a home antes de iniciar para garantir elementos visíveis
    if (typeof window !== 'undefined' && window.location.pathname !== '/app') {
       router.push('/app');
       setTimeout(() => startTour(), 800);
    } else {
       startTour();
    }
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-20 z-[50] px-8 flex items-center justify-end bg-black/20 backdrop-blur-md border-b border-white/5 gap-6">
      {/* Botão de Ajuda (Tour Manual) */}
      <button 
        onClick={handleStartTour}
        className="p-3 text-yellow-500/50 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all rounded-full flex items-center justify-center group"
        title="Iniciar Tour de Boas-vindas"
      >
        <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-2 rounded-full hover:bg-white/5 transition-all group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white uppercase tracking-tighter">
              Olá, {profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || ''}
            </p>
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none mt-1 opacity-80">
                {profile?.role === 'admin' ? 'Administrador' : profile?.role === 'aluno' ? 'Aluno ITR' : 'Visitante'}
            </p>
          </div>
          
          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-900 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
            {user.photoURL || profile?.photoURL ? (
              <img src={user.photoURL || profile?.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                {profile?.displayName?.slice(0, 2).toUpperCase() || user?.displayName?.slice(0, 2).toUpperCase() || <User size={18} className="text-zinc-500" />}
              </span>
            )}
          </div>
          
          <ChevronDown size={14} className={`text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[-1]"
              />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-60 bg-zinc-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 font-outfit z-[100]"
              >
                <div className="p-4 border-b border-white/5 mb-2">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 opacity-50 text-[8px]">Sessão Ativa</p>
                   <p className="text-[11px] font-bold text-white truncate">{user.email}</p>
                </div>
                
                <button 
                  onClick={() => { setIsOpen(false); router.push('/app/perfil'); }}
                  className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <User size={14} /> Meu Perfil
                </button>
                
                {profile?.role === 'admin' && (
                  <button 
                    onClick={() => { setIsOpen(false); router.push('/admin'); }}
                    className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-all text-left"
                  >
                    <ShieldCheck size={14} /> Painel de Controle
                  </button>
                )}

                <div className="h-[1px] bg-white/5 my-2" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest text-left mt-2 group"
                >
                  <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                  Sair da Conta
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
