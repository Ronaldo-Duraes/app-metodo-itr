'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ResetSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sprintNumber: number;
}

export default function ResetSprintModal({ isOpen, onClose, onConfirm, sprintNumber }: ResetSprintModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-emerald-500/20 rounded-2xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            
            {/* Header Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="text-red-500" size={32} />
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">
                Resetar progresso da <span className="text-emerald-500">Sprint {sprintNumber}</span>?
              </h2>

              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-10 max-w-[280px]">
                Isso removerá as palavras deste bloco do seu ciclo de estudos atual. Esta ação não pode ser desfeita.
              </p>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full py-4 bg-red-500 hover:bg-red-400 text-black font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95"
                >
                  CONFIRMAR RESET
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
                >
                  CANCELAR
                </button>
              </div>
            </div>

            {/* Subtle Close 'X' */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-700 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
