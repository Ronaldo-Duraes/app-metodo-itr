'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center font-outfit">
      <div className="max-w-md w-full border border-white/10 bg-white/[0.02] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MapPinOff size={40} className="text-white" />
        </div>
        
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">404: Rota não encontrada</h1>
        <p className="text-slate-500 uppercase font-bold tracking-widest mb-10 text-xs leading-relaxed">
          Você se desviou do protocolo original. Retorne ao QG.
        </p>

        <Link href="/app">
          <button
            className="flex items-center gap-3 bg-white text-black px-8 py-4 mx-auto font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Retornar
          </button>
        </Link>
      </div>
    </div>
  );
}
