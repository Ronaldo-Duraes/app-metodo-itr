'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center font-outfit">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border border-red-500/20 bg-red-500/5 p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Algo falhou</h1>
        <p className="text-slate-500 uppercase font-bold tracking-widest mb-10 text-xs leading-relaxed">
          Ocorreu um erro inesperado no sistema. Tente reiniciar o motor.
        </p>

        <button
          onClick={() => reset()}
          className="flex items-center gap-3 bg-red-500 text-white px-8 py-4 mx-auto font-black text-xs tracking-widest uppercase hover:bg-red-400 transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <RotateCcw size={16} />
          Reiniciar Sistema
        </button>
      </motion.div>
    </div>
  );
}
