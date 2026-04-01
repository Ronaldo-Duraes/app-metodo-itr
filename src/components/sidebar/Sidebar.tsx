'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Zap, BookOpen, User, Library, Star, X, HelpCircle, GraduationCap, Settings } from 'lucide-react';
import { getUserProfile } from '@/lib/srs';
import MentorCard from '@/components/MentorCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { startTour } from '@/lib/tour';
import { useRoleGuard } from '@/hooks/useRoleGuard';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin } = useAuth();
  const { executeProtectedAction } = useRoleGuard();

  // VERCEL BLINDAGEM: Prevents SSR/Hydration errors
  const [mounted, setMounted] = React.useState(false);
  const [isMentorOpen, setIsMentorOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/app/perfil?t=' + Date.now());
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: Zap, label: 'Atividades', path: '/app/atividades', id: 'tour-atividades' },
    { icon: BookOpen, label: 'Flashcards', path: '/app/flashcards', id: 'tour-flashcards' },
    { icon: GraduationCap, label: 'Acessar Aulas', path: '/app/aulas', id: 'tour-aulas' },
    { icon: Library, label: 'Dicionário Pessoal', path: '/app/dicionario', id: 'tour-dicionario' },
    { icon: Star, label: 'Fale com o Mentor', path: '#mentor', isAction: true },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-[#050505] border-r border-white/5 z-50 transition-all duration-300">
      <div className="flex flex-col h-full py-8">
        
        {/* LOGO AREA (FIXED WITH NEXT/IMAGE) */}
        <div className="px-6 mb-12 flex items-center justify-between">
            <Link href="/" className="relative w-16 h-16">
              <Image 
                src='/logo-itr.png' 
                alt='Logo ITR' 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className='object-contain hover:scale-105 transition-transform' 
              />
            </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <div 
                  key={item.label}
                  onClick={() => executeProtectedAction(() => setIsMentorOpen(true))}
                  className="group relative flex items-center gap-4 px-4 py-4 rounded-none transition-all duration-200 cursor-pointer text-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 border-l-4 border-transparent hover:border-emerald-500"
                >
                  <Icon size={20} className="transition-colors duration-200" />
                  <span className="font-black text-xs tracking-[0.1em] hidden md:block uppercase">{item.label}</span>
                </div>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                <div id={item.id} className={`
                  group relative flex items-center gap-4 px-4 py-4 rounded-none transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-white/[0.03] border-l-4 border-emerald-500 text-white shadow-[inset_10px_0_20px_rgba(16,185,129,0.02)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02] border-l-4 border-transparent'}
                `}>
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="font-black text-xs tracking-[0.1em] hidden md:block uppercase">{item.label}</span>
                  
                  {/* ACTIVE INDICATOR GLOW */}
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/[0.01] blur-2xl -z-10" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* PROFILE FOOTER (DYNAMIC & CLEAN) */}
        <div className="px-4 mt-auto pt-8 border-t border-white/5">
          <Link href="/app/perfil" onClick={handleProfileClick}>
            <div id="tour-perfil" className="flex items-center gap-3 p-3 text-slate-500 hover:text-white transition-all cursor-pointer group bg-transparent hover:bg-white/[0.03]">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                  {user?.photoURL || profile?.photoURL ? (
                    <img src={user?.photoURL || profile?.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                      {profile?.displayName?.slice(0, 2).toUpperCase() || user?.displayName?.slice(0, 2).toUpperCase() || <User size={18} className="text-zinc-500" />}
                    </span>
                  )}
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
              </div>
              
              <div className="flex flex-col hidden md:flex justify-center overflow-hidden">
                <span className="text-[12px] font-semibold text-white truncate uppercase tracking-tight leading-none mb-1">
                  {profile?.displayName || user?.displayName || ''}
                </span>
                <span className="text-[9px] font-black text-emerald-500/70 tracking-[0.2em] uppercase leading-none truncate">
                  {profile?.role === 'admin' ? 'Admin' : (profile?.role === 'user' || profile?.role === 'aluno') ? 'Aluno' : 'Visitante'}
                </span>
              </div>
            </div>
          </Link>
        </div>

      </div>

      {/* MENTOR MODAL OVERLAY - BLINDAGEM VERCEL & PREMIUM STYLE */}
      <AnimatePresence>
        {isMentorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            {/* Background Click to Close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMentorOpen(false)}
              className="absolute inset-0 cursor-pointer"
            />
            
            <div className="relative z-10 w-full max-w-3xl">
              <MentorCard isModal onClose={() => setIsMentorOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default Sidebar;
