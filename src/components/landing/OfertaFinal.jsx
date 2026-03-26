import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Check, Lock, CreditCard, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import { MagneticButton } from './Common';
import { InlineTimer } from './CountdownTimer';

export default function OfertaFinal({ onInView, paymentUrl }) {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { amount: 0.3 });

    useEffect(() => {
        if (onInView) onInView(isInView);
    }, [isInView, onInView]);

    return (
        <section
            ref={sectionRef}
            id="oferta"
            data-section="Oferta Final e Preços"
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#030308] overflow-hidden"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-900/[0.04] blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-3xl w-full mx-auto relative z-10">

                {/* Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="bg-gradient-to-b from-[#0d1520] to-[#080c15] border-2 border-emerald-500/30 rounded-[2rem] p-6 md:p-10 text-center relative overflow-hidden hover:border-emerald-500/50 transition-colors duration-500">
                        {/* Top glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent"></div>

                        {/* Urgência: vagas + live badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.05 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap items-center justify-center gap-3 mb-5"
                        >
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                </motion.div>
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Preço promocional</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                <Users className="w-3 h-3 text-[#E2E2E2]" />
                                <span className="text-[#E2E2E2] text-[10px] font-bold uppercase tracking-wider">+200 alunos</span>
                            </div>
                        </motion.div>

                        {/* Timer inline — migra pra cá quando está na viewport */}
                        <div className="mb-5">
                            <InlineTimer />
                        </div>

                        {/* Badge */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-4 cursor-default"
                        >
                            <Lock className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Acesso Vitalício</span>
                        </motion.div>

                        {/* Price — Hierarquia: Âncora animada → Parcelado GIGANTE → Badge café → À vista */}
                        <div className="mb-5">
                            {/* 1. Âncora com strikethrough animado — colada no preço */}
                            <div className="relative inline-block mb-0">
                                <span className="text-red-400/80 text-2xl md:text-3xl font-bold">R$ 698,90</span>
                                <motion.div
                                    className="absolute top-1/2 left-[-4%] h-[4px] bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                                    initial={{ width: '0%' }}
                                    whileInView={{ width: '108%' }}
                                    viewport={{ once: true, amount: 0.05 }}
                                    transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                                />
                            </div>

                            {/* 2. Preço parcelado — HERO PRICE (R$20 juntos e proporcionais) */}
                            <motion.div
                                className="flex items-baseline justify-center cursor-default -mt-2 mb-2"
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true, amount: 0.05 }}
                                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 150 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <span className="text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.2)] pr-2">
                                    R$67
                                </span>
                                <span className="text-emerald-400 text-3xl md:text-4xl font-bold">,99</span>
                            </motion.div>

                            {/* 3. Badge café + à vista */}
                            <span className="bg-slate-800/50 px-3 py-1 rounded-full text-slate-300 text-sm mt-3 inline-block">Menos de R$ 0,20 por dia</span>
                        </div>

                        {/* O que está incluído */}
                        <div className="flex flex-col items-center gap-y-2 mb-5 text-xs">
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                                {[
                                    "Acesso imediato",
                                    "Pagamento único",
                                    "Bônus inclusos"
                                ].map((f, i) => (
                                    <motion.div
                                        key={f}
                                        initial={{ opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.05 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="text-slate-300 font-medium whitespace-nowrap">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                                {[
                                    "Comunidade VIP",
                                    "Suporte dedicado"
                                ].map((f, i) => (
                                    <motion.div
                                        key={f}
                                        initial={{ opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.05 }}
                                        transition={{ delay: 0.45 + i * 0.05 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="text-slate-300 font-medium whitespace-nowrap">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mb-4">
                            <MagneticButton>
                                <a
                                    href={paymentUrl || import.meta.env.VITE_PAYMENT_URL || "https://pay.cakto.com.br/36u8zua_785324"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-track="cta-checkout"
                                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base md:text-lg px-8 py-4 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 uppercase tracking-wider"
                                >
                                    Quero garantir meu acesso agora
                                    <span className="hidden sm:inline"><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                                </a>
                            </MagneticButton>
                        </div>

                        {/* Micro-copy de urgência */}
                        <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-amber-400/60 text-[10px] uppercase tracking-widest font-bold mb-4"
                        >
                            ⚡ O valor pode aumentar a qualquer momento
                        </motion.p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-[#CCCCCC]">
                            <div className="flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Pagamento seguro</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5" />
                                <span>Dados protegidos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" />
                                <span>Acesso instantâneo</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Garantia compacta */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    whileHover={{ scale: 1.01 }}
                    className="mt-4 bg-emerald-500/[0.04] border border-emerald-500/15 rounded-2xl px-6 py-3.5 text-center hover:border-emerald-500/30 transition-all duration-300 cursor-default flex items-center justify-center gap-3"
                >
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                    </motion.div>
                    <p className="text-slate-300 text-sm leading-relaxed font-light text-left">
                        <strong className="text-emerald-400 font-bold">Garantia de 7 dias</strong> — teste na prática. Se não fizer sentido, devolvemos <strong className="text-white font-semibold">100% do valor.</strong>
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
