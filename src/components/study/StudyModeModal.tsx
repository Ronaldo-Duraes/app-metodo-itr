'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ZapOff } from 'lucide-react';
import { playBlipSound } from '@/lib/srs';

interface StudyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mode: 'srs' | 'manual') => void;
  title?: string;
}

export default function StudyModeModal({ isOpen, onClose, onSelect, title = "O que vamos treinar hoje?" }: StudyModeModalProps) {
  if (!isOpen) return null;

  const handleSelect = (mode: 'srs' | 'manual') => {
    playBlipSound();
    onSelect(mode);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-emerald-500/20 p-8 md:p-12 relative shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-12">
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Configuração de Foco</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight italic">
            {title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* MODO SRS */}
          <button 
            onClick={() => handleSelect('srs')}
            className="group p-8 border-2 border-emerald-500/30 bg-white/[0.02] hover:bg-emerald-500/10 hover:border-emerald-500 transition-all flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <ShieldCheck size={48} className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-xl font-black text-white uppercase mb-2 relative z-10">SRS Inteligente</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed relative z-10">
              Recomendado. Usa o algoritmo ITR para memorização definitiva e salvar seu progresso.
            </p>
          </button>

          {/* MODO MANUAL */}
          <button 
            onClick={() => handleSelect('manual')}
            className="group p-8 border-2 border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/30 transition-all flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <ZapOff size={48} className="text-slate-500 mb-6 group-hover:scale-110 transition-transform group-hover:text-white relative z-10" />
            <h3 className="text-xl font-black text-white uppercase mb-2 relative z-10">Modo Manual</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed relative z-10">
              Para revisão rápida sem alteração técnica. Não salva dados no banco de dados.
            </p>
          </button>
        </div>

        <p className="mt-12 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
          Protocolo de Elite ITR • v2.2
        </p>
      </motion.div>
    </div>
  );
}
