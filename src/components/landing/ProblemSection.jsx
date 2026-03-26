import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { XCircle, Brain, ArrowDown } from 'lucide-react';

export default function ProblemSection() {
    return (
        <section data-section="Dores / Problema" className="relative pt-6 md:pt-10 pb-6 md:pb-10 px-6 bg-[#030308] overflow-hidden">

            {/* ── Glows de fundo ──────────────────────────────── */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-rose-900/8 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/5 blur-3xl rounded-full pointer-events-none"></div>

            {/* ── Seta animada de transição ───────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                className="flex justify-center mb-6 relative z-20"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.2, borderColor: "rgba(244,63,94,0.5)" }}
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors"
                >
                    <ArrowDown className="w-4 h-4 text-[#CCCCCC]" />
                </motion.div>
            </motion.div>

            <div className="max-w-5xl mx-auto relative z-20">

                <div className="text-center mb-14">
                    <p className="text-rose-400/80 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                        Antes de continuar, você precisa saber disso
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                        Por que você ainda <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                            trava na hora de falar?
                        </span>
                    </h2>
                    <p className="text-[#E2E2E2] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        A maioria passa <strong className="text-white font-semibold">anos</strong> pagando mensalidades em escolas de inglês. Mesmo assim, na hora H, a voz some.
                    </p>
                </div>

                {/* ── Bloco Central: A Dor Visceral (com tilt) ──── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ scale: 1.01 }}
                    className="relative max-w-3xl mx-auto mb-12"
                >
                    <div className="bg-[#0a0e18]/80 backdrop-blur-md border border-white/[0.06] rounded-[2rem] p-8 md:p-12 relative overflow-hidden hover:border-rose-500/15 transition-colors duration-500">
                        {/* Glow line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent"></div>

                        <div className="space-y-5 text-lg md:text-xl leading-relaxed">
                            <p className="text-slate-300">
                                O coração acelera. O suor frio bate. A frase que você <em className="text-white font-medium not-italic">ensaiou mentalmente</em> em português simplesmente não sai em inglês.
                            </p>
                            <p className="text-[#E2E2E2]">
                                Não é falta de inteligência. Não é falta de esforço.
                            </p>
                            <p className="text-white text-2xl md:text-3xl font-black tracking-tight mt-2">
                                É porque você começou pelo lugar errado.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Diagnóstico: Cards com hover interativo ──── */}
                <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-12">

                    {/* Card: O Método Errado */}
                    <div className="bg-rose-500/[0.04] border border-rose-500/10 rounded-2xl p-7 relative overflow-hidden group hover:border-rose-500/30 hover:shadow-[0_0_30px_rgba(244,63,94,0.06)] transition-all duration-300 cursor-default">
                        <div className="absolute top-4 right-4">
                            <XCircle className="w-24 h-24 text-rose-500 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center border border-rose-500/20 group-hover:bg-rose-500/25 transition-colors">
                                <XCircle className="w-4 h-4 text-rose-400" />
                            </div>
                            <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">O que não funciona</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            Escolas tradicionais forçam você a decorar <strong className="text-white font-medium">regras gramaticais complexas</strong> antes de te dar o bloco de construção mais básico de qualquer idioma:
                        </p>
                        <p className="text-rose-400 font-bold text-xl mt-3 tracking-tight">
                            As palavras.
                        </p>
                    </div>

                    {/* Card: A Consequência */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-7 relative overflow-hidden group hover:border-slate-600 hover:shadow-[0_0_30px_rgba(100,116,139,0.06)] transition-all duration-300 cursor-default">
                        <div className="absolute top-4 right-4">
                            <Brain className="w-24 h-24 text-[#CCCCCC] opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/30 group-hover:bg-slate-700/70 transition-colors">
                                <Brain className="w-4 h-4 text-[#E2E2E2]" />
                            </div>
                            <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">A consequência</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            Sem um <span className="text-white font-semibold underline decoration-emerald-500/40 underline-offset-4">vocabulário ativo</span> instalado na sua memória de longo prazo, não existe fluência. Você sabe a regra do <em>Present Perfect</em>...
                        </p>
                        <p className="text-[#CCCCCC] font-medium text-lg mt-3 tracking-tight">
                            ...mas a palavra não vem em milissegundos.
                        </p>
                    </div>
                </div>

                {/* ── Transição para a Solução (pulsante) ────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">
                            E se existisse um atalho?
                        </span>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
