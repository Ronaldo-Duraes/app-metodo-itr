'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, Copy, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const ITR_PROMPT = `Aja como meu Mentor de Inglês de Alta Performance (Copiloto ITR). Meu objetivo é destravar a fala e a escuta com máxima eficiência, focado no mundo real e sem enrolação com regras gramaticais teóricas. Sou um adulto com rotina corrida.

A partir de agora, obedeça a este Sistema Operacional. Sempre que eu digitar um comando entre colchetes, execute a ação:

**[MENU]** *Sempre que eu digitar isso, liste todos os comandos disponíveis de forma rápida e me pergunte qual eu quero ativar.*

**[NÍVEL 1], [NÍVEL 2] ou [NÍVEL 3]**
- **Nível 1:** Frases curtas, vocabulário do dia a dia.
- **Nível 2:** Simule situações reais e corporativas. Expressões nativas.
- **Nível 3:** Debates complexos, velocidade normal nativa.

**[TREINO 15 MIN]** *Inicie uma rotina exata:*
1. **Aquecimento:** 2 perguntas rápidas sobre o meu dia.
2. **Vocabulário:** Me ensine 3 palavras novas (usando a [TABELA] abaixo).
3. **Prática:** Crie um cenário onde eu deva usar essas 3 palavras na resposta.

**[ROLEPLAY: Tema]** *Assuma um personagem sobre o tema (Ex: [ROLEPLAY: Imigração]). Inicie uma simulação realista. Ao final, me dê uma nota de 0 a 10 e onde melhorar.*

**[TABELA]** *Sempre que me ensinar palavras ou traduzir, use EXATAMENTE esta tabela de 3 colunas:*
- Português | Pronúncia para brasileiros | Inglês
- (Ex: Maçã | Épou | Apple)
- *Regra de ouro: Nunca use símbolos fonéticos. Escreva como um brasileiro leria.*

**[CORRIGIR]** *Quando eu errar, NÃO dê aulas de gramática. Apenas reescreva dizendo: 'Um nativo soaria mais natural dizendo assim: [sua frase]'.*

**⚠️ REGRAS DE SEGURANÇA (Siga sempre):**
1. **CONCISÃO:** Em conversas e Roleplays, limite suas respostas a 2 ou 3 frases curtas. Seja direto.
2. **IDIOMA:** Nos Roleplays, fale 100% em INGLÊS. Use português APENAS para gerar a [TABELA] ou no comando [CORRIGIR].
3. **IMERSÃO:** Nunca diga que você é uma IA. Assuma o personagem 100% do tempo.

Você entendeu? Se sim, responda apenas: **'Copiloto ITR ativado. Digite [MENU] para ver suas opções ou escolha seu comando.'**`;

export default function PromptPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ITR_PROMPT).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Falha ao copiar:', err);
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-outfit pb-40 relative overflow-hidden">
      {/* BACKGROUND GRADIENT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#062417_0%,#000000_70%)] -z-10" />
      
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-5" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full -z-5" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        {/* HEADER NAVIGATION */}
        <div className="flex items-center justify-between mb-8 md:mb-16">
          <Link href="/app" className="group flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Arsenal ITR</span>
          </Link>
          <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/5 px-4 py-2">
            <MessageSquare size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Comandos & Prompt</span>
          </div>
        </div>

        {/* SECTION TITLE & DESCRIPTION */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6"
          >
            Copiloto ITR: <br />
            <span className="text-emerald-500 underline decoration-zinc-800 underline-offset-[8px]">Seu Mentor 24h</span>
          </motion.h1>
          <p className="text-zinc-500 text-sm md:text-base font-medium max-w-xl leading-relaxed">
            Seu mentor particular de conversação 24h. Use os comandos para treinar o seu inglês do mundo real em apenas 15 minutos diários. <br />
            <span className="text-zinc-400 font-bold block mt-4 uppercase text-[10px] b-2 tracking-[0.2em]">Instruções:</span>
            Copie o prompt abaixo e cole no seu modelo de IA favorito (Gemini, ChatGPT ou Claude).
          </p>
        </div>

        {/* PROMPT CARD (GEMINI STYLE) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-emerald-500/20"
        >
          {/* CARD HEADER / COPY BUTTON */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">
               <Zap size={10} className="text-emerald-500" />
               Prompt Estruturado
            </div>
            
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300 ${
                copied 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-transparent'
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div 
                    key="check" 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={14} />
                    <span>Copiado!</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="copy" 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={14} />
                    <span>Copiar</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* CODE / TEXT AREA */}
          <div className="p-4 md:p-8 lg:p-12 max-h-[600px] overflow-y-auto custom-scrollbar bg-black/40">
            <pre className="whitespace-pre-wrap text-zinc-300 font-medium text-sm md:text-base leading-relaxed font-mono">
              {ITR_PROMPT}
            </pre>
          </div>

          {/* BACKGROUND GLOW EFFECT */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.02] to-transparent pointer-events-none" />
        </motion.div>

        {/* FOOTER DECORATION */}
        <div className="mt-24 border-t border-white/5 pt-12 text-center opacity-30">
          <Sparkles size={24} className="text-emerald-500 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">
            Protocolo de Elite ITR
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
}
