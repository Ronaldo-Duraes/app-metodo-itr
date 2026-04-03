'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  WifiOff
} from 'lucide-react';
import { getAllUsers, updateUserRole, UserStats, subscribeToUsers, forceFirestoreOnline } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'aluno' | 'usuario' | 'admin'>('all');
  const [timeoutError, setTimeoutError] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'live' | 'fallback' | 'error'>('live');
  const unsubRef = useRef<(() => void) | null>(null);

  // Tenta listener real-time primeiro, fallback para one-shot
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
      // Fallback: Firebase não está pronto
      fetchUsersFallback();
    }

    // Timeout de segurança: se onSnapshot não entregar em 8s, faz getDocs
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
      // Re-attach listener
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
      // Safety timeout
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
      // Se não está em modo live, atualiza local
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    }
    // Se estiver em modo live, o onSnapshot entrega a atualização automaticamente
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
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* 0. TOP CONTROL BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl"
          >
            <ArrowLeft size={16} /> Voltar para o App
          </button>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          <h2 className="text-xl font-black uppercase tracking-tighter hidden md:block">Gestão de Comando ITR</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync Status Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest border ${
            syncStatus === 'live' ? 'border-emerald-500/30 text-emerald-500' :
            syncStatus === 'fallback' ? 'border-amber-500/30 text-amber-500' :
            'border-red-500/30 text-red-500'
          }`}>
            {syncStatus === 'live' ? <Wifi size={12} /> : syncStatus === 'error' ? <WifiOff size={12} /> : <RefreshCw size={12} />}
            {syncStatus === 'live' ? 'Tempo Real' : syncStatus === 'fallback' ? 'Cache' : 'Offline'}
          </div>

          <button 
            onClick={handleClearAdminSession}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all overflow-hidden relative group"
          >
            <Lock size={14} className="group-hover:rotate-12 transition-transform" /> 
            Encerrar Sessão Admin
          </button>
        </div>
      </div>

      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricCard label="Total Usuários" value={stats.total} icon={Users} color="text-white" />
        <MetricCard label="Alunos ITR" value={stats.alunos} icon={GraduationCap} color="text-emerald-500" />
        <MetricCard label="Usuários Pendentes" value={stats.usuarios} icon={UserPlus} color="text-blue-500" />
        <MetricCard label="Administradores" value={stats.admins} icon={Settings} color="text-amber-500" />
      </div>

      {/* 2. FILTERS & ACTIONS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            className="w-full bg-zinc-900 border border-white/5 py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
           {(['all', 'aluno', 'usuario', 'admin'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                 filter === f ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/5 hover:border-white/20'
               }`}
             >
               {f}
             </button>
           ))}
           <button 
             onClick={handleForceSync} 
             title="Forçar Sincronização"
             className="p-3 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
           >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* 3. USERS TABLE */}
      <div className="bg-zinc-950 border border-white/5 overflow-hidden">
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
                             className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all rounded-sm shadow-lg shadow-emerald-500/10"
                           >
                             <Zap size={12} fill="black" /> Liberar Acesso (Aluno)
                           </button>
                         ) : (
                           <div className="flex items-center gap-2">
                             {user.role !== 'admin' && (
                               <button 
                                 onClick={() => handleRoleChange(user.uid!, 'admin')}
                                 className="p-2 border border-amber-500/20 text-amber-500/50 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all"
                                 title="Tornar Admin"
                               >
                                 <ShieldCheck size={14} />
                               </button>
                             )}
                             {user.role !== 'aluno' && (
                               <button 
                                 onClick={() => handleRoleChange(user.uid!, 'aluno')}
                                 className="p-2 border border-emerald-500/20 text-emerald-500/50 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all"
                                 title="Tornar Aluno"
                               >
                                 <GraduationCap size={14} />
                               </button>
                             )}
                             <button 
                               onClick={() => handleRoleChange(user.uid!, 'usuario')}
                               className="p-2 border border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                               title="Revogar Acesso (Usuário)"
                             >
                               <UserMinus size={14} />
                             </button>
                           </div>
                         )}
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
                          className="px-8 py-3 bg-emerald-500 text-black border border-emerald-500 hover:bg-emerald-400 transition-all text-xs font-black uppercase tracking-[0.2em] rounded-sm flex items-center gap-2"
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
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-8 bg-zinc-950 border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon size={24} className={color} />
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Tempo Real</span>
        </div>
        <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}
