'use client';

import Image from 'next/image';
import { Instagram, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * MentorCard Component
 * 
 * A premium, glassmorphism-styled card showcasing the mentor behind the Method.
 * Features a responsive layout (Desktop: Horizontal, Mobile: Vertical) with a 
 * "Black & Green Premium" aesthetic.
 * 
 * @returns JSX.Element
 */
export default function MentorCard() {
  const WHATSAPP_LINK = 'https://wa.me/5511999999999'; // TODO: Update with actual mentor number
  const INSTAGRAM_LINK = 'https://instagram.com/im.ronaldod';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto overflow-hidden bg-[#0a0a0a] border border-emerald-500/20 rounded-[2rem] shadow-2xl shadow-emerald-950/20 group hover:border-emerald-500/40 transition-all duration-500"
    >
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Mentor Image Section */}
        <div className="relative w-full md:w-2/5 min-h-[350px] md:min-h-[450px] overflow-hidden">
          <Image
            src="/assets/ronaldo.jpeg"
            alt="Ronaldo - Mentor do Método ITR"
            fill
            priority
            className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          {/* Gradients to blend or accent */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]/40" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-l-[2rem] hidden md:block" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-8 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Quem está por trás do <span className="text-emerald-500">Método?</span>
            </h2>
            <div className="w-12 h-1 bg-emerald-500/40 rounded-full" />
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Médico e criador do algoritmo ITR. Preparando-se para o USMLE nos EUA. 
              <br className="hidden md:block" />
              <span className="inline-block mt-4 text-emerald-400 font-medium italic border-l-2 border-emerald-500/30 pl-4 py-1">
                "A alta performance exige reflexos, não traduções."
              </span>
            </p>
          </div>

          {/* Glass Style Buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-xl"
            >
              <Instagram size={20} className="text-emerald-500 group-hover/btn:scale-110 transition-transform" />
              <span className="font-semibold tracking-wide">Instagram</span>
            </motion.a>

            <div className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl text-slate-500 cursor-not-allowed transition-all duration-300 shadow-none opacity-60">
              <MessageCircle size={20} className="text-slate-600" />
              <span className="font-semibold tracking-wide">Fale com o Mentor</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
