import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const perguntas = [
    {
        q: "Em quanto tempo começo a perceber evolução?",
        a: "Se você aplicar o método corretamente, os primeiros sinais aparecem já nas primeiras semanas. Você começará a reconhecer mais palavras em séries e músicas, formar frases com mais facilidade e sentir menos bloqueio mental."
    },
    {
        q: "Minha rotina é corrida. Isso funciona pra mim?",
        a: "Sim — e esse é exatamente o cenário da maioria dos alunos.\n\nO método foi estruturado para blocos curtos de tempo. Com cerca de 30 a 40 minutos por dia, você já evolui de forma consistente.\n\nO acesso é vitalício e você adapta o estudo à sua realidade. Mais importante do que a quantidade de tempo é a forma como você estuda."
    },
    {
        q: "Funciona para iniciantes?",
        a: "Completamente. O método começa do essencial e constrói a base correta desde o primeiro dia, evitando os vícios do ensino tradicional."
    },
    {
        q: "Quando recebo acesso ao curso?",
        a: "O acesso é imediato. Assim que o pagamento for confirmado, você é direcionado para a área de membros e recebe os dados de acesso por e-mail. Em poucos minutos já pode começar."
    },
    {
        q: "Funciona para quem já estudou antes e travou?",
        a: "Sim — esse é exatamente o perfil da maioria dos alunos.\n\nSe você sente que sabe, mas não consegue falar, o problema não é falta de conhecimento — é falta de organização mental e vocabulário ativo.\n\nO método ITR foi criado para destravar exatamente isso."
    },
    {
        q: "O curso oferece certificado?",
        a: "O verdadeiro certificado é a sua evolução. Mais importante do que um papel na parede é perceber que você está entendendo mais, formando frases com naturalidade e destravando sua comunicação. Aqui o resultado é prático."
    }
];

function FaqItem({ pergunta, isOpen, onClick, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ x: isOpen ? 0 : 3, transition: { duration: 0.15 } }}
            className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${isOpen
                    ? 'border-emerald-500/20 bg-[#080c15] shadow-[0_0_25px_rgba(16,185,129,0.04)]'
                    : 'border-white/[0.05] bg-[#080c15]/50 hover:border-white/[0.1]'
                }`}
        >
            <button
                onClick={onClick}
                data-track={`faq-${index + 1}`}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer"
            >
                <span className="text-white font-semibold text-base md:text-lg leading-snug">{pergunta.q}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                >
                    <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-emerald-400' : 'text-[#CCCCCC]'}`} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="px-5 md:px-6 pb-5 md:pb-6">
                            {pergunta.a.split('\n\n').map((paragraph, j) => (
                                <p key={j} className="text-[#E2E2E2] leading-relaxed font-light text-sm md:text-base mb-3 last:mb-0">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FaqNovo() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden">

            <div className="max-w-3xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 cursor-default"
                    >
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">Dúvidas</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                        Perguntas{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">frequentes</span>
                    </h2>
                </motion.div>

                {/* Questions */}
                <div className="space-y-3">
                    {perguntas.map((p, i) => (
                        <FaqItem
                            key={i}
                            pergunta={p}
                            isOpen={openIndex === i}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            index={i}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
