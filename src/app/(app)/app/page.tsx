'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WelcomeSection from '@/components/home/WelcomeSection';
import { getCards, getPriorityCards } from '@/lib/srs';
import { Flashcard } from '@/lib/types';
import { Play, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const cards = getCards();
    const priority = getPriorityCards(cards);
    setPendingCount(priority.length);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden">
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full" />
      </div>

      <WelcomeSection />

      {/* AÇÃO PRIORITÁRIA BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 w-full max-w-sm"
      >
        <Link href="/app/estudar">
          <button className="w-full group relative p-8 border-2 border-emerald-500 bg-white/[0.02] backdrop-blur-xl hover:bg-emerald-500/10 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Zap size={32} className="text-emerald-500" />
            </div>
            
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase mb-4">Ação Prioritária</span>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase leading-tight">
                Revisar Agora
              </h2>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black tracking-widest uppercase">
                  {pendingCount} Pendentes
                </div>
                <div className="text-white/40 text-[10px] font-bold tracking-widest uppercase italic">
                  Time to Elite
                </div>
              </div>

              <div className="w-full h-12 bg-emerald-500 flex items-center justify-center gap-3 group-hover:bg-emerald-400 transition-colors">
                <Play size={14} fill="black" />
                <span className="text-black font-black text-xs tracking-[0.2em] uppercase">Iniciar Sessão</span>
              </div>
            </div>
          </button>
        </Link>
      </motion.div>

    </div>
  );
}
