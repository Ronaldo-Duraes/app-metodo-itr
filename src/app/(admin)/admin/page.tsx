'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  Zap, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  UserMinus, 
  Settings, 
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { getAllUsers, updateUserRole, UserStats } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'aluno' | 'lead' | 'admin'>('all');

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserStats['role']) => {
    const success = await updateUserRole(uid, newRole);
    if (success) {
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    }
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
    leads: users.filter(u => u.role === 'lead').length,
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

        <button 
          onClick={handleClearAdminSession}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all overflow-hidden relative group"
        >
          <Lock size={14} className="group-hover:rotate-12 transition-transform" /> 
          Encerrar Sessão Admin
        </button>
      </div>

      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricCard label="Total Usuários" value={stats.total} icon={Users} color="text-white" />
        <MetricCard label="Alunos ITR" value={stats.alunos} icon={GraduationCap} color="text-emerald-500" />
        <MetricCard label="Leads Acadêmicos" value={stats.leads} icon={UserPlus} color="text-blue-500" />
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
           {(['all', 'aluno', 'lead', 'admin'] as const).map(f => (
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
           <button onClick={fetchUsers} className="p-3 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all">
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
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Role Atual</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Controle de Acesso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
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
                    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-full ${
                      user.role === 'admin' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                      user.role === 'aluno' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                      'border-blue-500/30 text-blue-500 bg-blue-500/5'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {user.role !== 'admin' && (
                         <button 
                           onClick={() => handleRoleChange(user.uid!, 'admin')}
                           className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-all"
                           title="Tornar Admin"
                         >
                           <ShieldCheck size={16} />
                         </button>
                       )}
                       {user.role !== 'aluno' && (
                         <button 
                           onClick={() => handleRoleChange(user.uid!, 'aluno')}
                           className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                           title="Promover a Aluno"
                         >
                           <GraduationCap size={16} />
                         </button>
                       )}
                       {user.role !== 'lead' && (
                         <button 
                           onClick={() => handleRoleChange(user.uid!, 'lead')}
                           className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-black transition-all"
                           title="Reverter para Lead"
                         >
                           <UserMinus size={16} />
                         </button>
                       )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && !loading && (
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
