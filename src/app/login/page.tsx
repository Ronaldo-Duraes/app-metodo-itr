'use client';

import React, { useState } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider, db, ADMIN_EMAIL, loginWithEmail, signUpWithEmail, resetPassword } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, enableNetwork } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle, Zap, Loader2, KeyRound, CheckCircle2, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// 🧹 LIMPEZA DE CACHE — Anti sessão corrompida
// ─────────────────────────────────────────────────────────────
function clearStaleSession() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.clear();
    ['itr_app_data', 'itr_mirror_triggers', 'itr_grammar_checklist', 'itr-tour-completed', 'welcomeShown', 'admin_authenticated']
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}

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
  
  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleResetPassword = async () => {
    if (!resetEmail || resetLoading) return;
    setResetError('');
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      const code = err.code || '';
      if (code === 'auth/user-not-found') setResetError('Nenhuma conta encontrada com este e-mail.');
      else if (code === 'auth/invalid-email') setResetError('E-mail inválido. Verifique o formato.');
      else if (code === 'auth/too-many-requests') setResetError('Muitas tentativas. Aguarde alguns minutos.');
      else setResetError('Falha ao enviar. Verifique o e-mail e tente novamente.');
    } finally {
      setResetLoading(false);
    }
  };

  const openForgotModal = () => {
    setResetEmail(email);
    setResetSuccess(false);
    setResetError('');
    setResetLoading(false);
    setShowForgotModal(true);
  };

  // ─────────────────────────────────────────────────────────────
  // 🔥 GOOGLE LOGIN — FLUXO UNIFICADO "SIGN IN OR UP"
  //
  // PASSO 1: signOut() — limpa sessão anterior (anti TARGET_ID)
  // PASSO 2: signInWithPopup — autenticação Google
  // PASSO 3: Firestore check — doc existe? update : create
  // PASSO 4: Redirect SÓ após Firestore confirmado
  // ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider || !db) {
      setError('Sistema de autenticação não inicializado.');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingMessage('Preparando autenticação...');

    try {
      // ── PASSO 1: Limpar sessão anterior para evitar TARGET_ID ──
      await firebaseSignOut(auth).catch(() => {});
      clearStaleSession();

      // ── PASSO 2: Autenticar com Google ──
      setLoadingMessage('Conectando com o Google...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error('Autenticação falhou — nenhum usuário retornado.');
      }

      // ── PASSO 3: Verificar/Criar documento Firestore ──
      setLoadingMessage('Sincronizando perfil...');


      const userRef = doc(db, 'users', user.uid);
      
      let firestoreConfirmed = false;
      try {
        const snap = await Promise.race([
          getDoc(userRef),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('TIMEOUT_FIRESTORE')), 6000)
          )
        ]);

        if (snap.exists()) {
          // ── USUÁRIO EXISTENTE: Atualiza último acesso ──
          await updateDoc(userRef, {
            lastAccessAt: serverTimestamp(),
            displayName: user.displayName || snap.data()?.displayName,
            photoURL: user.photoURL || snap.data()?.photoURL,
          }).catch(() => {});
          
          console.log('✅ Google Login: Perfil existente — role:', snap.data()?.role);
          firestoreConfirmed = true;
        } else {
          // ── USUÁRIO NOVO: Cria perfil como 'aluno' ──
          const initialRole = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'aluno';
          
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            name: user.displayName,
            photoURL: user.photoURL,
            role: initialRole,
            createdAt: serverTimestamp(),
            totalWordsAdded: 0,
            masteredCount: 0,
            unlockedRewards: [],
            firstLogin: true
          }, { merge: true });

          console.log('✅ Google Login: Novo perfil criado — role:', initialRole);
          firestoreConfirmed = true;
        }
      } catch (fsError: any) {
        console.warn('⚠️ Firestore check falhou (não bloqueia):', fsError.message);
        // Não bloqueia — AuthContext vai lidar com isso
        firestoreConfirmed = true; // Permite continuar mesmo com falha parcial
      }

      // ── PASSO 4: Redirect SÓ após confirmação Firestore ──
      if (firestoreConfirmed) {
        setLoadingMessage('Autenticado! Entrando no sistema...');
        window.location.href = '/app';
      }
    } catch (err: any) {
      console.error('❌ Google Auth Error:', err);
      
      // Limpeza de emergência em caso de erro
      clearStaleSession();
      
      const code = err.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setError('Login cancelado. Tente novamente.');
      } else if (code === 'auth/popup-blocked') {
        setError('Popup bloqueado. Permita popups para este site.');
      } else if (err.message?.includes('TARGET') || err.message?.includes('target')) {
        setError('Erro de sessão. Limpando cache e tentando novamente...');
        await firebaseSignOut(auth).catch(() => {});
        clearStaleSession();
      } else {
        setError('Falha na autenticação com Google. ' + (err.message || ''));
      }
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // ✉️ E-MAIL LOGIN / REGISTRO
  // ─────────────────────────────────────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setLoading(true);
    setLoadingMessage(isRegistering ? 'Criando sua conta...' : 'Verificando credenciais...');

    // TIMEOUT DE SEGURANÇA: Reseta o botão em 12s
    const safetyTimeout = setTimeout(() => {
      console.warn('⏱️ Safety timeout (12s): resetando estado');
      setLoading(false);
      setLoadingMessage('');
    }, 12000);

    try {
      if (isRegistering) {
        if (!name || !email || !password || !confirmEmail || !confirmPassword) throw { code: 'auth/empty-fields' };
        if (password.length < 6) throw { code: 'auth/weak-password' };
        if (email !== confirmEmail) throw { code: 'auth/emails-dont-match' };
        if (password !== confirmPassword) throw { code: 'auth/passwords-dont-match' };
        setLoadingMessage('Registrando no sistema...');
        await signUpWithEmail(email, password, name);
      } else {
        const loggedUser = await loginWithEmail(email, password);
        
        // 🛡️ VERIFICAÇÃO DE INTEGRIDADE: Garante que Firestore tem o perfil
        if (loggedUser && db) {
          try {
            setLoadingMessage('Verificando perfil...');
            const userRef = doc(db, 'users', loggedUser.uid);
            const snap = await Promise.race([
              getDoc(userRef),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('TIMEOUT')), 5000)
              )
            ]);
            
            if (!snap.exists() || !snap.data()?.role) {
              console.log('🛡️ Login: Perfil ausente — criando...');
              const initialRole = loggedUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'aluno';
              await setDoc(userRef, {
                uid: loggedUser.uid,
                email: loggedUser.email,
                displayName: loggedUser.displayName || email.split('@')[0],
                name: loggedUser.displayName || email.split('@')[0],
                photoURL: loggedUser.photoURL || null,
                role: initialRole,
                createdAt: serverTimestamp(),
                totalWordsAdded: 0,
                masteredCount: 0,
                unlockedRewards: [],
                firstLogin: true
              }, { merge: true });
            } else {
              // Atualiza último acesso
              await updateDoc(userRef, { lastAccessAt: serverTimestamp() }).catch(() => {});
            }
          } catch (fsErr) {
            console.warn('⚠️ Verificação de integridade falhou (não bloqueia):', fsErr);
          }
        }
      }
      clearTimeout(safetyTimeout);
      setLoadingMessage('Autenticado! Redirecionando...');
      window.location.href = '/app';
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error('❌ Auth error:', err);

      // 🧹 Limpeza em caso de erro grave
      const errorCode = err.code || '';
      if (errorCode.includes('internal') || err.message?.includes('TARGET')) {
        clearStaleSession();
      }
      
      if (errorCode === 'auth/empty-fields') setError('Preencha todos os campos obrigatórios.');
      else if (errorCode === 'auth/weak-password') setError('A senha deve ter no mínimo 6 caracteres.');
      else if (errorCode === 'auth/email-already-in-use') {
        try {
          setLoadingMessage('E-mail já cadastrado. Fazendo login automático...');
          await loginWithEmail(email, password);
          clearTimeout(safetyTimeout);
          setLoadingMessage('Autenticado! Redirecionando...');
          window.location.href = '/app';
          return;
        } catch (loginErr: any) {
          setError('Este e-mail já está cadastrado. Verifique sua senha ou use "Esqueci minha senha".');
        }
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

          {/* GOOGLE AUTH - UNIFIED SIGN IN OR UP */}
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
                {/* ESQUECI MINHA SENHA */}
                {!isRegistering && (
                  <div className="text-right pt-1">
                    <button 
                      type="button"
                      onClick={openForgotModal}
                      className="text-[9px] font-black text-amber-500/70 uppercase tracking-widest hover:text-amber-400 transition-colors"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                )}
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

      {/* ============ FORGOT PASSWORD MODAL ============ */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowForgotModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-amber-500/20 max-w-md w-full shadow-[0_0_100px_rgba(212,175,55,0.1)] relative overflow-hidden"
            >
              {/* Gold shimmer top */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              {/* Close button */}
              <button 
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-white transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="p-10 md:p-12">
                {!resetSuccess ? (
                  <>
                    <div className="flex flex-col items-center mb-10">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                        <KeyRound size={28} className="text-amber-500" />
                      </div>
                      <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Recuperar Senha</h2>
                      <p className="text-[9px] font-black text-amber-500/60 tracking-[0.4em] uppercase">Protocolo de Resgate</p>
                    </div>

                    <p className="text-xs text-zinc-400 font-bold text-center mb-8 leading-relaxed">
                      Digite seu e-mail cadastrado. Enviaremos um link seguro para redefinir sua chave de acesso.
                    </p>

                    {resetError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-red-500/10 text-red-400 p-4 border border-red-500/20 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest"
                      >
                        <AlertCircle size={14} />
                        {resetError}
                      </motion.div>
                    )}

                    <div className="space-y-1 mb-6">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail Cadastrado</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" size={16} />
                        <input 
                          type="email" 
                          value={resetEmail} 
                          onChange={(e) => setResetEmail(e.target.value)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') handleResetPassword(); }}
                          placeholder="seu@email.com"
                          autoFocus
                          className="w-full bg-white/[0.02] border border-white/5 p-4 pl-12 rounded-xl text-white font-bold focus:bg-white/[0.04] focus:border-amber-500/50 focus:outline-none transition-all placeholder:text-zinc-800 text-sm"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleResetPassword}
                      disabled={resetLoading || !resetEmail}
                      className={`relative w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-3 overflow-hidden group ${
                        resetLoading || !resetEmail
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                          : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                      }`}
                    >
                      {!resetLoading && resetEmail && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                      )}
                      <KeyRound size={14} />
                      {resetLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </button>

                    <button 
                      onClick={() => setShowForgotModal(false)}
                      className="w-full mt-4 py-3 text-zinc-600 font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Voltar ao Login
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-8">
                      <CheckCircle2 size={36} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-3">E-mail Enviado!</h2>
                    <p className="text-[9px] font-black text-emerald-500/60 tracking-[0.4em] uppercase mb-6">Protocolo Executado</p>
                    <p className="text-xs text-zinc-400 font-bold leading-relaxed mb-4">
                      Um link de recuperação foi enviado para:
                    </p>
                    <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg mb-8">
                      <span className="text-sm font-black text-amber-500">{resetEmail}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-8">
                      Verifique sua caixa de entrada e também a pasta de spam.
                    </p>
                    <button 
                      onClick={() => setShowForgotModal(false)}
                      className="w-full py-4 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                      Voltar ao Login
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
