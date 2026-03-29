'use client';

import { useEffect, useState, useRef } from 'react';
import { getUserProfile, saveUserProfile, getCards, getUserPatente, getDictionaryCount } from '@/lib/srs';
import { UserProfile } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Gem, Trophy, Sprout, Leaf, Activity, Shrub, Trees } from 'lucide-react';
import VocabularyMilestones from '@/components/profile/VocabularyMilestones';
import ProfileFooter from '@/components/profile/ProfileFooter';
import MaestriaRoadmap from '@/components/profile/MaestriaRoadmap';
import MentorCard from '@/components/MentorCard';
import { useTheme } from '@/components/ThemeProvider';
import { fetchUserStats } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ICON_MAP: Record<string, any> = {
  'Sprout': Sprout,
  'Leaf': Leaf,
  'Activity': Activity,
  'Shrub': Shrub,
  'Trees': Trees,
};

function ProfileContent() {
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

  // Mock UID para teste
  const [uid] = useState('user_test_99'); 

  useEffect(() => {
    async function syncData() {
      const p = getUserProfile();
      setProfile(p);
      setNewName(p.name);
      
      try {
        const stats = await fetchUserStats(uid);
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
  }, [uid, setThemeByName]);

  // --- LÓGICA DE FOCO NA JORNADA ---
  useEffect(() => {
    if (highlight && journeyRef.current) {
      setTimeout(() => {
        journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500); // Delay buffer para carregamento de componentes
    }
  }, [highlight]);

  const handleSave = () => {
    const updated = { ...profile, name: newName };
    saveUserProfile(updated);
    setProfile(updated);
    setIsEditing(false);
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
      
      {/* CONTROLE DE DEBUG (SLIDER REAL-TIME) */}
      <div className="max-w-md mx-auto mb-12 p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl border-dashed">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ferramenta de Debug - Progresso</span>
          <span className="text-xl font-black font-outfit" style={{ color: 'var(--itr-primary)' }}>{masteredCount}</span>
        </div>
        <input 
          type="range" min="0" max="1500" step="1" value={masteredCount} 
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setMasteredCount(val);
            const pInfo = getUserPatente(val);
            setThemeByName(pInfo.current.name);
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--itr-primary)]"
        />
      </div>

      {/* 2. SEÇÃO DE PERFIL COM MENTOR CARD INTEGRADO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-start">
        <div className="lg:col-span-2">
          <motion.div 
            key={trigger}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-6 md:p-10 bg-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col items-center w-full"
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
        </div>

        <div className="lg:sticky lg:top-8">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Dica do Mestre</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Foque nos gatilhos de ação PAC hoje. O cérebro aprende 3x mais rápido quando associamos movimento ao som."
            </p>
          </div>
        </div>
      </div>

      <VocabularyMilestones 
        masteredCount={masteredCount} 
        uid={uid} 
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
