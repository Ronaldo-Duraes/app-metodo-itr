'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Zap, BookOpen, User, Library, Star, X, HelpCircle, GraduationCap, Settings, UserCircle, LogOut, ChevronRight, Sprout, Leaf, Activity, Shrub, Trees, Trophy } from 'lucide-react';
import { getUserProfile, getUserPatente, getDictionaryCount } from '@/lib/srs';
import MentorCard from '@/components/MentorCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { startTour } from '@/lib/tour';
import { useRoleGuard } from '@/hooks/useRoleGuard';


const PATENTE_ICONS: Record<string, any> = {
  'Sprout': Sprout,
  'Leaf': Leaf,
  'Activity': Activity,
  'Shrub': Shrub,
  'Trees': Trees,
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, isVisitor } = useAuth();
  const { executeProtectedAction } = useRoleGuard();

  // VERCEL BLINDAGEM: Prevents SSR/Hydration errors
  const [mounted, setMounted] = React.useState(false);
  const [isMentorOpen, setIsMentorOpen] = React.useState(false);


  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 🛡️ Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Compute fluency data in real time directly from the local array
  const [masteredCount, setMasteredCount] = React.useState(0);
  
  React.useEffect(() => {
    const updateCount = () => {
       const count = getDictionaryCount();
       if (masteredCount !== count) setMasteredCount(count);
    };
    updateCount();
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, [masteredCount]);

  const patenteInfo = getUserPatente(masteredCount);
  const patenteName = patenteInfo.current.name;
  const PatenteIcon = PATENTE_ICONS[patenteInfo.current.iconName] || Trophy;
  const progressPercent = patenteInfo.next 
    ? Math.min(100, Math.round(((masteredCount - patenteInfo.current.minWords) / ((patenteInfo.next.minWords - patenteInfo.current.minWords) || 1)) * 100))
    : 100;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose?.();
    router.push('/app/perfil?t=' + Date.now());
  };

  const handleNavClick = () => {
    onClose?.();
  };



  const menuItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: Zap, label: 'Atividades', path: '/app/atividades', id: 'tour-atividades' },
    { icon: BookOpen, label: 'Flashcards', path: '/app/flashcards', id: 'tour-flashcards' },
    { icon: GraduationCap, label: 'Acessar Aulas', path: '/app/aulas', id: 'tour-aulas' },
    { icon: Library, label: 'Dicionário Pessoal', path: '/app/dicionario', id: 'tour-dicionario' },
    { icon: Star, label: 'Fale com o Mentor', path: '#mentor', isAction: true },
  ];

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Visitante';
  const firstName = displayName.split(' ')[0];
  const roleLabel = profile?.role === 'admin' ? 'Admin' : profile?.role === 'aluno' ? 'Aluno ITR' : profile?.role === 'usuario' ? 'Usuário' : profile?.role === 'visitante' ? 'Visitante' : user ? 'Usuário' : 'Visitante';

  // ─────────────────────────────────────────────────────────────
  // MOBILE PROFILE HEADER (shown only on mobile drawer)
  // ─────────────────────────────────────────────────────────────
  const MobileProfileHeader = () => (
    <div 
      id="mobile-tour-perfil"
      onClick={handleProfileClick}
      className="mx-4 mb-6 p-4 bg-white/[0.02] border border-white/5 cursor-pointer group hover:border-emerald-500/20 transition-all relative overflow-hidden"
    >
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-[30px] group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative flex items-center gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-white/10 overflow-hidden flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
            {isVisitor ? (
              <UserCircle size={28} className="text-zinc-500 opacity-60" />
            ) : user?.photoURL || profile?.photoURL ? (
              <img src={user?.photoURL || profile?.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-black text-emerald-500 uppercase tracking-tighter">
                {firstName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          {/* Online Status */}
          {!isVisitor && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050505] rounded-full" />
          )}
        </div>

        {/* Name + Role */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-white uppercase tracking-tight truncate leading-none mb-1">
            {firstName}
          </div>
          <div className="text-[9px] font-black text-emerald-500/70 tracking-[0.15em] uppercase leading-none">
            {roleLabel}
          </div>
        </div>

        <ChevronRight size={16} className="text-zinc-600 group-hover:text-emerald-500 transition-colors shrink-0" />
      </div>

      {/* Fluency Power Bar */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <PatenteIcon size={12} className="text-emerald-500" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              {patenteName}
            </span>
          </div>
          <span className="text-[8px] font-black text-emerald-500/60 tracking-widest">
            {masteredCount} palavras
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // DESKTOP SIDEBAR CONTENT
  // ─────────────────────────────────────────────────────────────
  const desktopSidebarContent = (
    <div className="flex flex-col h-full py-8">
      
      {/* LOGO AREA */}
      <div className="px-6 mb-12 flex items-center justify-between">
        <Link href="/" className="relative w-16 h-16" onClick={handleNavClick}>
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
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <div 
                key={item.label}
                onClick={() => {
                  executeProtectedAction(() => setIsMentorOpen(true));
                  handleNavClick();
                }}
                className="group relative flex items-center gap-4 px-4 py-4 min-h-[52px] rounded-none transition-all duration-200 cursor-pointer text-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 border-l-4 border-transparent hover:border-emerald-500"
              >
                <Icon size={20} className="transition-colors duration-200 shrink-0" />
                <span className="font-black text-xs tracking-[0.1em] uppercase">{item.label}</span>
              </div>
            );
          }



          return (
            <Link key={item.path} href={item.path} onClick={handleNavClick}>
              <div id={item.id} className={`
                group relative flex items-center gap-4 px-4 py-4 min-h-[52px] rounded-none transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'bg-white/[0.03] border-l-4 border-emerald-500 text-white shadow-[inset_10px_0_20px_rgba(16,185,129,0.02)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.02] border-l-4 border-transparent'}
              `}>
                <Icon 
                  size={20} 
                  className={`transition-colors duration-200 shrink-0 ${isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="font-black text-xs tracking-[0.1em] uppercase">{item.label}</span>
                
                {/* ACTIVE INDICATOR GLOW */}
                {isActive && (
                  <div className="absolute inset-0 bg-emerald-500/[0.01] blur-2xl -z-10" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* PROFILE FOOTER (DESKTOP) */}
      <div className="px-4 mt-auto pt-8 border-t border-white/5">
        <Link href="/app/perfil" onClick={handleProfileClick}>
          <div id="tour-perfil" className="flex items-center gap-3 p-3 min-h-[52px] text-slate-500 hover:text-white transition-all cursor-pointer group bg-transparent hover:bg-white/[0.03]">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                {isVisitor ? (
                  <UserCircle size={24} className="text-zinc-500 opacity-60" />
                ) : user?.photoURL || profile?.photoURL ? (
                  <img src={user?.photoURL || profile?.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                    {profile?.displayName?.slice(0, 2).toUpperCase() || user?.displayName?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || <User size={18} className="text-zinc-500" />}
                  </span>
                )}
              </div>
              {/* Online Status */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
            </div>
            
            <div className="flex flex-col justify-center overflow-hidden">
              <span className="text-[12px] font-semibold text-white truncate uppercase tracking-tight leading-none mb-1">
                {profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Visitante'}
              </span>
              <span className="text-[9px] font-black text-emerald-500/70 tracking-[0.2em] uppercase leading-none truncate">
                {roleLabel}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // MOBILE SIDEBAR CONTENT (enhanced with profile header + logout)
  // ─────────────────────────────────────────────────────────────
  const mobileSidebarContent = (
    <div className="flex flex-col h-full py-6">
      
      {/* TOP: Logo + Close */}
      <div className="px-5 mb-4 flex items-center justify-between">
        <Link href="/" className="relative w-14 h-14" onClick={handleNavClick}>
          <Image 
            src='/logo-itr.png' 
            alt='Logo ITR' 
            fill
            sizes="100vw"
            priority
            className='object-contain hover:scale-105 transition-transform' 
          />
        </Link>
        <button 
          onClick={onClose}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
          aria-label="Fechar menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* MOBILE PROFILE HEADER */}
      <MobileProfileHeader />

      {/* NAVIGATION LINKS (with visible labels and aligned icons) */}
      <nav className="flex-1 px-3 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <div 
                key={item.label}
                onClick={() => {
                  executeProtectedAction(() => setIsMentorOpen(true));
                  handleNavClick();
                }}
                className="group relative flex items-center gap-4 px-4 py-4 min-h-[52px] rounded-none transition-all duration-200 cursor-pointer text-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 border-l-4 border-transparent hover:border-emerald-500 active:bg-emerald-500/10"
              >
                <Icon size={22} className="transition-colors duration-200 shrink-0" />
                <span className="font-black text-[13px] tracking-[0.08em] uppercase">{item.label}</span>
              </div>
            );
          }



          return (
            <Link key={item.path} href={item.path} onClick={handleNavClick}>
              <div id={item.id ? `mobile-${item.id}` : undefined} className={`
                group relative flex items-center gap-4 px-4 py-4 min-h-[52px] rounded-none transition-all duration-200 cursor-pointer active:bg-white/[0.04]
                ${isActive 
                  ? 'bg-white/[0.03] border-l-4 border-emerald-500 text-white shadow-[inset_10px_0_20px_rgba(16,185,129,0.02)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.02] border-l-4 border-transparent'}
              `}>
                <Icon 
                  size={22} 
                  className={`transition-colors duration-200 shrink-0 ${isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="font-black text-[13px] tracking-[0.08em] uppercase">{item.label}</span>
                
                {isActive && (
                  <div className="absolute inset-0 bg-emerald-500/[0.01] blur-2xl -z-10" />
                )}
              </div>
            </Link>
          );
        })}

        {/* ADMIN LINK (if applicable) */}
        {isAdmin && (
          <Link href="/admin" onClick={handleNavClick}>
            <div className={`
              group relative flex items-center gap-4 px-4 py-4 min-h-[52px] rounded-none transition-all duration-200 cursor-pointer active:bg-white/[0.04]
              ${pathname === '/admin' 
                ? 'bg-amber-500/5 border-l-4 border-amber-500 text-amber-500' 
                : 'text-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5 border-l-4 border-transparent'}
            `}>
              <Settings size={22} className="transition-colors duration-200 shrink-0" />
              <span className="font-black text-[13px] tracking-[0.08em] uppercase">Admin</span>
            </div>
          </Link>
        )}
      </nav>

    </div>
  );

  return (
    <>
      {/* ===================== DESKTOP SIDEBAR (≥768px) ===================== */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-[#050505] border-r border-white/5 z-50 transition-all duration-300">
        {desktopSidebarContent}
      </aside>

      {/* ===================== MOBILE DRAWER (<768px) ===================== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            />
            
            {/* Drawer panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[80vw] max-w-[320px] bg-[#050505] border-r border-white/5 z-[210] overflow-y-auto overscroll-contain"
            >
              {mobileSidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MENTOR MODAL OVERLAY - BLINDAGEM VERCEL & PREMIUM STYLE */}
      <AnimatePresence>
        {isMentorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
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
    </>
  );
};

export default Sidebar;
