import React from 'react';
import { Star, Quote, MessageSquareQuote } from 'lucide-react';
import VideoTestimonials from './VideoTestimonials';

const depoimentos = [
    {
        text: <>No começo achei estranho, mas depois de uns dias <strong className="text-white font-semibold">comecei a lembrar das palavras sem precisar traduzir</strong>. Ainda erro bastante, mas <strong className="text-white font-semibold">já consigo conversar bem melhor</strong>.</>,
        name: "Marcos Silva",
        avatar: "/avatar-1.jpg",
        color: "emerald"
    },
    {
        text: <>Sinceramente, comprei sem muita expectativa porque <strong className="text-white font-semibold">já tinha tentado outras vezes e sempre travava</strong>. No começo achei estranho focar tanto em vocabulário, mas depois de alguns dias <strong className="text-white font-semibold">comecei a lembrar das palavras muito mais rápido</strong>. Excelente curso, me ajudou muito.</>,
        name: "Ricardo Mendes",
        avatar: "/avatar-2.jpg",
        color: "teal"
    },
    {
        text: <>O que mais mudou pra mim foi que eu <strong className="text-white font-semibold">parei de traduzir tudo</strong>. Antes eu montava frase em português e tentava converter. Agora <strong className="text-white font-semibold">já vem direto algumas palavras na cabeça</strong>. Não é automático 100% ainda, mas <strong className="text-white font-semibold">já é MUITO mais natural do que antes</strong>. Sou muito grata por ter encontrado um método que realmente funciona.</>,
        name: "Juliana Costa",
        avatar: "/avatar-3.jpg",
        color: "cyan"
    }
];

const colorMap = {
    emerald: { avatarBorder: "border-emerald-500/25", hoverBorder: "hover:border-emerald-500/25" },
    teal: { avatarBorder: "border-teal-500/25", hoverBorder: "hover:border-teal-500/25" },
    cyan: { avatarBorder: "border-cyan-500/25", hoverBorder: "hover:border-cyan-500/25" },
};

export default function Depoimentos() {
    return (
        <section data-section="Prova Social (Depoimentos)" className="relative py-10 md:py-16 px-6 bg-[#030308] overflow-hidden">

            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-900/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-teal-900/4 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 mt-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 cursor-default transition-transform hover:scale-105">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[#E2E2E2] text-xs font-bold uppercase tracking-widest">Quem já testou</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                        O que dizem os{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">alunos ITR</span>
                    </h2>
                    <p className="text-[#E2E2E2] text-base md:text-lg font-light max-w-lg mx-auto">
                        Resultados reais de quem aplicou o método na prática.
                    </p>
                </div>

                {/* Depoimentos grid (text cards) */}
                <div className="grid md:grid-cols-3 gap-4">
                    {depoimentos.map((dep, i) => {
                        const c = colorMap[dep.color];
                        return (
                            <div
                                key={i}
                                className={`bg-[#080c15] border border-white/[0.05] ${c.hoverBorder} rounded-2xl p-6 md:p-7 relative overflow-hidden group hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default flex flex-col hover:-translate-y-1`}
                            >
                                {/* Top glow line */}
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Quote watermark */}
                                <div className="absolute -top-2 -right-2">
                                    <Quote className="w-20 h-20 text-white opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j}>
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        </div>
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-slate-300 leading-relaxed font-light text-sm md:text-base mb-5 flex-1">
                                    "{dep.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                                    <div className={`w-10 h-10 rounded-full border-2 ${c.avatarBorder} overflow-hidden`}>
                                        <img src={dep.avatar} alt={dep.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{dep.name}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Video Testimonials Carousel (replaces WhatsApp cards) */}
                <div className="mt-20 md:mt-28 mb-8 flex flex-col items-center justify-center w-full">
                    <p className="text-emerald-500/70 text-[11px] md:text-xs font-bold tracking-widest uppercase mb-10 text-center max-w-md">Depoimentos em vídeo dos nossos alunos</p>
                    <VideoTestimonials />
                </div>

            </div>
        </section>
    );
}
