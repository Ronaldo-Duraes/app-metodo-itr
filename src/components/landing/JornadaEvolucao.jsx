import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Blocks, MessageCircle, TrendingUp, Infinity, Rocket } from 'lucide-react';

const fases = [
    {
        icon: <Compass className="w-5 h-5" />,
        fase: "Fase 0",
        title: "Preparação Mental",
        desc: "Entenda como seu cérebro realmente aprende idiomas — e use isso a seu favor desde o primeiro dia.",
        color: "text-[#E2E2E2]",
        bg: "bg-slate-500/10",
        border: "border-slate-500/20",
        dotBg: "bg-[#0a0e18]",
    },
    {
        icon: <Blocks className="w-5 h-5" />,
        fase: "Fase 1",
        title: "Base Essencial",
        desc: "Domínio absoluto das palavras mais importantes da língua. A fundação que sustenta tudo.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        dotBg: "bg-[#0a0e18]",
    },
    {
        icon: <MessageCircle className="w-5 h-5" />,
        fase: "Fase 2",
        title: "Destravar a Fala",
        desc: "Organize frases com naturalidade e segurança. Sem medo de errar, sem tradução mental.",
        color: "text-teal-400",
        bg: "bg-teal-500/10",
        border: "border-teal-500/20",
        dotBg: "bg-[#0a0e18]",
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        fase: "Fase 3",
        title: "Consolidação",
        desc: "Ampliação de vocabulário e compreensão de estruturas mais avançadas. Aqui a confiança dispara.",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        dotBg: "bg-[#0a0e18]",
    },
    {
        icon: <Infinity className="w-5 h-5" />,
        fase: "Fase 4",
        title: "Evolução Contínua",
        desc: "Ferramentas práticas para continuar crescendo sozinho — sem depender de curso para sempre.",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        dotBg: "bg-[#0a0e18]",
    }
];

export default function JornadaEvolucao() {
    return (
        <section className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden">

            <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-teal-900/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-violet-900/5 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 cursor-default transition-transform hover:scale-105">
                        <Rocket className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">Plano de ação</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                        Sua jornada de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">evolução</span>
                    </h2>
                    <p className="text-[#E2E2E2] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Nada de aulas soltas. É um <strong className="text-white font-semibold">plano cirúrgico</strong> — cada fase constrói em cima da anterior.
                    </p>
                </div>

                {/* Fases */}
                <div className="relative">

                    {/* Vertical connecting line — behind the icons */}
                    <div className="hidden md:block absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-slate-700/40 via-emerald-500/20 via-60% to-violet-500/20 z-0"></div>

                    <div className="space-y-3">
                        {fases.map((fase, i) => (
                            <div
                                key={i}
                                className="flex gap-5 md:gap-6 items-stretch group cursor-default transition-transform hover:translate-x-1"
                            >
                                {/* Timeline dot — solid background to cover the line */}
                                <div className="relative shrink-0 z-10 flex flex-col items-center">
                                    <div className={`w-[46px] h-[46px] rounded-xl ${fase.bg} border ${fase.border} flex items-center justify-center ${fase.dotBg} shadow-[0_0_0_4px_#030308] transition-transform hover:scale-110 hover:rotate-6`}>
                                        <span className={`${fase.color} group-hover:scale-110 transition-transform`}>{fase.icon}</span>
                                    </div>
                                    {/* Mobile connector */}
                                    {i < fases.length - 1 && (
                                        <div className="md:hidden w-px flex-1 bg-gradient-to-b from-white/10 to-transparent mt-1"></div>
                                    )}
                                </div>

                                {/* Card */}
                                <div className={`flex-1 bg-[#080c15] border border-white/[0.05] rounded-xl p-5 md:p-6 group-hover:border-white/[0.12] group-hover:bg-[#0a0f1a] transition-all duration-300 relative overflow-hidden`}>
                                    {/* Hover glow */}
                                    <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5">
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${fase.color} ${fase.bg} px-2.5 py-1 rounded-md border ${fase.border}`}>
                                                {fase.fase}
                                            </span>
                                            <h3 className="text-base md:text-lg font-bold text-white">{fase.title}</h3>
                                        </div>
                                        <div className="hidden md:block w-px h-5 bg-white/10"></div>
                                        <p className="text-slate-300 text-base leading-relaxed flex-1">{fase.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom connector */}
                <div className="text-center mt-10">
                    <p className="text-[#CCCCCC] text-sm">
                        Cada fase foi pensada para levar você do <span className="text-white font-medium">zero ao automático</span> — no menor tempo possível.
                    </p>
                </div>

            </div>
        </section>
    );
}
