'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function ITRModal() {
  const { activeModal, hideModal } = useUI();

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={hideModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#050505] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] p-8 rounded-[2rem] font-outfit overflow-hidden"
        >
          {/* Shimmer effect border top */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          {/* Icon Header */}
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                {activeModal.isConfirm ? (
                   <CheckCircle2 className="text-emerald-500" size={32} />
                ) : (
                   <AlertCircle className="text-emerald-500" size={32} />
                )}
             </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-white text-xl font-black uppercase tracking-tighter mb-4 leading-tight">
              {activeModal.title}
            </h2>
            <div className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto whitespace-pre-line">
              {activeModal.message}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             {activeModal.isConfirm ? (
                <>
                   <button 
                     onClick={() => { activeModal.onConfirm?.(); hideModal(); }}
                     className="w-full py-4 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-95"
                   >
                     {activeModal.confirmText || 'Confirmar'}
                   </button>
                   <button 
                     onClick={hideModal}
                     className="w-full py-4 bg-transparent text-slate-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:text-white transition-all"
                   >
                     Cancelar
                   </button>
                </>
             ) : (
                <button 
                  onClick={hideModal}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all active:scale-95"
                >
                  Entendido
                </button>
             )}
          </div>

          {/* Close button top right */}
          <button 
            onClick={hideModal}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Subtle logo texture */}
          <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
             <img src="/logo-itr.png" alt="" className="w-32 h-32 transform rotate-12 grayscale" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
