'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import HeroPlus from '@/components/landing/HeroPlus';
import { PromoBanner } from '@/components/landing/CountdownTimer';

const ProblemSection = lazy(() => import('@/components/landing/ProblemSection'));
const QuebraDeCrenca = lazy(() => import('@/components/landing/QuebraDeCrenca'));
const ComoFunciona = lazy(() => import('@/components/landing/ComoFunciona'));
const JornadaEvolucao = lazy(() => import('@/components/landing/JornadaEvolucao'));
const ParaQuem = lazy(() => import('@/components/landing/ParaQuem'));
const Depoimentos = lazy(() => import('@/components/landing/Depoimentos'));
const HistoriaMetodo = lazy(() => import('@/components/landing/HistoriaMetodo'));
const BonusExclusivos = lazy(() => import('@/components/landing/BonusExclusivos'));
const OfertaFinal = lazy(() => import('@/components/landing/OfertaFinal'));
const FaqNovo = lazy(() => import('@/components/landing/FaqNovo'));
const DecisaoFinal = lazy(() => import('@/components/landing/DecisaoFinal'));

export default function LandingPage() {
    const [showBanner, setShowBanner] = useState(false);
    const [ofertaInView, setOfertaInView] = useState(false);

    const basePaymentUrl = 'https://pay.cakto.com.br/36u8zua_785324';
    const paymentUrl = basePaymentUrl; // Simplified for now

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setShowBanner(window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOfertaInView = useCallback((inView: boolean) => {
        setOfertaInView(inView);
    }, []);

    return (
        <div className="min-h-screen bg-[#030308] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            <PromoBanner visible={showBanner && !ofertaInView} />
            <HeroPlus />
            <Suspense fallback={<div className="min-h-screen bg-[#030308] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div></div>}>
                <ProblemSection />
                <QuebraDeCrenca />
                <ComoFunciona />
                <JornadaEvolucao />
                <ParaQuem />
                <Depoimentos />
                <HistoriaMetodo />
                <BonusExclusivos />
                <OfertaFinal onInView={handleOfertaInView} paymentUrl={paymentUrl} />
                <FaqNovo />
                <DecisaoFinal />
            </Suspense>

            <footer className="bg-[#030308] py-8 text-center border-t border-slate-900 border-b-8 border-b-emerald-600 pb-8">
                <img src="/logo-itr.png" alt="ITR Logo" className="h-8 mx-auto mb-3 opacity-60" />
                <p className="text-slate-600 font-medium">© 2026 Ronaldo Durães | ITR. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
