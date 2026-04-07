'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  Zap, 
  Search, 
  ShieldCheck, 
  UserMinus, 
  Settings, 
  RefreshCw,
  ArrowLeft,
  Lock,
  Wifi,
  WifiOff,
  Trash2,
  MoreVertical,
  X,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Ghost,
  Sparkles
} from 'lucide-react';
import { getAllUsers, updateUserRole, deleteUserDoc, UserStats, subscribeToUsers, forceFirestoreOnline } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────────────────────────
// TOAST NOTIFICATION SYSTEM
// ─────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 px-6 py-4 border shadow-2xl backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400' 
          : 'bg-red-950/90 border-red-500/30 text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      <span className="text-[11px] font-black uppercase tracking-widest">{message}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// DELETE CONFIRMATION MODAL (full-screen on mobile)
// ─────────────────────────────────────────────────────────────
function DeleteModal({ 
  isOpen, 
  userName, 
  isDeleting,
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  userName: string; 
  isDeleting: boolean;
  onConfirm: () => void; 
  onCancel: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full h-full md:h-auto md:max-w-md bg-zinc-950 border border-white/10 flex flex-col items-center justify-center p-8 md:p-10 md:rounded-sm"
      >
        <div className="w-16 h-16 md:w-14 md:h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        
        <h3 className="text-lg md:text-base font-black uppercase tracking-tight text-white text-center mb-2">
          Excluir Conta
        </h3>
        <p className="text-sm md:text-xs text-zinc-400 text-center mb-8 max-w-xs leading-relaxed">
          Tem certeza que deseja excluir <strong className="text-white">&quot;{userName}&quot;</strong>? 
          Isso apagará os dados de acesso e progresso do aluno no Firestore. 
          <span className="text-red-400 font-bold"> Esta ação é irreversível.</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-3 w-full max-w-xs">
          <button 
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 min-h-[52px] md:min-h-[44px] px-6 py-3 bg-zinc-900 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X size={14} /> Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 min-h-[52px] md:min-h-[44px] px-6 py-3 bg-red-600 border border-red-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MOBILE USER CARD (shown on < md)
// ─────────────────────────────────────────────────────────────
function UserCard({ 
  user, 
  onRoleChange, 
  onDelete 
}: { 
  user: UserStats; 
  onRoleChange: (uid: string, role: UserStats['role']) => void;
  onDelete: (uid: string, name: string) => void;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);

  const roleBadge = (role: string) => {
    const styles = 
      role === 'admin' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
      role === 'aluno' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
      'border-blue-500/30 text-blue-500 bg-blue-500/5';
    return (
      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-full ${styles}`}>
        {role}
      </span>
    );
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-zinc-950 border border-white/5 p-5 relative"
    >
      {/* Top row: Avatar + Name + Menu */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 flex-shrink-0 bg-zinc-900 flex items-center justify-center font-black text-sm text-emerald-500">
            {user.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-black text-sm uppercase tracking-tight text-white truncate">
              {user.displayName || 'Sem Nome'}
            </div>
            <div className="text-xs text-zinc-500 italic lowercase truncate">
              {user.email}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setActionsOpen(!actionsOpen)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
          aria-label="Ações do usuário"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Badge + Date row */}
      <div className="flex items-center justify-between">
        {roleBadge(user.role)}
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('pt-BR') : 
           user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '---'}
        </span>
      </div>

      {/* Expandable actions panel */}
      <AnimatePresence>
        {actionsOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 mt-4 pt-4 flex flex-col gap-2">
              {/* Quick action: Liberar acesso */}
              {user.role === 'usuario' && (
                <button 
                  onClick={() => { onRoleChange(user.uid!, 'aluno'); setActionsOpen(false); }}
                  className="flex items-center gap-3 w-full min-h-[48px] px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                >
                  <Zap size={16} fill="currentColor" /> Liberar Acesso (Aluno)
                </button>
              )}

              {/* Role changes */}
              {user.role !== 'admin' && (
                <button 
                  onClick={() => { onRoleChange(user.uid!, 'admin'); setActionsOpen(false); }}
                  className="flex items-center gap-3 w-full min-h-[48px] px-4 py-3 bg-zinc-900 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                >
                  <ShieldCheck size={16} /> Tornar Admin
                </button>
              )}
              {user.role !== 'aluno' && user.role !== 'usuario' && (
                <button 
                  onClick={() => { onRoleChange(user.uid!, 'aluno'); setActionsOpen(false); }}
                  className="flex items-center gap-3 w-full min-h-[48px] px-4 py-3 bg-zinc-900 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                >
                  <GraduationCap size={16} /> Tornar Aluno
                </button>
              )}
              <button 
                onClick={() => { onRoleChange(user.uid!, 'usuario'); setActionsOpen(false); }}
                className="flex items-center gap-3 w-full min-h-[48px] px-4 py-3 bg-zinc-900 border border-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                <UserMinus size={16} /> Revogar Acesso (Usuário)
              </button>

              {/* DELETE — visually separated */}
              <div className="border-t border-red-500/10 mt-2 pt-2">
                <button 
                  onClick={() => { onDelete(user.uid!, user.displayName || user.email || 'Sem nome'); setActionsOpen(false); }}
                  className="flex items-center gap-3 w-full min-h-[48px] px-4 py-3 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                >
                  <Trash2 size={16} /> Excluir Conta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN PAGE
// ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'aluno' | 'usuario' | 'admin'>('all');
  const [timeoutError, setTimeoutError] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'live' | 'fallback' | 'error'>('live');
  const unsubRef = useRef<(() => void) | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; uid: string; name: string }>({ open: false, uid: '', name: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Bulk cleanup state
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // ── Real-time listener with fallback ──
  useEffect(() => {
    setLoading(true);
    
    const unsub = subscribeToUsers((data) => {
      console.log('📡 onSnapshot users:', data.length);
      setUsers(data);
      setLoading(false);
      setSyncStatus('live');
      setTimeoutError(false);
    });

    if (unsub) {
      unsubRef.current = unsub;
    } else {
      fetchUsersFallback();
    }

    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('⏱️ onSnapshot timeout — tentando getDocs...');
        fetchUsersFallback();
      }
    }, 8000);

    return () => {
      clearTimeout(safetyTimeout);
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  const fetchUsersFallback = async () => {
    setLoading(true);
    setTimeoutError(false);
    try {
      const data = await getAllUsers();
      console.log('📡 getDocs fallback:', data.length);
      setUsers(data);
      setSyncStatus('fallback');
    } catch (e: any) {
      if (e.message === 'TIMEOUT_BANCO') {
        setTimeoutError(true);
        setSyncStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    setLoading(true);
    const success = await forceFirestoreOnline();
    if (success) {
      if (unsubRef.current) unsubRef.current();
      const unsub = subscribeToUsers((data) => {
        setUsers(data);
        setLoading(false);
        setSyncStatus('live');
        setTimeoutError(false);
      });
      if (unsub) {
        unsubRef.current = unsub;
      } else {
        await fetchUsersFallback();
      }
      setTimeout(() => {
        if (loading) fetchUsersFallback();
      }, 5000);
    } else {
      await fetchUsersFallback();
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserStats['role']) => {
    const success = await updateUserRole(uid, newRole);
    if (success && syncStatus !== 'live') {
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    }
  };

  const handleDeleteUser = async (uid: string, displayName: string) => {
    setDeleteModal({ open: true, uid, name: displayName });
  };

  const confirmDelete = async () => {
    const { uid, name } = deleteModal;
    setIsDeleting(true);
    
    const success = await deleteUserDoc(uid);
    
    setIsDeleting(false);
    setDeleteModal({ open: false, uid: '', name: '' });
    
    if (success) {
      // Remoção otimista imediata da lista — sem esperar o onSnapshot
      setUsers(prev => prev.filter(u => u.uid !== uid));
      setToast({ message: `"${name}" removido do Firestore com sucesso`, type: 'success' });
    } else {
      setToast({ message: 'Erro ao excluir o usuário. Tente novamente.', type: 'error' });
    }
  };

  // Bulk cleanup: remove all ghost users (users without email or with empty data)
  const handleBulkCleanup = async () => {
    const ghostUsers = users.filter(u => !u.email || u.email.trim() === '');
    if (ghostUsers.length === 0) {
      setToast({ message: 'Nenhum rastro fantasma encontrado', type: 'success' });
      return;
    }
    setIsCleaningUp(true);
    let cleaned = 0;
    for (const ghost of ghostUsers) {
      if (ghost.uid) {
        const ok = await deleteUserDoc(ghost.uid);
        if (ok) {
          cleaned++;
          setUsers(prev => prev.filter(u => u.uid !== ghost.uid));
        }
      }
    }
    setIsCleaningUp(false);
    setToast({ message: `${cleaned} rastro(s) fantasma removido(s)`, type: 'success' });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    alunos: users.filter(u => u.role === 'aluno').length,
    usuarios: users.filter(u => u.role === 'usuario').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const handleClearAdminSession = () => {
    localStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-12 px-4 md:px-6">
      
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        <DeleteModal 
          isOpen={deleteModal.open}
          userName={deleteModal.name}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => !isDeleting && setDeleteModal({ open: false, uid: '', name: '' })}
        />
      </AnimatePresence>

      {/* ─── 0. TOP CONTROL BAR ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 md:mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 px-4 md:px-6 py-3 min-h-[44px] bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          <h2 className="text-base md:text-xl font-black uppercase tracking-tighter hidden md:block">Gestão de Comando ITR</h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Sync Status */}
          <div className={`flex items-center gap-2 px-3 md:px-4 py-2 text-[9px] font-black uppercase tracking-widest border ${
            syncStatus === 'live' ? 'border-emerald-500/30 text-emerald-500' :
            syncStatus === 'fallback' ? 'border-amber-500/30 text-amber-500' :
            'border-red-500/30 text-red-500'
          }`}>
            {syncStatus === 'live' ? <Wifi size={12} /> : syncStatus === 'error' ? <WifiOff size={12} /> : <RefreshCw size={12} />}
            <span className="hidden sm:inline">{syncStatus === 'live' ? 'Tempo Real' : syncStatus === 'fallback' ? 'Cache' : 'Offline'}</span>
          </div>

          <button 
            onClick={handleClearAdminSession}
            className="flex items-center gap-2 px-3 md:px-6 py-3 min-h-[44px] bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all overflow-hidden relative group"
          >
            <Lock size={14} className="group-hover:rotate-12 transition-transform" /> 
            <span className="hidden sm:inline">Encerrar Sessão Admin</span>
            <span className="sm:hidden">Sair</span>
          </button>
        </div>
      </div>

      {/* ─── 1. METRICS CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
        <MetricCard label="Total Usuários" value={stats.total} icon={Users} color="text-white" />
        <MetricCard label="Alunos ITR" value={stats.alunos} icon={GraduationCap} color="text-emerald-500" />
        <MetricCard label="Pendentes" value={stats.usuarios} icon={UserPlus} color="text-blue-500" />
        <MetricCard label="Admins" value={stats.admins} icon={Settings} color="text-amber-500" />
      </div>

      {/* ─── 2. FILTERS & SEARCH ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-10">
        {/* Search — full width on mobile, sticky feeling */}
        <div className="relative w-full md:flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            className="w-full bg-zinc-900 border border-white/5 py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all min-h-[48px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter pills — scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
           {(['all', 'aluno', 'usuario', 'admin'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`flex-shrink-0 px-4 md:px-6 py-3 min-h-[44px] text-[10px] font-black uppercase tracking-widest border transition-all ${
                 filter === f ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/5 hover:border-white/20'
               }`}
             >
               {f}
             </button>
           ))}
           <button 
             onClick={handleForceSync} 
             title="Forçar Sincronização"
             className="flex-shrink-0 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
           >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
           <button 
             onClick={handleBulkCleanup}
             disabled={isCleaningUp}
             title="Limpar Rastros Fantasmas"
             className="flex-shrink-0 flex items-center gap-2 px-3 md:px-4 py-3 min-h-[44px] bg-zinc-900 border border-red-500/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-40"
           >
             {isCleaningUp ? <Loader2 size={14} className="animate-spin" /> : <Ghost size={14} />}
             <span className="hidden sm:inline">Limpar Rastros</span>
           </button>
        </div>
      </div>

      {/* ─── 3A. DESKTOP TABLE (hidden on mobile) ─── */}
      <div className="hidden md:block bg-zinc-950 border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Usuário</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">E-mail</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Data de Adesão</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status ITR</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Controle de Acesso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw size={24} className="animate-spin text-emerald-500" />
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Sincronizando com o Banco de Dados...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.uid}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center font-black text-sm text-emerald-500">
                          {user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-black text-sm uppercase tracking-tight">{user.displayName || 'Sem Nome'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-medium text-zinc-500 italic lowercase">{user.email}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('pt-BR') : 
                         user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '---'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-full ${
                        user.role === 'admin' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                        user.role === 'aluno' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                        'border-blue-500/30 text-blue-500 bg-blue-500/5'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                         {user.role === 'usuario' ? (
                           <button 
                             onClick={() => handleRoleChange(user.uid!, 'aluno')}
                             className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all rounded-sm shadow-lg shadow-emerald-500/10"
                           >
                             <Zap size={12} fill="black" /> Liberar Acesso (Aluno)
                           </button>
                         ) : (
                           <div className="flex items-center gap-2">
                             {user.role !== 'admin' && (
                               <button 
                                 onClick={() => handleRoleChange(user.uid!, 'admin')}
                                 className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center border border-amber-500/20 text-amber-500/50 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all"
                                 title="Tornar Admin"
                               >
                                 <ShieldCheck size={14} />
                               </button>
                             )}
                             {user.role !== 'aluno' && (
                               <button 
                                 onClick={() => handleRoleChange(user.uid!, 'aluno')}
                                 className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center border border-emerald-500/20 text-emerald-500/50 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all"
                                 title="Tornar Aluno"
                               >
                                 <GraduationCap size={14} />
                               </button>
                             )}
                             <button 
                               onClick={() => handleRoleChange(user.uid!, 'usuario')}
                               className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center border border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                               title="Revogar Acesso (Usuário)"
                             >
                               <UserMinus size={14} />
                             </button>
                           </div>
                         )}
                      
                          {/* DELETE BUTTON — well separated */}
                          <div className="w-[1px] h-6 bg-white/5 mx-1" />
                          <button 
                            onClick={() => handleDeleteUser(user.uid!, user.displayName || user.email || 'Sem nome')}
                            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center border border-red-900/30 text-red-900/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                            title="Excluir Conta"
                          >
                            <Trash2 size={14} />
                          </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    {timeoutError ? (
                      <div className="flex flex-col items-center gap-4">
                        <WifiOff size={32} className="text-red-500" />
                        <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Conexão Lenta com o Banco de Dados.</span>
                        <button 
                          onClick={handleForceSync} 
                          className="px-8 py-3 min-h-[44px] bg-emerald-500 text-black border border-emerald-500 hover:bg-emerald-400 transition-all text-xs font-black uppercase tracking-[0.2em] rounded-sm flex items-center gap-2"
                        >
                          <Wifi size={14} /> Forçar Sincronização
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Nenhum usuário encontrado no banco de dados.</span>
                    )}
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && !loading && !timeoutError && users.length > 0 && (
          <div className="p-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">
            Nenhum usuário encontrado para este filtro.
          </div>
        )}
      </div>

      {/* ─── 3B. MOBILE CARD LIST (shown on < md) ─── */}
      <div className="block md:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <RefreshCw size={24} className="animate-spin text-emerald-500" />
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
                <UserCard 
                  key={user.uid} 
                  user={user} 
                  onRoleChange={handleRoleChange}
                  onDelete={handleDeleteUser}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : timeoutError ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <WifiOff size={32} className="text-red-500" />
            <span className="text-red-500 font-bold uppercase tracking-widest text-xs text-center">Conexão Lenta com o Banco de Dados.</span>
            <button 
              onClick={handleForceSync} 
              className="px-6 py-3 min-h-[48px] bg-emerald-500 text-black border border-emerald-500 hover:bg-emerald-400 transition-all text-xs font-black uppercase tracking-[0.2em] rounded-sm flex items-center gap-2"
            >
              <Wifi size={14} /> Forçar Sincronização
            </button>
          </div>
        ) : users.length > 0 ? (
          <div className="py-16 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">
            Nenhum usuário encontrado para este filtro.
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">
            Nenhum usuário encontrado no banco de dados.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// METRIC CARD (responsive)
// ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-5 md:p-8 bg-zinc-950 border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <Icon size={20} className={`md:w-6 md:h-6 ${color}`} />
          <span className="text-[8px] md:text-[10px] font-black text-zinc-700 uppercase tracking-widest">Tempo Real</span>
        </div>
        <div className="text-2xl md:text-4xl font-black tracking-tighter mb-1">{value}</div>
        <div className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}
