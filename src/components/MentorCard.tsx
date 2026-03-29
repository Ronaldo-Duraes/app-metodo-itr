'use client';

import Image from 'next/image';
import { Instagram, MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MentorCardProps {
  isModal?: boolean;
  onClose?: () => void;
}

/**
 * MentorCard Component
 * 
 * A premium, glassmorphism-styled card showcasing the mentor behind the Method.
 * Features a responsive layout (Desktop: Horizontal, Mobile: Vertical) with a 
 * "Black & Green Premium" aesthetic.
 * 
 * Supports an 'isModal' mode for compact display in overlays.
 * 
 * @returns JSX.Element
 */
export default function MentorCard({ isModal = false, onClose }: MentorCardProps) {
  const INSTAGRAM_LINK = 'https://instagram.com/imronaldod';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: isModal ? 0.9 : 1, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full ${isModal ? 'max-w-md' : 'max-w-4xl mx-auto'} overflow-hidden bg-[#0a0a0a] border border-emerald-500/20 rounded-[2.5rem] shadow-2xl shadow-emerald-950/20 group hover:border-emerald-500/40 transition-all duration-500 relative`}
    >
      {isModal && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/50 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      )}

      <div className={`flex flex-col ${!isModal ? 'md:flex-row' : ''} items-center md:items-stretch`}>
        {/* Mentor Image Section */}
        <div className={`relative w-full ${!isModal ? 'md:w-[35%] p-6 md:p-8' : 'p-6'}`}>
          <div className="relative aspect-square w-full h-full overflow-hidden rounded-3xl border border-emerald-500/10">
            <Image
              src="/assets/ronaldo.jpeg"
              alt="Ronaldo - Mentor do Método ITR"
              fill
              priority
              className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000"
              sizes={isModal ? "400px" : "(max-width: 768px) 100vw, 35vw"}
            />
            {/* Base Gradient Overlay for Fusion */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Content Section */}
        <div className={`flex-1 ${isModal ? 'p-6' : 'p-8 md:p-12 md:pl-4'} flex flex-col justify-center gap-6`}>
          <div className="space-y-4">
            <h2 className={`font-bold text-white tracking-tight leading-tight ${isModal ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
              Quem está por trás do <span className="text-emerald-500">Método??</span>
            </h2>
            <div className="w-12 h-1 bg-emerald-500/40 rounded-full" />
            <div className="space-y-4">
              <p className={`text-slate-400 ${isModal ? 'text-sm' : 'text-base md:text-lg'} leading-relaxed max-w-lg`}>
                Médico e criador do algoritmo ITR. Preparando-se para o USMLE nos EUA.
              </p>
              <div className="border-l-4 border-emerald-500 pl-4 py-1 italic text-emerald-400/90 font-medium">
                "A alta performance exige reflexos, não traduções."
              </div>
            </div>
          </div>

          {/* Buttons Area */}
          <div className={`flex flex-row flex-wrap gap-4 mt-2`}>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-emerald-500/40 transition-all shadow-xl text-sm font-semibold"
            >
              <Instagram size={18} className="text-emerald-500" />
              Instagram
            </motion.a>

            <div 
              className="flex items-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-slate-600 cursor-not-allowed transition-all text-sm font-semibold"
              title="Inativo por enquanto"
            >
              <MessageCircle size={18} className="text-slate-700" />
              Fale com o Mentor
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
