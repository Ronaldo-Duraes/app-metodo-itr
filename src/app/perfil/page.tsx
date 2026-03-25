'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, saveUserProfile, getCards } from '@/lib/srs';
import { UserProfile } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Edit3, 
  CheckCircle,
  Gem,
  Award,
  Zap
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({ name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [masteredCount, setMasteredCount] = useState(0);

  useEffect(() => {
    const p = getUserProfile();
    setProfile(p);
    setNewName(p.name);
    
    // Calcula masterizadas (isLearned = true)
    const cards = getCards();
    setMasteredCount(cards.filter(c => c.isLearned).length);
  }, []);

  const handleSave = () => {
    const updated = { ...profile, name: newName };
    saveUserProfile(updated);
    setProfile(updated);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-10 bg-gradient-to-br from-slate-900 to-indigo-900/10 mb-12"
      >
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 flex items-center justify-center bg-slate-800 transition-all group-hover:border-blue-500/50 shadow-2xl relative z-10">
              <User size={64} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div 
                  key="display"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2"
                >
                  <h1 className="text-4xl font-bold font-outfit">{profile.name}</h1>
                  <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                    <Gem size={16} className="text-blue-400" />
                    Aluno Premium Método ITR
                  </p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/5 px-4 py-2 rounded-full border border-blue-400/20"
                  >
                    <Edit3 size={14} /> Editar Nome
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-3xl font-bold bg-slate-800 border-2 border-blue-500/50 rounded-xl px-4 py-2 focus:outline-none w-full max-w-sm"
                    autoFocus
                  />
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all font-outfit"
                    >
                      Salvar Alterações
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-slate-400 hover:bg-slate-800 px-6 py-2 rounded-xl text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Palavras Masterizadas', value: masteredCount, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
          { label: 'Dias de Ofensiva', value: '4', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/5' },
          { label: 'Conquistas ITR', value: '8', icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`premium-card p-6 flex items-center gap-5 ${stat.bg} border-slate-800 hover:border-slate-700 transition-colors`}
          >
            <div className={`p-3 rounded-2xl ${stat.bg.replace('/5', '/10')}`}>
              <stat.icon className={stat.color} size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold font-outfit">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
