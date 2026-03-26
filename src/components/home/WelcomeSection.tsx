'use client';

import React from 'react';
import { motion } from 'framer-motion';

const WelcomeSection = () => {
  return (
    <>
      {/* --- ANCORA: WELCOME --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center relative z-10 flex flex-col items-center"
      >
        <div className="flex flex-col items-center">
          <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[1.2rem] text-white mb-10 block drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
            Ambiente de Elite
          </span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-10 bg-gradient-to-b from-[#4B0082] via-[#BC13FE] to-[#E0B0FF] bg-clip-text text-transparent drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)] px-4">
            Boas-vindas
          </h1>
          <p className="text-zinc-400 text-[10px] md:text-xs max-w-lg mx-auto font-bold leading-relaxed uppercase tracking-[0.6em]">
            Sua evolução começa no menu lateral.
          </p>
        </div>
      </motion.div>
      {/* --- FIM ANCORA: WELCOME --- */}
    </>
  );
};

export default WelcomeSection;
