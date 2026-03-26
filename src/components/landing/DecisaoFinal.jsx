import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { MagneticButton } from './Common';

export default function DecisaoFinal() {
    return (
        <section className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-900/8 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Icon */}
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 mb-8 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] transition-shadow"
                    >
                        <Flame className="w-6 h-6 text-emerald-400" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                        A decisão é{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">sua</span>
                    </h2>

                    <div className="space-y-4 text-slate-300 text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto mb-12">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.05 }}
                            transition={{ delay: 0.1 }}
                        >
                            Imagine assistir a uma série sem legenda e perceber que está <strong className="text-white font-semibold">entendendo o contexto</strong>. Imagine conversar e não precisar traduzir mentalmente cada palavra.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.05 }}
                            transition={{ delay: 0.2 }}
                            className="text-[#E2E2E2]"
                        >
                            Isso não acontece por mágica. Acontece por <strong className="text-white font-medium">estrutura e método.</strong>
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.05 }}
                            transition={{ delay: 0.3 }}
                            className="text-[#CCCCCC]"
                        >
                            Você pode continuar do jeito tradicional... <br className="hidden md:block" />
                            Ou pode finalmente organizar o seu aprendizado e <span className="text-emerald-400 font-bold">destravar.</span>
                        </motion.p>
                    </div>

                    {/* Final CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.05 }}
                        transition={{ delay: 0.4 }}
                    >
                        <MagneticButton
                            onClick={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg md:text-xl px-10 py-5 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 uppercase tracking-wider cursor-pointer"
                        >
                            <div data-track="cta-decisao" className="w-full h-full flex items-center justify-center gap-3">
                                Quero evoluir meu inglês agora
                                <span className="hidden sm:inline"><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                            </div>
                        </MagneticButton>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
