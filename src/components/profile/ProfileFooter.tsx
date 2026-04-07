'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Gem } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { UserStats } from '@/lib/firebase';

interface ProfileFooterProps {
  profile: UserProfile;
  authProfile?: UserStats | null;
  isEditing: boolean;
  newName: string;
  setNewName: (name: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  handleSave: () => void;
  onToggleSound: (enabled: boolean) => void;
  patenteInfo: any;
  PatenteIcon: any;
  masteredCount: number;
}

const ProfileFooter = ({
  profile,
  authProfile,
  isEditing,
  newName,
  setNewName,
  setIsEditing,
  handleSave,
  onToggleSound,
  patenteInfo,
  PatenteIcon,
  masteredCount
}: ProfileFooterProps) => {
  const { user } = useAuth();

  // Prioridade: authProfile (Firestore live) > profile local
  const displayName = authProfile?.displayName || authProfile?.name || profile.displayName || profile.name || 'Visitante';

  return (
    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 relative z-10 w-full mb-8 md:mb-12">
      
      {/* Avatar / Rank Icon */}
      <div className="relative group shrink-0 mt-2">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-[1.5rem] md:rounded-[2rem] border flex items-center justify-center bg-slate-800/80 transition-all relative z-10 box-border overflow-hidden" 
             style={{ borderColor: 'var(--itr-glow)', boxShadow: '0 0 40px var(--itr-glow)' }}>
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <PatenteIcon size={64} className="transition-transform duration-500 group-hover:scale-110" style={{ color: 'var(--itr-primary)' }} strokeWidth={1.5} />
          )}
        </div>
        <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg border whitespace-nowrap z-20" style={{ backgroundColor: 'var(--itr-primary)', borderColor: 'var(--itr-glow)' }}>
          {patenteInfo.current.name}
        </div>
      </div>

      <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full w-full">
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div key="display" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3 pt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                <h1 className="text-2xl md:text-5xl font-black font-outfit text-white tracking-tight">{displayName}</h1>
                {user && (
                  <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800 self-center">
                    <Edit3 size={18} />
                  </button>
                )}
              </div>
              <p className="font-bold flex items-center justify-center md:justify-start gap-2" style={{ color: 'var(--itr-primary)' }}>
                <Gem size={16} /> Aluno Premium Método ITR
              </p>
              
              {/* TOGGLE DE SOM (INDUSTRIAL) */}
              <div className="flex items-center gap-4 justify-center md:justify-start pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Efeitos Sonoros</span>
                  <p className="text-[9px] text-slate-600 hidden md:block uppercase font-bold">Feedback auditivo de progresso</p>
                </div>
                <button 
                  onClick={() => onToggleSound(!profile.soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 border ${profile.soundEnabled ? 'border-[var(--itr-primary)] shadow-[0_0_10px_var(--itr-glow)]' : 'border-slate-800 bg-slate-950'}`}
                  style={{ backgroundColor: profile.soundEnabled ? 'var(--itr-primary)' : 'transparent' }}
                >
                  <motion.div 
                    animate={{ x: profile.soundEnabled ? 26 : 2 }}
                    className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-colors ${profile.soundEnabled ? 'bg-white' : 'bg-slate-700'}`}
                  />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="edit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 pt-2 w-full">
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }} 
                className="text-3xl font-bold bg-slate-950 border-2 rounded-xl px-4 py-2 focus:outline-none w-full max-w-sm text-center md:text-left text-white"  
                style={{ borderColor: 'var(--itr-glow)' }} 
                autoFocus 
              />
              <div className="flex gap-3 justify-center md:justify-start">
                <button onClick={handleSave} className="text-white px-6 py-2 rounded-xl text-sm font-bold transition-all font-outfit" style={{ backgroundColor: 'var(--itr-primary)' }}>Salvar</button>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Cancelar</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {patenteInfo.next && (
          <div className="mt-8 md:mt-6 pt-4 border-t border-slate-800/50 w-full max-w-sm mx-auto md:mx-0">
            <div className="flex justify-between text-[11px] mb-1.5 font-bold">
              <span className="text-slate-400 uppercase tracking-widest">Poder de Fluência</span>
              <span style={{ color: 'var(--itr-primary)' }}>{masteredCount} / {patenteInfo.next.minWords}</span>
            </div>
            <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full transition-all duration-1000 rounded-full shadow-[0_0_15px_var(--itr-glow)]"
                style={{ 
                  backgroundColor: 'var(--itr-primary)',
                  width: `${Math.max(5, (masteredCount - patenteInfo.current.minWords) / ((patenteInfo.next.minWords - patenteInfo.current.minWords) || 1) * 100)}%` 
                }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              <strong className="text-slate-300">{patenteInfo.wordsToNext} palavras</strong> para {patenteInfo.next.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFooter;
