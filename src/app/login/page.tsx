'use client';

import React, { useState } from 'react';
import { signInWithGoogle, loginWithEmail, signUpWithEmail } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) router.push('/app');
    } catch (err: any) {
      console.error("Login Google Error:", err);
      setError('Falha na autenticação com Google. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name) throw new Error("Nome é obrigatório para registro");
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      router.push('/app');
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/user-not-found') setError('Usuário não encontrado.');
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.');
      else if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está em uso.');
      else if (err.code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.');
      else setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-outfit relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-[#050505] border border-white/5 p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
      >
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16">
              <Image 
                src="/logo-itr.png" 
                alt="Logo ITR" 
                fill 
                className="object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              />
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
            Método ITR
          </h1>
          <p className="text-[9px] font-black text-emerald-500 tracking-[0.4em] uppercase mb-10 opacity-80">
            {isRegistering ? 'Criar sua conta de elite' : 'Arsenal de Elite'}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-3 mb-6 text-red-500 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            {isRegistering && (
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 p-4 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Seu nome"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 p-4 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div className="pb-4">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 p-4 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-emerald-500 text-black font-black text-[10px] tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processando...' : isRegistering ? 'Finalizar Registro' : 'Entrar no Sistema'}
            </button>
          </form>

          <div className="flex items-center gap-4 py-8 opacity-20">
            <div className="h-[1px] flex-1 bg-white" />
            <span className="text-[9px] font-black uppercase text-white tracking-widest">Ou acesse com</span>
            <div className="h-[1px] flex-1 bg-white" />
          </div>

          <button 
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full py-5 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase hover:bg-[#f0f0f0] transition-all duration-300 flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-4 h-4 transition-transform group-hover:scale-110"
            />
            Entrar via Google
          </button>
          
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              {isRegistering ? 'Já possui conta? Faça Login' : 'Não tem conta? Cadastre-se agora'}
            </button>
            <p className="text-[8px] text-[#444] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto">
              Ambiente Seguro. Protocolo de Maestria ITR v3.0 ativo.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative footer text */}
      <div className="absolute bottom-12 left-0 w-full text-center opacity-10 pointer-events-none">
        <span className="text-[8px] font-black tracking-[1em] text-white uppercase">Authentication Protocol v3.1</span>
      </div>
    </div>
  );
}
