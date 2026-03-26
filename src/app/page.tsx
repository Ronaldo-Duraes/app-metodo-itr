'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 font-outfit relative overflow-hidden">
      
      {/* GRADIENTE SUTIL DE FUNDO PURPLE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BC13FE]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#BC13FE]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10 flex flex-col items-center gap-8"
      >
        {/* LOGO ORIGINAL SEM FILTROS */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
           <Image 
             src='/logo-itr.png' 
             alt='Logo ITR' 
             fill
             priority
             className='object-contain transition-transform hover:scale-105 duration-500' 
           />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#BC13FE]/60 mb-8 block">
            Ambiente de Elite
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6"
              style={{ 
                color: '#BC13FE',
                textShadow: '0 0 15px #BC13FE, 0 0 30px #BC13FE'
              }}>
            Boas-vindas
          </h1>
          <p className="text-zinc-500 text-sm md:text-lg max-w-lg mx-auto font-bold leading-relaxed uppercase tracking-widest">
            Sua evolução começa no menu lateral.
          </p>
        </div>
      </motion.div>

      {/* DETALHE DE LINHA DECORATIVA PURPLE */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-[#BC13FE]/40 to-transparent" />

    </div>
  );
}
