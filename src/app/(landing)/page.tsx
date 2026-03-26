'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/app/flashcards');
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center font-outfit text-white">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h1 className="text-xl font-black uppercase tracking-widest text-emerald-500">Iniciando Dashboard...</h1>
            </div>
        </div>
    );
}
