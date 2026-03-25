'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o Dashboard após uma breve animação
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 overflow-hidden">
      <div className="relative text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-outfit font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-[length:200%_auto] animate-gradient">
                Método ITR
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium tracking-wide flex items-center justify-center gap-3">
              <span className="w-12 h-[1px] bg-slate-800" />
              INGLÊS DE ALTO NÍVEL
              <span className="w-12 h-[1px] bg-slate-800" />
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 text-emerald-400/80 font-bold tracking-widest text-xs uppercase bg-emerald-500/5 px-6 py-3 rounded-full border border-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Iniciando sua plataforma...
            </div>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
            />
          </div>
        </motion.div>

        {/* Floating Particles Simulation */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{ 
                x: Math.random() * 800 - 400, 
                y: Math.random() * 400 - 200,
                opacity: 0 
              }}
              animate={{ 
                y: [0, -100],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 2 + 1, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
