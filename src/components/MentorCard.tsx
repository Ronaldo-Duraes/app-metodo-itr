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
  const WHATSAPP_LINK = 'https://wa.me/5511999999999'; // TODO: Update with actual mentor number
  const INSTAGRAM_LINK = 'https://instagram.com/im.ronaldod';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: isModal ? 0.9 : 1, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full ${isModal ? 'max-w-md' : 'max-w-4xl mx-auto'} overflow-hidden bg-[#0a0a0a] border border-emerald-500/20 rounded-[2rem] shadow-2xl shadow-emerald-950/20 group hover:border-emerald-500/40 transition-all duration-500 relative`}
    >
      {isModal && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/50 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      )}

      <div className={`flex flex-col ${!isModal ? 'md:flex-row' : ''} items-stretch`}>
        {/* Mentor Image Section */}
        <div className={`relative w-full ${!isModal ? 'md:w-1/3 h-72 md:h-auto' : 'h-64'} overflow-hidden aspect-square md:aspect-auto`}>
          <Image
            src="/assets/ronaldo.jpeg"
            alt="Ronaldo - Mentor do Método ITR"
            fill
            priority
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
            sizes={isModal ? "400px" : "(max-width: 768px) 100vw, 33vw"}
          />
          {/* Gradients to blend or accent */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
          
          {!isModal && (
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-l-[2rem] hidden md:block z-20" />
          )}
        </div>

        {/* Content Section */}
        <div className={`flex-1 ${isModal ? 'p-6' : 'p-8 md:p-12'} flex flex-col justify-center gap-6 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]`}>
          <div className="space-y-4">
            <h2 className={`${isModal ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold text-white tracking-tight leading-tight`}>
              Quem está por trás do <span className="text-emerald-500">Método?</span>
            </h2>
            <div className={`w-12 h-1 bg-emerald-500/40 rounded-full`} />
            <p className={`text-slate-400 ${isModal ? 'text-sm' : 'text-lg'} leading-relaxed max-w-lg`}>
              Estudante de medicina e criador do método ITR. Preparando-se para o USMLE nos EUA. 
              <br className={isModal ? 'hidden' : 'hidden md:block'} />
              <span className={`inline-block mt-4 text-emerald-400 font-medium italic border-l-4 border-emerald-500 pl-4 py-1`}>
                "A alta performance exige reflexos, não traduções."
              </span>
            </p>
          </div>

          {/* Glass Style Buttons */}
          <div className={`flex flex-wrap ${isModal ? 'flex-col' : 'gap-4'} gap-3 mt-2`}>
            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn flex items-center justify-center gap-2 ${isModal ? 'px-6 py-3' : 'px-8 py-4'} bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-xl`}
            >
              <Instagram size={isModal ? 18 : 20} className="text-emerald-500 group-hover/btn:scale-110 transition-transform" />
              <span className={`font-semibold tracking-wide ${isModal ? 'text-xs' : ''}`}>Instagram</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn flex items-center justify-center gap-2 ${isModal ? 'px-6 py-3' : 'px-8 py-4'} bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-2xl text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl`}
            >
              <MessageCircle size={isModal ? 18 : 20} className="text-emerald-500 group-hover/btn:scale-110 transition-transform" />
              <span className={`font-semibold tracking-wide ${isModal ? 'text-xs' : ''}`}>Fale com o Mentor</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
