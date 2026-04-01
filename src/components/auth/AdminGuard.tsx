'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, LogOut } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-zinc-900 border border-red-500/30 p-10 text-center"
        >
          <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Acesso Negado</h1>
          <p className="text-zinc-500 text-sm font-bold mb-8 leading-relaxed">
            Esta área é restrita a administradores. Seu acesso foi bloqueado por motivos de segurança.
          </p>
          <button 
            onClick={() => router.push('/app')}
            className="w-full py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all"
          >
            Voltar para Home
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
