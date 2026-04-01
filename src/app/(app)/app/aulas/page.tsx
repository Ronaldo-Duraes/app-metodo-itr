'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, GraduationCap, ArrowRight, ExternalLink, PlayCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const CAKTO_LINK = 'https://pay.cakto.com.br/36u8zua_785324';

const MODULES = [
  { id: 1, title: 'Módulo 1: Fundamentos do Método ITR', description: 'A base psicológica e técnica para o aprendizado acelerado.', lessons: 8, status: 'current' },
  { id: 2, title: 'Módulo 2: O Despertar da Fluência', description: 'Construindo as primeiras conexões neurais profundas.', lessons: 12, status: 'locked' },
  { id: 3, title: 'Módulo 3: Arsenal de Expressões de Elite', description: 'Vocabulário avançado e estruturas nativas.', lessons: 15, status: 'locked' },
  { id: 4, title: 'Módulo 4: Imersão Profunda e PAC', description: 'Técnicas de Mirroring e Gatilhos de Ação.', lessons: 10, status: 'locked' },
  { id: 5, title: 'Módulo 5: Maestria Final e Certificação', description: 'A consolidação do inglês em nível recorde.', lessons: 6, status: 'locked' },
];

export default function AulasPage() {
  const handleRedirect = () => {
    window.open(CAKTO_LINK, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-outfit pb-24">

      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* HEADER AREA */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <GraduationCap className="text-amber-500" size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-500">Área de Membros ITR</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              Domine o Método ITR <br />
              <span className="text-emerald-500">Seu Arsenal de Conhecimento</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* MAIN PLAYER SECTION (LEFT) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-video group cursor-pointer overflow-hidden border-2 border-white/5 bg-[#050505]"
              onClick={handleRedirect}
            >
              {/* Fake Video Thumb */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              
              {/* Thumbnail Placeholder Image (Simulated with Gradient and Logo) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 grayscale scale-110 group-hover:scale-100 transition-transform duration-[2s]">
                 <div className="w-full h-full bg-[url('/curso-thumbnail.png')] bg-cover bg-center" />
              </div>

              {/* Centered Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] group-hover:bg-emerald-400 transition-colors"
                >
                  <Play size={40} fill="black" className="text-black ml-2" />
                </motion.div>
                <div className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-60 group-hover:opacity-100 transition-opacity">
                  Continuar Aula Anterior
                </div>
              </div>

              {/* Video Info Footer */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Introdução ao ITR</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Módulo 1</span>
                    <span>•</span>
                    <span>Aula 01</span>
                    <span>•</span>
                    <span className="text-emerald-500">Concluído</span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plataforma Externa</span>
                  <div className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest">
                    Host: Cakto Members
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DESCRIPTION & CTA */}
            <div className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                 <div className="max-w-xl">
                   <h4 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 text-emerald-500">
                     <ShieldCheck size={20} />
                     Acesso Vitalício Garantido
                   </h4>
                   <p className="text-slate-400 text-sm leading-relaxed font-bold">
                     Sua jornada de fluência continua em nossa plataforma de treinamento avançado. 
                     Clique no botão ao lado para acessar seus cursos, baixar materiais de apoio 
                     e participar das aulas ao vivo.
                   </p>
                 </div>
                 
                 <button 
                   onClick={handleRedirect}
                   className="flex-shrink-0 px-10 py-5 bg-white text-black font-black text-xs tracking-[0.2em] uppercase hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group"
                 >
                   Assistir no Cakto
                   <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
               </div>
            </div>
          </div>

          {/* MODULE LIST SECTION (RIGHT) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 pb-4 border-b border-white/5">
              Grade de Módulos
            </h3>
            
            <div className="space-y-4">
              {MODULES.map((mod) => (
                <motion.div 
                  key={mod.id}
                  whileHover={mod.status !== 'locked' ? { x: 10 } : {}}
                  onClick={handleRedirect}
                  className={`p-6 border transition-all cursor-pointer relative group ${
                    mod.status === 'locked' 
                      ? 'border-white/5 bg-transparent opacity-40 grayscale pointer-events-none' 
                      : mod.status === 'current'
                      ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.05)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${mod.status === 'current' ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {mod.lessons} Aulas
                      </span>
                      <h4 className="text-sm font-black uppercase tracking-tight mb-2 group-hover:text-emerald-500 transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                        {mod.description}
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-end">
                      {mod.status === 'locked' ? (
                        <Lock size={16} className="text-slate-800" />
                      ) : (
                        <PlayCircle size={18} className="text-emerald-500" />
                      )}
                    </div>
                  </div>

                  {mod.status === 'current' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* SIDEBAR FOOTER */}
            <div className="mt-12 p-8 border border-white/5 bg-white/[0.01] text-center">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                 O progresso nas aulas é sincronizado automaticamente com sua área de membros oficial.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
