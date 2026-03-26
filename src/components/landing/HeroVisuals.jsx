import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Brain, Trophy, BookOpen } from 'lucide-react';

export default function HeroVisuals() {
    return (
        <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
            {/* Glows — reduced blur values */}
            <div className="absolute w-[120%] h-[120%] bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute w-[80%] h-[80%] bg-teal-400/15 rounded-full blur-2xl"></div>

            <div className="relative w-full h-full">

                {/* Floating Card 1: Progress */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[5%] bg-slate-900/90 border border-slate-700/50 p-4 rounded-2xl shadow-2xl w-64 z-20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold text-left">Fluência Acelerada</p>
                            <p className="text-[#E2E2E2] text-xs text-left">Progresso do Método</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-1 overflow-hidden">
                        <motion.div
                            initial={{ width: "20%" }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                            className="bg-emerald-500 h-full rounded-full"
                        ></motion.div>
                    </div>
                </motion.div>

                {/* Floating Card 2: Memory / Brain */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[10%] left-[15%] bg-slate-900/90 border border-slate-700/50 p-3 rounded-2xl shadow-xl flex items-center gap-3 pr-6 z-10"
                >
                    <div className="bg-teal-500/20 p-2.5 rounded-xl text-teal-400">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                        <p className="text-white text-xs font-bold text-left">Tradução Mental</p>
                        <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Eliminada
                        </p>
                    </div>
                </motion.div>

                {/* Floating Card 3: Trophy */}
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-[25%] right-[-10%] bg-slate-900/90 border border-slate-700/50 p-3 rounded-2xl shadow-xl flex items-center gap-3 pr-5 z-20"
                >
                    <div className="bg-yellow-500/20 p-2 rounded-xl text-yellow-400">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                        <p className="text-white text-xs font-bold text-left">Resultados</p>
                        <p className="text-[#E2E2E2] text-[10px] text-left">Comprovados</p>
                    </div>
                </motion.div>

                {/* Floating Card 4: Vocabulary */}
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[55%] left-[-15%] bg-slate-900/90 border border-slate-700/50 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-30"
                >
                    <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                        <p className="text-white text-xs font-bold text-left">Vocabulário Ativo</p>
                        <p className="text-emerald-400 text-[10px] text-left font-semibold tracking-wide">+3.000 Palavras</p>
                    </div>
                </motion.div>

                {/* Central Focus Element (ITR Globe) */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 m-auto w-56 h-56 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full border border-emerald-500/20 flex items-center justify-center shadow-[inset_0_0_50px_rgba(16,185,129,0.1)] z-10"
                >
                    <div className="w-36 h-36 bg-gradient-to-b from-emerald-500/30 to-teal-600/20 rounded-full flex items-center justify-center border border-emerald-400/50 shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                        <strong className="text-5xl text-white font-black tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">ITR</strong>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
