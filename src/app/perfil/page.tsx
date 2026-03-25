'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, saveUserProfile, getCards, getUserPatente } from '@/lib/srs';
import { UserProfile } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Gem, Trophy, Sprout, Leaf, Activity, Shrub, Trees } from 'lucide-react';
import EvolutionRoadMap from '@/components/profile/EvolutionRoadMap';
import VocabularyMilestones from '@/components/profile/VocabularyMilestones';
import { useTheme } from '@/components/ThemeProvider';

const ICON_MAP: Record<string, any> = {
  'Sprout': Sprout,
  'Leaf': Leaf,
  'Activity': Activity,
  'Shrub': Shrub,
  'Trees': Trees,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({ name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [masteredCount, setMasteredCount] = useState(0);

  const { activeThemeName, setThemeByName } = useTheme();

  useEffect(() => {
    const p = getUserProfile();
    setProfile(p);
    setNewName(p.name);
    
    // Voltando para o contador real de palavras
    const cards = getCards();
    const mCount = cards.filter(c => c.isLearned).length;
    setMasteredCount(mCount);
    
    // Auto set theme when mounting based on current real patente
    const pInfo = getUserPatente(mCount);
    setThemeByName(pInfo.current.name);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    const updated = { ...profile, name: newName };
    saveUserProfile(updated);
    setProfile(updated);
    setIsEditing(false);
  };

  const patenteInfo = getUserPatente(masteredCount);
  // Usa o ícone da patente real
  const realPatenteName = patenteInfo.current.name;
  const PatenteIcon = ICON_MAP[realPatenteName === 'Semente ITR' ? 'Sprout' : realPatenteName === 'Broto de Fluência' ? 'Leaf' : realPatenteName === 'Raiz Forte' ? 'Activity' : realPatenteName === 'Arbusto de Diálogo' ? 'Shrub' : 'Trees'] || Trophy;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      
      {/* 1. SEÇÃO DE PERFIL COM JORNADA DE MAESTRIA INTEGRADA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-6 md:p-10 bg-slate-900 border border-slate-800 relative overflow-hidden mb-12 shadow-2xl flex flex-col items-center w-full"
      >
        <div 
           className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-colors duration-1000 opacity-20"
           style={{ backgroundColor: 'var(--itr-primary)' }} 
        />

        {/* Informações Principais */}
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full mb-12">
          
          <div className="relative group shrink-0 mt-2">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2rem] border flex items-center justify-center bg-slate-800/80 transition-all relative z-10 box-border overflow-hidden" 
                 style={{ borderColor: 'var(--itr-glow)', boxShadow: '0 0 40px var(--itr-glow)' }}>
              <PatenteIcon size={64} className="transition-transform duration-500 group-hover:scale-110" style={{ color: 'var(--itr-primary)' }} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border whitespace-nowrap z-20" style={{ backgroundColor: 'var(--itr-primary)', borderColor: 'var(--itr-glow)' }}>
              {realPatenteName}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full w-full">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div 
                  key="display"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                    <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight">{profile.name}</h1>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800 self-center"
                      title="Editar Nome"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                  <p className="font-bold flex items-center justify-center md:justify-start gap-2" style={{ color: 'var(--itr-primary)' }}>
                    <Gem size={16} />
                    Aluno Premium Método ITR
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 pt-2 w-full"
                >
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-3xl font-bold bg-slate-950 border-2 rounded-xl px-4 py-2 focus:outline-none w-full max-w-sm text-center md:text-left text-white"
                    style={{ borderColor: 'var(--itr-glow)' }}
                    autoFocus
                  />
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button 
                      onClick={handleSave}
                      className="text-white px-6 py-2 rounded-xl text-sm font-bold transition-all font-outfit"
                      style={{ backgroundColor: 'var(--itr-primary)' }}
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-slate-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poder de Fluência Dinâmico */}
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
                  <strong className="text-slate-300">{patenteInfo.wordsToNext} palavras</strong> para elevar sua maestria para {patenteInfo.next.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ROADMAP VISUAL HORIZONTAL */}
        <div className="w-full border-t border-slate-800/80 pt-10">
          <EvolutionRoadMap masteredCount={masteredCount} />
        </div>
      </motion.div>

      {/* 2. MARCOS DE VOCABULÁRIO (NOVO PAINEL QUE SUBSTITUI ESTATÍSTICAS) */}
      <VocabularyMilestones masteredCount={masteredCount} />
    </div>
  );
}
