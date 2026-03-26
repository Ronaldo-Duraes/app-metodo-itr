'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Zap, BookOpen, User } from 'lucide-react';
import { getUserProfile } from '@/lib/srs';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = React.useState({ name: "RONALDO DURAES" });

  React.useEffect(() => {
    const p = getUserProfile();
    if (p && p.name) setProfile(p);
  }, []);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/perfil?t=' + Date.now());
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Zap, label: 'Atividades', path: '/atividades' },
    { icon: BookOpen, label: 'Flashcards', path: '/flashcards' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-[#050505] border-r border-white/5 z-50 transition-all duration-300">
      <div className="flex flex-col h-full py-8">
        
        {/* LOGO AREA (FIXED WITH NEXT/IMAGE) */}
        <div className="px-6 mb-12 flex justify-center">
            <Link href="/" className="relative w-24 h-24">
              <Image 
                src='/logo-itr.png' 
                alt='Logo ITR' 
                fill
                priority
                className='object-contain drop-shadow-[0_0_15px_rgba(188,19,254,0.15)] hover:scale-105 transition-transform' 
              />
            </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <div className={`
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
          <Link href="/perfil" onClick={handleProfileClick}>
            <div className="flex items-center gap-3 p-3 text-slate-500 hover:text-white transition-all cursor-pointer group bg-transparent hover:bg-white/[0.03]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                  <User size={18} />
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
              </div>
              
              <div className="flex flex-col hidden md:flex justify-center h-full">
                <span className="text-[12px] font-semibold text-white truncate uppercase tracking-tight leading-none">
                  {profile.name}
                </span>
                <span className="text-[9px] font-black text-[#BC13FE] tracking-[0.2em] uppercase mt-1 leading-none opacity-90">
                  ALUNO
                </span>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
