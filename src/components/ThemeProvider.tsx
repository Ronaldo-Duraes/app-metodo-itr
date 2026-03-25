'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeColor = {
  primary: string;
  glow: string;
};

export const THEMES: Record<string, ThemeColor> = {
  'Semente ITR': { primary: '#3b82f6', glow: 'rgba(59,130,246,0.5)' }, // Blue
  'Broto de Fluência': { primary: '#f97316', glow: 'rgba(249,115,22,0.5)' }, // Orange
  'Raiz Forte': { primary: '#ef4444', glow: 'rgba(239,68,68,0.5)' }, // Red
  'Arbusto de Diálogo': { primary: '#10b981', glow: 'rgba(16,185,129,0.5)' }, // Green
  'Árvore da Fluência': { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.5)' }, // Default Purple
};

interface ThemeContextType {
  activeThemeName: string;
  setThemeByName: (name: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeThemeName: 'Semente ITR',
  setThemeByName: () => {},
  customColor: '#8b5cf6',
  setCustomColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeName, setActiveThemeName] = useState('Semente ITR');
  const [customColor, setCustomColor] = useState('#8b5cf6');

  useEffect(() => {
    const theme = THEMES[activeThemeName];
    if (!theme) return;
    
    let primary = theme.primary;
    let glow = theme.glow;

    if (activeThemeName === 'Árvore da Fluência') {
      primary = customColor;
      glow = `${customColor}80`; // Tenta construir um hex com 50% opacity
    }

    document.documentElement.style.setProperty('--itr-primary', primary);
    document.documentElement.style.setProperty('--itr-glow', glow);
  }, [activeThemeName, customColor]);

  return (
    <ThemeContext.Provider value={{ activeThemeName, setThemeByName: setActiveThemeName, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
