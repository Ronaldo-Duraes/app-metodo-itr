import React from 'react';
import { motion } from 'framer-motion';
import { Bot, BookOpen, Users, Gift } from 'lucide-react';

const bonus = [
    {
        icon: <Bot className="w-6 h-6" />,
        title: "Treinador com IA",
        desc: "Pratique conversação 24h por dia com uma IA configurada para simular diálogos reais e corrigir erros — sem julgamentos.",
        gradient: "from-violet-400 to-purple-500",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        hoverBorder: "hover:border-violet-500/40",
        hoverShadow: "hover:shadow-[0_0_35px_rgba(139,92,246,0.08)]",
        originalPrice: "R$ 97,00"
    },
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Dicionário Estratégico",
        desc: "A lista organizada e mastigada das palavras mais importantes para a sua comunicação prática no dia a dia.",
        gradient: "from-emerald-400 to-teal-500",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/40",
        hoverShadow: "hover:shadow-[0_0_35px_rgba(16,185,129,0.08)]",
        originalPrice: "R$ 47,00"
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Comunidade VIP + Plano",
        desc: "Saiba exatamente o que fazer, em qual ordem, e troque experiências com pessoas no mesmo objetivo.",
        gradient: "from-cyan-400 to-blue-500",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        hoverBorder: "hover:border-cyan-500/40",
        hoverShadow: "hover:shadow-[0_0_35px_rgba(6,182,212,0.08)]",
        originalPrice: "R$ 155,90"
    }
];

export default function BonusExclusivos() {
    return (
        <section className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden min-h-[700px] sm:min-h-[500px]">

            <div className="absolute top-1/2 right-0 w-[500px] h-[400px] bg-violet-900/5 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 cursor-default"
                    >
                        <Gift className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">Incluído na sua vaga</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                        Bônus{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">exclusivos</span>
                    </h2>
                    <p className="text-[#E2E2E2] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Ao garantir sua vaga hoje, você recebe <strong className="text-white font-semibold">gratuitamente:</strong>
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-5">
                    {bonus.map((item, i) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0.1, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -6, transition: { duration: 0.25 } }}
                            className={`relative group bg-[#080c15] border ${item.border} ${item.hoverBorder} ${item.hoverShadow} rounded-2xl p-7 md:p-8 transition-all duration-300 overflow-hidden cursor-default`}
                        >
                            {/* Top accent */}
                            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-500`}></div>

                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center mb-5 shadow-lg shadow-${item.color.split('-')[1]}-500/20`}
                            >
                                <span className={item.color}>{item.icon}</span>
                            </motion.div>

                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>

                            {/* Price Anchoring */}
                            <div className="mb-4 inline-block bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 xl:px-4 xl:py-2 text-xs xl:text-sm whitespace-nowrap">
                                <span className="text-[#CCCCCC] line-through">De {item.originalPrice}</span>
                                <span className="text-emerald-400 font-bold ml-1">por R$ 0,00 (INCLUSO)</span>
                            </div>

                            <p className="text-slate-300 text-base leading-relaxed">{item.desc}</p>

                            {/* Bottom accent */}
                            <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
                        </motion.div>
                    ))}
                </div>

                {/* Final Stacking Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    className="max-w-3xl mx-auto mt-20 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700/50 rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                        Resumo de tudo que você está levando <span className="text-emerald-400 font-black">hoje</span>:
                    </h3>

                    <ul className="space-y-4 text-slate-300 mb-8 text-sm md:text-base font-medium">
                        <li className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                            <span>Acesso Completo ao Método ITR</span>
                            <span className="text-white whitespace-nowrap">R$ 399,00</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                            <span>Bônus 1: Treinador com IA</span>
                            <span className="text-white whitespace-nowrap">R$ 97,00</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                            <span>Bônus 2: Dicionário Estratégico</span>
                            <span className="text-white whitespace-nowrap">R$ 47,00</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                            <span>Bônus 3: Comunidade VIP + Plano</span>
                            <span className="text-white whitespace-nowrap">R$ 155,90</span>
                        </li>
                    </ul>

                    <div data-track="cta-bonus" className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-xl p-8 text-center transform hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden cursor-pointer" onClick={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })}>
                        <div className="absolute inset-0 bg-emerald-400/5 animate-pulse"></div>

                        {/* Huge Strikethrough Anchor */}
                        <div className="flex flex-col items-center justify-center mb-8 relative z-10 w-full">
                            <span className="text-xl text-[#CCCCCC] mb-2 font-medium">Soma de tudo:</span>
                            <span className="text-4xl sm:text-5xl md:text-7xl font-black text-red-500 line-through decoration-red-500/70 decoration-4 md:decoration-8 drop-shadow-xl whitespace-nowrap">
                                R$ 698,90
                            </span>
                        </div>

                        <p className="text-emerald-300 font-bold mb-6 text-lg md:text-xl uppercase tracking-wider relative z-10">
                            Mas essa não é a sua oferta hoje.
                        </p>

                        <div className="mt-4 flex justify-center relative z-10 w-full px-2">
                            <button data-track="cta-bonus" className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 md:px-10 py-4 text-base md:text-xl rounded-full transition-colors w-full sm:w-auto shadow-lg shadow-emerald-500/20 flex flex-nowrap items-center justify-center gap-2 md:gap-3">
                                <span className="whitespace-nowrap">VER OFERTA ESPECIAL</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="hidden sm:block md:w-6 md:h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
