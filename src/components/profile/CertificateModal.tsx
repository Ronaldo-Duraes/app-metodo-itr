'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Award, Zap, Crown, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { playVictoryPremiumSound } from '@/lib/srs';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'rubi' | 'gold';
  userName: string;
}

export default function CertificateModal({ isOpen, onClose, type, userName }: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      playVictoryPremiumSound();
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 300 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        // Garantir que todas as fontes foram carregadas antes da captura
        await document.fonts.ready;
        
        // Delay estratégico para sincronização de renderização (layout e estilos Tailwind)
        await new Promise(resolve => setTimeout(resolve, 150));

        const canvas = await html2canvas(certificateRef.current, {
          backgroundColor: null,
          scale: 2,
          logging: true, // Habilitado para diagnóstico
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          imageTimeout: 0, // Esperar indefinidamente pelo carregamento das imagens
          width: certificateRef.current.offsetWidth,
          height: certificateRef.current.offsetHeight,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('certificate-content');
            if (el) {
              el.style.display = 'flex'; // Garante visibilidade
              el.style.opacity = '1';
              el.style.transform = 'none'; // Remove escalas/animações que quebram o html2canvas
              el.style.visibility = 'visible';
            }
          }
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Certificado_ITR_${type === 'rubi' ? 'Rubi' : 'Ouro'}_${userName.replace(/\s+/g, '_')}.png`;
        link.click();
      } catch (err) {
        console.error("Erro ao gerar certificado:", err);
      }
    }
  };

  if (!isOpen) return null;

  const config = {
    rubi: {
      title: 'CERTIFICADO RUBI',
      subTitle: 'MAESTRIA DE 500 PALAVRAS',
      bg: 'bg-gradient-to-br from-red-950 via-black to-black',
      border: 'border-red-500',
      glow: 'shadow-[0_0_50px_rgba(239,68,68,0.2)]',
      icon: <Zap size={60} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />,
      phrase: 'A consistência é o que transforma o ordinário em extraordinário.',
      textColor: 'text-red-500',
      body: (
        <>
          Parabéns pela marca de <span className="text-white font-black">500 palavras dominadas</span>. <br/>
          Você faz parte da elite que não apenas estuda, mas retém o conhecimento com maestria.
        </>
      )
    },
    gold: {
      title: 'CERTIFICADO OURO',
      subTitle: 'MAESTRIA DE 1500 PALAVRAS',
      bg: 'bg-gradient-to-br from-yellow-900 via-yellow-950 to-black',
      border: 'border-[#FFD700]',
      glow: 'shadow-[0_0_60px_rgba(255,215,0,0.2)]',
      icon: <Crown size={60} className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" />,
      phrase: 'Sua voz agora tem o peso da autoridade.',
      textColor: 'text-[#FFD700]',
      body: (
        <>
          <span className="text-white font-black">{userName}</span>, você rompeu a barreira técnica da fluência. Com <span className="text-white font-black">1500 palavras dominadas</span>, o idioma deixou de ser um obstáculo e se tornou sua ferramenta. Poucos chegam aqui; menos ainda com essa precisão. Parabéns!
        </>
      )
    }
  };

  const current = config[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 0.95, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="relative w-full max-w-4xl h-full max-h-[85vh] flex flex-col items-center justify-center gap-6"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        {/* Certificate Container (The part to be captured) */}
        <div 
          ref={certificateRef}
          id="certificate-content"
          className={`w-full h-full flex flex-col items-center justify-center p-12 border-4 ${current.border} ${current.bg} ${current.glow} relative overflow-hidden`}
        >
          {/* Decorative Corner Details */}
          <div className={`absolute top-0 left-0 w-32 h-32 border-l-8 border-t-8 ${current.border} opacity-40`} />
          <div className={`absolute top-0 right-0 w-32 h-32 border-r-8 border-t-8 ${current.border} opacity-40`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 border-l-8 border-b-8 ${current.border} opacity-40`} />
          <div className={`absolute bottom-0 right-0 w-32 h-32 border-r-8 border-b-8 ${current.border} opacity-40`} />

          {/* Background Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          
          <div className="text-center z-10 space-y-8 max-w-3xl">
            <div className="flex justify-center mb-4">
              {current.icon}
            </div>
            
            <h4 className={`text-xs font-black uppercase tracking-[0.8em] ${current.textColor} opacity-80`}>
              CERTIFICADO DE CONQUISTA • MÉTODO ITR
            </h4>
            
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              {current.title}
            </h1>

            <div className="py-8">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs block mb-4 italic">Concedido a:</span>
              <h2 className={`text-3xl md:text-5xl font-black text-white border-b-2 ${current.border} inline-block px-12 pb-4 tracking-tight`}>
                {userName || 'Estudante ITR'}
              </h2>
            </div>

            <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed uppercase tracking-widest leading-[1.6]">
              {current.body}
            </p>

            <div className="pt-8 border-t border-white/10">
              <p className={`text-sm italic font-medium ${current.textColor} opacity-60 tracking-[0.2em]`}>
                 "{current.phrase}"
              </p>
            </div>

            <div className="pt-12 flex items-center justify-center gap-12 opacity-40">
               <div className="text-center">
                 <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">DATA EMISSÃO</div>
                 <div className="text-xs font-bold text-white uppercase">{new Date().toLocaleDateString('pt-BR')}</div>
               </div>
               <div className="text-center">
                 <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">VALIDAÇÃO ITR</div>
                 <div className="text-xs font-bold text-white uppercase font-mono">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Button (Outside capture area) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${type === 'rubi' ? 'bg-red-600 text-white shadow-red-500/20 shadow-xl' : 'bg-[#FFD700] text-black shadow-yellow-500/20 shadow-xl hover:bg-yellow-400'}`}
        >
          <Download size={20} />
          📥 Baixar Certificado
        </motion.button>
      </motion.div>
    </div>
  );
}
