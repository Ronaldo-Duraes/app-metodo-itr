'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/app');
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            {/* Redirecionamento silencioso sem flash visual */}
        </div>
    );
}
