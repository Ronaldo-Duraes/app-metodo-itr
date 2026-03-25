'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Zap, label: 'Atividades', path: '/atividades' },
    { icon: BookOpen, label: 'Flashcards', path: '/flashcards' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-[#050505] border-r border-white/5 z-50 transition-all duration-300">
      <div className="flex flex-col h-full py-8">
        
        {/* LOGO AREA (BRANDING) */}
        <div className="px-6 mb-16 flex justify-center">
            <div className="w-full max-w-[140px] aspect-video relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
              {/* PLACEHOLDER PARA LOGO - TROCAR SRC DEPOIS */}
              <img 
                src="https://via.placeholder.com/150x50/000000/FFFFFF?text=LOGO+ITR" 
                alt="ITR Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
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
                    ? 'bg-white/[0.03] border-l-4 border-emerald-500 text-white shadow-[inset_10px_0_15px_rgba(16,185,129,0.02)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02] border-l-4 border-transparent'}
                `}>
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="font-bold text-sm tracking-tight hidden md:block uppercase">{item.label}</span>
                  
                  {/* HOVER GLOW EFFECT */}
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-full bg-emerald-500/[0.02] blur-xl -z-10" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* PROFILE FOOTER (CLICKABLE LINK) */}
        <div className="px-4 mt-auto pt-8 border-t border-white/5">
          <Link href="/perfil">
            <div className="flex items-center gap-3 p-3 text-slate-500 hover:text-white transition-all cursor-pointer group bg-transparent hover:bg-white/[0.02]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                  <User size={18} />
                </div>
                {/* Status Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
              </div>
              
              <div className="flex flex-col hidden md:block overflow-hidden">
                <span className="text-xs font-black text-white truncate uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                  RONALDO DURAES
                </span>
                <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">
                  Ver Perfil
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
