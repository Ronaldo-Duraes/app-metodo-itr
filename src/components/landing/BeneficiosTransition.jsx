import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function BeneficiosTransition() {
    return (
        <section className="bg-[#050510] py-6 px-6 relative z-20 -mt-10 mb-10">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {[
                        { title: "Destrua o bloqueio da fala", desc: "Forme frases instantaneamente, sem traduzir palavra por palavra." },
                        { title: "Absorção em Tempo Recorde", desc: "Memorize o vocabulário estratégico de alta frequência que os nativos realmente usam." },
                        { title: "Método Validado", desc: "A aplicação prática para você sair da teoria e ter segurança na comunicação hoje mesmo." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-[#0a0f18]/80 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                            <div className="mt-1 bg-emerald-500/10 p-1.5 rounded-full shrink-0 border border-emerald-500/20">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-slate-300 text-[12px] md:text-sm leading-relaxed">
                                <strong className="text-white font-bold block mb-1 tracking-wide">{item.title}</strong> {item.desc}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
