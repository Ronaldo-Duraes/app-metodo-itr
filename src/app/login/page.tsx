'use client';

import React, { useState } from 'react';
import { signInWithGoogle, loginWithEmail, signUpWithEmail } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle, Zap, Loader2 } from 'lucide-react';

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
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    setLoadingMessage('Conectando com o Google...');
    try {
      const user = await signInWithGoogle();
      if (user) {
        setLoadingMessage('Autenticado! Entrando no sistema...');
        window.location.href = '/app';
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError('Falha na autenticação com Google. ' + (err.message || ''));
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setLoading(true);
    setLoadingMessage(isRegistering ? 'Criando sua conta...' : 'Verificando credenciais...');

    // TIMEOUT DE SEGURANÇA: Reseta o botão em 10s e força redirect
    const safetyTimeout = setTimeout(() => {
      console.warn('⏱️ Safety timeout (10s): resetando botão e forçando entrada');
      setLoading(false);
      setLoadingMessage('');
      if (isRegistering) {
        window.location.href = '/app';
      }
    }, 10000);

    try {
      if (isRegistering) {
        if (!name || !email || !password || !confirmEmail || !confirmPassword) throw { code: 'auth/empty-fields' };
        if (password.length < 6) throw { code: 'auth/weak-password' };
        if (email !== confirmEmail) throw { code: 'auth/emails-dont-match' };
        if (password !== confirmPassword) throw { code: 'auth/passwords-dont-match' };
        setLoadingMessage('Registrando no sistema...');
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      clearTimeout(safetyTimeout);
      setLoadingMessage('Autenticado! Redirecionando...');
      window.location.href = '/app';
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error("❌ Auth error:", err);
      
      const errorCode = err.code || '';
      
      if (errorCode === 'auth/empty-fields') setError('Preencha todos os campos obrigatórios.');
      else if (errorCode === 'auth/weak-password') setError('A senha deve ter no mínimo 6 caracteres.');
      else if (errorCode === 'auth/email-already-in-use') {
        if (typeof window !== 'undefined') window.alert('E-mail já cadastrado!');
        setError('Este e-mail já está em uso. Tente fazer login ou use outro e-mail.');
      }
      else if (errorCode === 'auth/emails-dont-match') setError('Os e-mails informados não conferem.');
      else if (errorCode === 'auth/passwords-dont-match') setError('As chaves não conferem.');
      else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') setError('Credenciais inválidas. Verifique seu e-mail e chave.');
      else setError(`Falha: ${err.message || 'Verifique seus dados de conexão.'}`);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-outfit text-white relative overflow-hidden">
      
      {/* ============ LOADING OVERLAY ============ */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] border border-white/10 p-10 md:p-14 max-w-sm w-full mx-6 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              {/* Shimmer top bar */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              
              <div className="flex flex-col items-center text-center">
                {/* Animated spinner */}
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 rounded-full border-[3px] border-white/5" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-emerald-500/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={24} className="text-emerald-500 animate-pulse" fill="currentColor" />
                  </div>
                </div>

                <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">
                  {loadingMessage || 'Processando...'}
                </h3>
                <p className="text-[9px] font-black text-zinc-500 tracking-[0.4em] uppercase">
                  Protocolo de Comando Ativo
                </p>

                {/* Animated loading bar */}
                <div className="w-full h-1 bg-white/5 mt-8 overflow-hidden rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full animate-loading-bar" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg bg-[#0a0a0a] border border-white/5 p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] relative"
        >
          {/* Shimmer Border */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
          
          <div className="flex flex-col items-center mb-12">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="w-24 h-24 mb-8 flex items-center justify-center"
            >
               <Image src="/logo-itr.png" alt="Logo ITR" width={90} height={90} className="object-contain" priority />
            </motion.div>
            
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Portal de Comando</h1>
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-black text-emerald-500 tracking-[0.4em] uppercase">Método ITR v3.0</span>
               <div className="h-[1px] w-4 bg-white/10" />
               <span className="text-[9px] font-black text-zinc-500 tracking-[0.4em] uppercase italic">Acesso ITR</span>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-red-500/10 text-red-500 p-4 border border-red-500/20 rounded-xl mb-8 text-[10px] font-black uppercase tracking-widest"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          {/* GOOGLE AUTH - ELITE STYLE */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center gap-4 text-white font-black text-xs uppercase tracking-widest hover:bg-white/[0.06] hover:border-white/20 transition-all group mb-8"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Continuar com o Google
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <span className="relative bg-[#0a0a0a] px-4 text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em]">Ou credenciais de comando</span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Seu Nome</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como prefere ser chamado?"
                      className="w-full bg-white/[0.02] border border-white/5 p-4 pl-12 rounded-xl text-white font-bold focus:bg-white/[0.04] focus:border-emerald-500/50 focus:outline-none transition-all placeholder:text-zinc-800 text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail Protegido</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
                    className="w-full bg-white/[0.02] border border-white/5 p-4 pl-12 rounded-xl text-white font-bold focus:bg-white/[0.04] focus:border-emerald-500/50 focus:outline-none transition-all placeholder:text-zinc-800 text-sm"
                  />
                </div>
              </div>

              {isRegistering && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input 
                      type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} placeholder="repita seu@email.com"
                      className={`w-full bg-white/[0.02] border p-4 pl-12 rounded-xl text-white font-bold focus:bg-white/[0.04] focus:outline-none transition-all text-sm ${
                        confirmEmail && email !== confirmEmail ? 'border-red-500/50' : 'border-white/5 focus:border-emerald-500/50'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Chave de Acesso</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input 
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full bg-white/[0.02] border border-white/5 p-4 pl-12 rounded-xl text-white font-bold focus:bg-white/[0.04] focus:border-emerald-500/50 focus:outline-none transition-all placeholder:text-zinc-800 text-sm"
                  />
                </div>
              </div>

              {isRegistering && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar Chave</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input 
                      type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="repita a chave"
                      className={`w-full bg-white/[0.02] border p-4 pl-12 rounded-xl text-white font-bold focus:bg-white/[0.04] focus:outline-none transition-all text-sm ${
                        confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-white/5 focus:border-emerald-500/50'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`relative w-full py-5 text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-8 overflow-hidden group ${
                loading 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                  : 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              }`}
            >
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
              )}
              <Zap size={14} fill="currentColor" />
              {loading ? 'Processando Autenticação...' : isRegistering ? 'Finalizar Criação de Conta' : 'Autorizar Entrada'}
            </button>
          </form>

          <footer className="mt-10 text-center">
             <button 
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-zinc-600 font-black text-[10px] tracking-widest uppercase hover:text-white transition-colors"
             >
                {isRegistering ? 'Já possui comando? Iniciar Gateway' : 'Não possui acesso? Solicitar Cadastro'}
             </button>
             
             <div className="mt-10 flex items-center justify-center gap-4 opacity-10">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em]">Protocolo de Comando ITR Ativo</span>
             </div>
          </footer>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 40%; }
          50% { width: 60%; }
          100% { transform: translateX(250%); width: 40%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
