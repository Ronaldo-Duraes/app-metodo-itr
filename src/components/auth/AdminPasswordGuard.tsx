'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const ADMIN_PASSWORD = 'A.ITR';
const STORAGE_KEY = 'admin_authenticated';

interface AdminPasswordGuardProps {
  children: React.ReactNode;
}

export default function AdminPasswordGuard({ children }: AdminPasswordGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const logoutAdminMode = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    window.location.reload();
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 fixed inset-0 z-[9999]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-950 border border-white/5 p-12 shadow-[0_0_100px_rgba(16,185,129,0.05)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 font-outfit" />
          
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Lock size={32} className="text-emerald-500" />
            </div>
            
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Acesso Restrito</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">Portal de Comando ITR</p>
            
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SENHA MESTRA"
                  className={`w-full bg-white/5 border-2 ${error ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'} py-4 px-6 text-center font-black tracking-[0.5em] text-white focus:outline-none transition-all placeholder:text-zinc-800`}
                  autoFocus
                />
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="text-[10px] text-red-500 font-black uppercase mt-2 tracking-widest"
                    >
                      Senha Incorreta
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 bg-emerald-500 text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 group"
              >
                Autenticar Gateway
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // We provide the children without the fixed logout button for a cleaner UI
  return <>{children}</>;
}
