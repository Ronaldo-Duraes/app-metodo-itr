'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpanishGatekeeper({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem('itr_espanhol_session');
      if (session) {
        try {
          const { unlockedAt } = JSON.parse(session);
          const hoursPassed = (Date.now() - unlockedAt) / (1000 * 60 * 60);
          if (hoursPassed < 24) {
             setUnlocked(true);
          } else {
             localStorage.removeItem('itr_espanhol_session');
          }
        } catch {
          localStorage.removeItem('itr_espanhol_session');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'socioITR') {
      localStorage.setItem('itr_espanhol_session', JSON.stringify({ unlockedAt: Date.now() }));
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (loading) return null;

  if (!unlocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#050505] border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Acesso Exclusivo</h1>
            <p className="text-sm font-semibold text-orange-500/80 tracking-widest uppercase">Portal Espanhol ITR</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-center tracking-[0.2em] focus:outline-none focus:border-orange-500 transition-colors"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs text-center mt-3 font-semibold uppercase tracking-wider">Senha incorreta</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-orange-500 text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-orange-400 transition-colors shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              Liberar Acesso
            </button>
          </form>

          <button 
            onClick={() => router.push('/')}
            className="w-full text-zinc-500 text-xs font-bold uppercase tracking-widest mt-6 hover:text-white transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
