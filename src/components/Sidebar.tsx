'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, User, PlusCircle, LayoutGrid, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: Zap, label: 'Home', path: '/atividades' },
    { icon: BookOpen, label: 'Flashcards', path: '/flashcards' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-[#050505] border-r border-white/5 z-50 transition-all duration-300">
      <div className="flex flex-col h-full py-8">
        {/* LOGO AREA */}
        <div className="px-6 mb-12">
          <div className="w-10 h-10 md:w-full md:h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="text-white font-black text-xs md:text-sm tracking-tighter uppercase px-2 hidden md:block">Metodo ITR</span>
             <Zap className="text-white md:hidden" size={20} fill="currentColor" />
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
                    ? 'bg-white/[0.03] border-l-4 border-emerald-500 text-white' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02] border-l-4 border-transparent'}
                `}>
                  <Icon 
                    size={22} 
                    className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'}`} 
                    fill={isActive ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="font-bold text-sm tracking-tight hidden md:block">{item.label}</span>
                  
                  {/* HOVER GLOW EFFECT */}
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/5 blur-xl -z-10 rounded-full opacity-50" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER / USER STATUS */}
        <div className="px-4 mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:text-white transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
              <User size={16} />
            </div>
            <div className="flex flex-col hidden md:block overflow-hidden">
               <span className="text-xs font-black text-white truncate">RONALDO D.</span>
               <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Elite v1</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
