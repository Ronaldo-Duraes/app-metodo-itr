import React from 'react';
import { Users } from 'lucide-react';
import { TiltCard } from './Common';

export default function Mentor() {
    return (
        <section className="py-16 md:py-20 px-6 bg-[#030308] border-t border-slate-900 border-b relative overflow-hidden">
            {/* Abstract background shape */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-full md:w-5/12">
                    <TiltCard className="aspect-[4/5] bg-slate-800 rounded-[2rem] overflow-hidden flex items-center justify-center p-0 border-4 border-slate-800 shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-transparent z-10"></div>
                        <img
                            src="/ronaldo-mentor.jpg"
                            alt="Ronaldo Durães - Mentor"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                    </TiltCard>
                </div>
                <div className="w-full md:w-7/12 text-slate-300">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">
                        O mentor que estará <span className="text-emerald-400">com você</span>
                    </h2>
                    <div className="space-y-6 text-lg font-light leading-relaxed">
                        <p>Passei por quatro escolas, fiz aulas tradicionais, e a sensação sempre foi de frustração.</p>
                        <p className="border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-500/5 font-medium text-emerald-400 italic rounded-r-lg">
                            "Descobri que o problema nunca foi comigo — e sim com o método arcaico."
                        </p>
                        <p>Mergulhei na memorização, destravei meu cérebro e decidi transformar isso num método prático que vai te poupar anos de batida de cabeça.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
