import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Brain, Repeat, Zap } from 'lucide-react';

const pilares = [
    {
        num: "01",
        icon: <Filter className="w-6 h-6" />,
        title: "O Filtro de Alta Frequência",
        tagline: "Aprenda só o que importa",
        desc: "Você foca primeiro nas palavras que os nativos realmente usam no dia a dia — nada de vocabulário inútil que você nunca vai precisar.",
        gradient: "from-emerald-400 to-teal-500",
        bgGlow: "emerald",
        borderColor: "border-emerald-500/20",
        iconBg: "bg-emerald-500/10",
        tagColor: "text-emerald-400",
        hoverShadow: "hover:shadow-[0_0_35px_rgba(16,185,129,0.08)]",
        hoverBorder: "hover:border-emerald-500/40",
    },
    {
        num: "02",
        icon: <Brain className="w-6 h-6" />,
        title: "Engenharia da Memorização",
        tagline: "Aprenda e nunca mais esqueça",
        desc: "Técnicas de associação visual e ancoragem mental que criam \"ganchos\" tão fortes na sua memória que o vocabulário fica gravado permanentemente.",
        gradient: "from-violet-400 to-purple-500",
        bgGlow: "violet",
        borderColor: "border-violet-500/20",
        iconBg: "bg-violet-500/10",
        tagColor: "text-violet-400",
        hoverShadow: "hover:shadow-[0_0_35px_rgba(139,92,246,0.08)]",
        hoverBorder: "hover:border-violet-500/40",
    },
    {
        num: "03",
        icon: <Repeat className="w-6 h-6" />,
        title: "Aplicação Imediata",
        tagline: "Evolução em semanas, não anos",
        desc: "Aprenda, fixe e use — no mesmo dia. Esse ciclo contínuo é o que gera evolução real que você percebe já nas primeiras semanas.",
        gradient: "from-amber-400 to-orange-500",
        bgGlow: "amber",
        borderColor: "border-amber-500/20",
        iconBg: "bg-amber-500/10",
        tagColor: "text-amber-400",
        hoverShadow: "hover:shadow-[0_0_35px_rgba(245,158,11,0.08)]",
        hoverBorder: "hover:border-amber-500/40",
    }
];

export default function ComoFunciona() {
    return (
        <section data-section="Metodologia (Como Funciona)" className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-900/5 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 cursor-default">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">Os 3 Pilares</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                        Como o <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">ITR</span> funciona
                    </h2>
                    <p className="text-[#E2E2E2] text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
                        Nada de conteúdo solto. São <strong className="text-white font-semibold">3 pilares</strong> que trabalham juntos para gravar o inglês na sua mente.
                    </p>
                </div>

                {/* Pilares — card grid com interações */}
                <div className="grid md:grid-cols-3 gap-5">
                    {pilares.map((pilar, i) => (
                        <div
                            key={i}
                            className={`relative group bg-[#080c15] border ${pilar.borderColor} hover:border-emerald-500/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.08)] rounded-2xl p-7 md:p-8 transition-all duration-300 overflow-hidden cursor-default`}
                        >
                            {/* Top accent line */}
                            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${pilar.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-500`}></div>

                            {/* Ghost number */}
                            <span className={`text-5xl font-black bg-gradient-to-b ${pilar.gradient} text-transparent bg-clip-text opacity-10 group-hover:opacity-20 transition-opacity absolute top-4 right-5 leading-none`}>
                                {pilar.num}
                            </span>

                            {/* Icon with hover effect */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`w-12 h-12 rounded-xl ${pilar.iconBg} border ${pilar.borderColor} flex items-center justify-center mb-5 relative z-10`}
                            >
                                <span className={pilar.tagColor}>{pilar.icon}</span>
                            </motion.div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{pilar.title}</h3>
                            <p className={`text-xs font-bold uppercase tracking-widest ${pilar.tagColor} mb-4`}>{pilar.tagline}</p>
                            <p className="text-[#E2E2E2] text-sm leading-relaxed font-light relative z-10">{pilar.desc}</p>

                            {/* Bottom accent bar */}
                            <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${pilar.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
                        </div>
                    ))}
                </div>

                {/* Connector */}
                <div className="text-center mt-10">
                    <p className="text-[#CCCCCC] text-sm font-light">
                        Os 3 pilares se conectam em um <span className="text-white font-medium">sistema único</span> — e o resultado é fluência construída do jeito certo.
                    </p>
                </div>

            </div>
        </section>
    );
}
