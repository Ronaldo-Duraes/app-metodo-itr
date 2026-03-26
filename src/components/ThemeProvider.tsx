'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeColor = {
  primary: string;
  glow: string;
};

export const THEMES: Record<string, ThemeColor> = {
  'Semente ITR': { primary: '#3b82f6', glow: 'rgba(59,130,246,0.3)' }, // Blue
  'Broto de Fluência': { primary: '#f97316', glow: 'rgba(249,115,22,0.3)' }, // Orange
  'Raiz Forte': { primary: '#ef4444', glow: 'rgba(239,68,68,0.3)' }, // Red
  'Arbusto de Diálogo': { primary: '#BC13FE', glow: 'rgba(188, 19, 254, 0.4)' }, // Cyber Purple
  'Árvore da Fluência': { primary: '#eab308', glow: 'rgba(234,179,8,0.3)' }, // Subtle Gold (Yellow-600)
};

interface ThemeContextType {
  activeThemeName: string;
  setThemeByName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeThemeName: 'Semente ITR',
  setThemeByName: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeName, setActiveThemeName] = useState('Semente ITR');

  useEffect(() => {
    const theme = THEMES[activeThemeName];
    if (!theme) return;
    
    document.documentElement.style.setProperty('--itr-primary', theme.primary);
    document.documentElement.style.setProperty('--itr-glow', theme.glow);
  }, [activeThemeName]);

  return (
    <ThemeContext.Provider value={{ activeThemeName, setThemeByName: setActiveThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}
