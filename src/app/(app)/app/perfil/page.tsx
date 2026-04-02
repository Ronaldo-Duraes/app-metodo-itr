'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { getUserProfile, saveUserProfile, getCards, getUserPatente, getDictionaryCount } from '@/lib/srs';
import { UserProfile } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sprout, Leaf, Activity, Shrub, Trees } from 'lucide-react';
import VocabularyMilestones from '@/components/profile/VocabularyMilestones';
import ProfileFooter from '@/components/profile/ProfileFooter';
import MaestriaRoadmap from '@/components/profile/MaestriaRoadmap';
import MentorCard from '@/components/MentorCard';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile, fetchUserProfile as fetchUserStats } from '@/lib/firebase';
import { useUI } from '@/context/UIContext';
import { useSearchParams, useRouter } from 'next/navigation';

const ICON_MAP: Record<string, any> = {
  'Sprout': Sprout,
  'Leaf': Leaf,
  'Activity': Activity,
  'Shrub': Shrub,
  'Trees': Trees,
};

function ProfileContent() {
  const router = useRouter();
  const { user, profile: authProfile } = useAuth();
  const { showAlert } = useUI();
  const searchParams = useSearchParams();
  const trigger = searchParams.get('t') || 'initial';
  const highlight = searchParams.get('highlight');
  
  const [profile, setProfile] = useState<UserProfile>({ name: '' });
  const journeyRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [masteredCount, setMasteredCount] = useState(0);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const { activeThemeName, setThemeByName } = useTheme();

  useEffect(() => {
    async function syncData() {
      if (!user?.uid) return;
      
      const p = getUserProfile();
      setProfile(p);
      setNewName(authProfile?.displayName || p.name);
      
      try {
        const stats = await fetchUserStats(user.uid);
        if (stats) {
          setMasteredCount(stats.masteredCount);
          setUnlockedRewards(stats.unlockedRewards || []);
          const pInfo = getUserPatente(stats.masteredCount);
          setThemeByName(pInfo.current.name);
        } else {
          const totalVocab = getDictionaryCount();
          setMasteredCount(totalVocab);
          const pInfo = getUserPatente(totalVocab);
          setThemeByName(pInfo.current.name);
        }
      } catch (error) {
        console.error("Erro ao sincronizar com Firebase:", error);
      }
    }
    
    syncData();
  }, [user?.uid, authProfile?.displayName, setThemeByName]);

  // --- LÓGICA DE FOCO NA JORNADA ---
  useEffect(() => {
    if (highlight && journeyRef.current) {
      setTimeout(() => {
        journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlight]);

  const handleSave = async () => {
    if (!user?.uid) return;
    
    try {
       const success = await updateUserProfile(user.uid, { displayName: newName, name: newName } as any);
       if (success) {
          const updated = { ...profile, name: newName, displayName: newName };
          saveUserProfile(updated);
          setProfile(updated);
          setIsEditing(false);
          showAlert('Sucesso', 'Perfil atualizado com sucesso no comando ITR!');
       } else {
          showAlert('Erro', 'Não foi possível salvar a alteração no servidor.');
       }
    } catch (err) {
       showAlert('Erro', 'Falha ao conectar com o banco de dados.');
    }
  };

  const handleToggleSound = (enabled: boolean) => {
    const updated = { ...profile, soundEnabled: enabled };
    saveUserProfile(updated);
    setProfile(updated);
  };

  const patenteInfo = getUserPatente(masteredCount);
  const realPatenteName = patenteInfo.current.name;
  const PatenteIcon = ICON_MAP[realPatenteName === 'Semente ITR' ? 'Sprout' : realPatenteName === 'Broto de Fluência' ? 'Leaf' : realPatenteName === 'Raiz Forte' ? 'Activity' : realPatenteName === 'Arbusto de Diálogo' ? 'Shrub' : 'Trees'] || Trophy;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      
      {/* GUEST WELCOME STATE */}
      {!user && (
        <div className="mb-12 bg-[#0a0a0a] border border-white/5 p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Bem-Vindo ao Perfil</h2>
            <p className="text-slate-400 font-bold mb-8 max-w-xl mx-auto text-xs tracking-widest uppercase">
               Você está navegando como visitante. Para salvar seu progresso, destrinchar conquistas e obter seus certificados ITR, acesse o portal central.
            </p>
            <button 
               onClick={() => router.push('/login')}
               className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-400 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
               Entrar no Portal
            </button>
        </div>
      )}

      {/* 2. SEÇÃO DE PERFIL */}
      <motion.div 
        key={trigger}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-6 md:p-10 bg-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col items-center w-full mb-12"
      >
        <div 
           className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-colors duration-1000 opacity-20"
           style={{ backgroundColor: 'var(--itr-primary)' }} 
        />

        <ProfileFooter 
          profile={profile}
          isEditing={isEditing}
          newName={newName}
          setNewName={setNewName}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
          onToggleSound={handleToggleSound}
          patenteInfo={patenteInfo}
          PatenteIcon={PatenteIcon}
          masteredCount={masteredCount}
        />

        <div ref={journeyRef} className="w-full border-t border-slate-800/80 pt-10">
          <MaestriaRoadmap masteredCount={masteredCount} highlightedMilestone={highlight ? parseInt(highlight) : undefined} />
        </div>
      </motion.div>

      <VocabularyMilestones 
        masteredCount={masteredCount} 
        uid={user?.uid || ''} 
        unlockedRewards={unlockedRewards} 
      />

      <div className="mt-12 w-full">
        <MentorCard />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ProfileContent />
    </Suspense>
  );
}
