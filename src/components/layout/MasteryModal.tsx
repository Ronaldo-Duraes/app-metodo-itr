'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, CheckCircle2 } from 'lucide-react';

interface MasteryModalProps {
  milestone: number;
  onClose: () => void;
}

const MasteryModal = ({ milestone, onClose }: MasteryModalProps) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-hidden">
      {/* Background Particles/Sparkles simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: -100,
              x: Math.random() * 400 - 200
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
            className="absolute left-1/2 bottom-0 w-1 h-1 bg-yellow-500 rounded-full"
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 40 }}
        className="w-full max-w-lg bg-[#050505] border-2 border-yellow-500/40 p-12 rounded-none shadow-[0_0_100px_rgba(234,179,8,0.2)] relative text-center"
      >
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 60, delay: 0.2 }}
            className="w-32 h-32 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(234,179,8,0.6)]"
          >
            <Trophy size={60} className="text-black" strokeWidth={2.5} />
          </motion.div>

          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] font-black text-yellow-500 tracking-[0.6em] uppercase mb-4 block"
          >
            Conquista Lendária
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-6"
          >
            MARCO DE MAESTRIA<br/>Alcançado!
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-slate-400 text-sm font-medium tracking-wide mb-12 max-w-xs mx-auto leading-relaxed"
          >
            Você agora domina <span className="text-white font-black">{milestone}</span> conceitos na sua jornada para a fluência total.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={onClose}
            className="group relative w-full py-6 uppercase font-black text-xs tracking-[0.4em] text-black overflow-hidden"
          >
            {/* Shimmer Button Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 transition-all group-hover:brightness-110" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
            
            <span className="relative z-10 flex items-center justify-center gap-3">
               REIVINDICAR MAESTRIA
               <Star size={14} fill="currentColor" />
            </span>
          </motion.button>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MasteryModal;
