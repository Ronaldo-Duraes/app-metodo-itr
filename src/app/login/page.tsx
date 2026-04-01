'use client';

import React, { useState } from 'react';
import { signInWithGoogle, loginWithEmail, signUpWithEmail } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      setError('Falha na autenticação Google. Verifique se o domínio está autorizado.');
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
        if (email !== confirmEmail) throw new Error("Os e-mails não coincidem.");
        if (password !== confirmPassword) throw new Error("As senhas não coincidem.");
        if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");
        
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      router.push('/app');
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/user-not-found') setError('Usuário não encontrado.');
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.');
      else setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-outfit relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-zinc-950 border border-white/5 p-10 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          {/* Top Line decoration */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 border border-white/5 rounded-2xl mb-6 shadow-xl">
              <Image src="/logo-itr.png" alt="Logo ITR" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              {isRegistering ? 'Criar Conta ITR' : 'Acesso ao Arsenal'}
            </h1>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
              Método ITR v3.0 • Premium Access
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-4 mb-8 text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
            >
              {error}
            </motion.div>
          )}

          {/* 1. GOOGLE LOGIN (PREMIUM DISPLAY) */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl group/google mb-8"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 group-hover/google:scale-110 transition-transform" />
            Continuar com Google
          </button>

          <div className="relative mb-10 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[9px] font-black uppercase text-zinc-700 tracking-widest">Ou via Credenciais</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {/* 2. EMAIL FORM */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold placeholder:text-zinc-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@parceiro.com"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold placeholder:text-zinc-700"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="email" 
                      required
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder="Repita seu e-mail"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold placeholder:text-zinc-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha Segura</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold placeholder:text-zinc-700"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita sua senha"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold placeholder:text-zinc-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full py-5 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-amber-400 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Processando...' : isRegistering ? 'Finalizar Registro' : 'Entrar no Sistema'}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-amber-500 transition-colors"
            >
              {isRegistering ? 'Já possui uma conta? Faça Login' : 'Ainda não é membro? Cadastre-se agora'}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-8 opacity-20">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white tracking-[0.2em]">
            <ShieldCheck size={12} className="text-emerald-500" />
            Protocolo SSL Ativo
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white tracking-[0.2em]">
            <Lock size={12} className="text-amber-500" />
            Criptografia de Ponta
          </div>
        </div>
      </motion.div>
    </div>
  );
}
