'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Award, Zap, ExternalLink, User } from 'lucide-react';
import Image from 'next/image';

interface MentorCardProps {
  onClose?: () => void;
  isModal?: boolean;
}

const MentorCard = ({ onClose, isModal = false }: MentorCardProps) => {
  return (
    <motion.div
      initial={isModal ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0a0a0a] shadow-2xl ${
        isModal ? 'max-w-md w-full p-8' : 'w-full p-6'
      }`}
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-[60px]" />

      {/* HEADER / RANK */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Shield size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Mestre ITR</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={10} className="fill-emerald-500 text-emerald-500" />
          ))}
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-emerald-500/30 p-1.5 bg-gradient-to-tr from-emerald-500/20 to-transparent">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10">
              <User size={48} className="text-slate-700" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg border-2 border-[#0a0a0a]">
            <Zap size={14} className="text-black fill-black" />
          </div>
        </div>

        <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">
          Ronaldo Duraes
        </h3>
        <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-6 opaticy-80">
          Fundador • Mentor de Elite
        </p>

        {/* STATS MINI GRID */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
            <Award size={18} className="text-emerald-400 mb-2" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Alunos</span>
            <span className="text-lg font-black text-white">+1.200</span>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
            <Zap size={18} className="text-emerald-400 mb-2" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Impacto</span>
            <span className="text-lg font-black text-white">Global</span>
          </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed italic mb-8 font-medium">
          "A fluência não é sobre perfeição gramatical, é sobre liberdade e conexão real."
        </p>

        {/* CTA BUTTON */}
        <button className="w-full group flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] transition-all rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_45px_rgba(16,185,129,0.5)]">
          Falar com Mentor
          <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>

        {isModal && onClose && (
          <button 
            onClick={onClose}
            className="mt-6 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            Fechar Janela
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MentorCard;
