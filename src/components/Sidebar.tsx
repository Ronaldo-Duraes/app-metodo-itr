'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  Trophy,
  Map,
  User
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Estudar', path: '/estudar', icon: Layers },
  { name: 'Adicionar', path: '/adicionar', icon: PlusCircle },
  { name: 'Atividades', path: '/atividades', icon: Map },
  { name: 'Perfil', path: '/perfil', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-6 fixed left-0 top-0">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-outfit font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Método ITR
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Plataforma de Fluência</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1 h-4 bg-blue-400 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
          <Trophy size={20} />
          <span className="text-sm font-medium">Nível: Iniciante</span>
        </div>
      </div>
    </aside>
  );
}
