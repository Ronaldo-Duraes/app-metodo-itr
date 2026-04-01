'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const pathname = usePathname();

  // Exceção absoluta: página de login
  if (pathname === '/login') return <>{children}</>;

  // Aguardar inicialização do Firebase Auth (Evita flash de conteúdo desprotegido)
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-1 w-full max-w-[200px] bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-emerald-500 animate-loading-bar" />
      </div>
    </div>
  );

  // AGORA O VISITANTE TEM ACESSO VISUAL COMPLETO
  // O bloqueio acontece via useRoleGuard nos botões de ação (Iniciar, Revisar, etc)
  return (
    <>
      {children}
      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
