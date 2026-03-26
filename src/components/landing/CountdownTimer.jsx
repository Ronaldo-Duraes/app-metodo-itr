import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';

// ─── Calcula ms restantes até meia-noite de Brasília (UTC-3) ─────
function getMsUntilMidnightBrasilia() {
    const now = new Date();
    // Horário atual em Brasília (UTC-3 = offset -180 min)
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasiliaMs = utcMs - 3 * 3600000;
    const brasilia = new Date(brasiliaMs);

    // Meia-noite do próximo dia em Brasília
    const midnightBrasilia = new Date(brasilia);
    midnightBrasilia.setHours(24, 0, 0, 0);

    return midnightBrasilia.getTime() - brasilia.getTime();
}

function formatTime(ms) {
    if (ms <= 0) return { h: '00', m: '00', s: '00' };
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return { h, m, s };
}

function TimerDigits({ time, size = 'sm' }) {
    const sizes = {
        sm: { digit: 'text-sm md:text-base', label: 'text-[8px]', gap: 'gap-1.5', pad: 'px-2 py-1' },
        md: { digit: 'text-3xl md:text-4xl', label: 'text-[9px]', gap: 'gap-2', pad: 'px-3 py-2 min-w-[3.5rem]' },
    };
    const s = sizes[size];

    return (
        <div className={`flex items-center ${s.gap}`}>
            {[
                { val: time.h, label: 'HRS' },
                { val: time.m, label: 'MIN' },
                { val: time.s, label: 'SEG' },
            ].map((unit, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span className="text-emerald-500/50 font-bold">:</span>}
                    <div className={`flex flex-col items-center ${s.pad} rounded-lg bg-black/40 border border-emerald-500/20 min-w-[2.5rem]`}>
                        <span className={`${s.digit} font-mono font-black text-white tabular-nums leading-none`}>{unit.val}</span>
                        <span className={`${s.label} text-[#CCCCCC] font-bold uppercase tracking-wider mt-0.5`}>{unit.label}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

// ─── Hook compartilhado: tempo restante até meia-noite BRT ───────
function useMidnightCountdown() {
    const [remaining, setRemaining] = useState(getMsUntilMidnightBrasilia);

    useEffect(() => {
        const id = setInterval(() => setRemaining(getMsUntilMidnightBrasilia()), 1000);
        return () => clearInterval(id);
    }, []);

    return formatTime(remaining);
}

// ─── Top Banner (fixed) ──────────────────────────────────────────
export function PromoBanner({ visible }) {
    const time = useMidnightCountdown();

    return (
        <AnimatePresence>
            {visible && (
                <div className="h-[60px] md:h-[64px] w-full" aria-hidden="true">
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#0a0e18] via-[#071210] to-[#0a0e18] border-b border-emerald-500/20 backdrop-blur-md"
                    >
                        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 md:gap-5 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Flame className="w-4 h-4 text-amber-400" />
                                </motion.div>
                                <span className="text-white text-xs md:text-sm font-bold uppercase tracking-wider hidden sm:inline">
                                    Oferta do dia encerra em:
                                </span>
                                <span className="text-white text-xs font-bold uppercase tracking-wider sm:hidden">
                                    Oferta encerra em:
                                </span>
                            </div>
                            <TimerDigits time={time} size="sm" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ─── Inline Timer (dentro do card de preço) ──────────────────────
export function InlineTimer() {
    const time = useMidnightCountdown();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2"
        >
            <div className="flex items-center gap-2">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Clock className="w-4 h-4 text-amber-400" />
                </motion.div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                    Oferta do dia expira em:
                </span>
            </div>
            <TimerDigits time={time} size="md" />
        </motion.div>
    );
}
