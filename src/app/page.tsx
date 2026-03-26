import React from 'react';
import { motion } from 'framer-motion';
import WelcomeSection from '@/components/home/WelcomeSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 font-outfit relative">
      
      {/* Background Isolation Group */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* GRADIENTE SUTIL DE FUNDO PURPLE (Ainda mais sutil) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BC13FE]/5 blur-[180px] rounded-full" />
        
        {/* DETALHE DE LINHA DECORATIVA PURPLE */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-[#BC13FE]/20 to-transparent" />
      </div>

      <WelcomeSection />

    </div>
  );
}
