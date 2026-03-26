import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Target } from 'lucide-react';
import { MagneticButton } from './Common';

const perfis = [
    {
        text: "Já tentou aprender inglês, desistiu no meio do caminho e sente que sempre trava na hora de falar.",
        highlight: "desistiu no meio do caminho",
    },
    {
        text: "Estuda há meses (ou anos), mas não consegue transformar conhecimento passivo em fala real.",
        highlight: "conhecimento passivo em fala real",
    },
    {
        text: "Precisa acelerar o inglês de forma estratégica — para viagens, promoções ou oportunidades internacionais.",
        highlight: "acelerar o inglês",
    },
    {
        text: "Está cansado de metodologias lentas que ensinam regra atrás de regra sem resultado prático.",
        highlight: "metodologias lentas",
    }
];

export default function ParaQuem() {
    return (
        <section className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden">

            <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-emerald-900/6 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-teal-900/4 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 cursor-default transition-transform hover:scale-105">
                        <Target className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">É pra você?</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                        Esse método é{' '}<br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">para quem:</span>
                    </h2>
                </div>

                {/* Checklist interativo */}
                <div className="space-y-3 mb-10">
                    {perfis.map((perfil, i) => (
                        <div
                            key={i}
                            className="flex gap-4 items-start p-5 rounded-xl bg-[#080c15] border border-white/[0.05] hover:border-emerald-500/25 hover:bg-[#0a0f1a] transition-all duration-300 group cursor-default hover:translate-x-1"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-0.5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/35 transition-all group-hover:scale-110 group-hover:rotate-6">
                                <Check className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-slate-300 leading-relaxed font-light text-base md:text-lg">
                                {perfil.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Aviso com hover */}
                <div className="flex gap-3 items-start p-5 rounded-xl bg-amber-500/[0.04] border border-amber-500/15 hover:border-amber-500/30 transition-all duration-300 cursor-default mb-12 hover:scale-[1.01]">
                    <div className="animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    </div>
                    <p className="text-amber-300/80 text-sm leading-relaxed font-light italic">
                        Este treinamento não é para quem quer mil PDFs de teoria infinita. É para quem busca <strong className="text-amber-200 font-medium not-italic">resultado prático.</strong>
                    </p>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center"
                >
                    <MagneticButton onClick={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })}>
                        <div data-track="cta-paraquem" className="w-full h-full flex items-center justify-center">
                            <span className="hidden sm:inline">QUERO ACELERAR MEU INGLÊS AGORA</span>
                            <span className="sm:hidden">ACELERAR MEU INGLÊS</span>
                        </div>
                    </MagneticButton>
                </motion.div>

            </div>
        </section>
    );
}
