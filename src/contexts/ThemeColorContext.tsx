import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor = 'teal' | 'indigo' | 'rose' | 'emerald' | 'amber' | 'slate';

export const themeOptions: { value: ThemeColor; label: string; preview: string }[] = [
  { value: 'teal', label: '青藍', preview: 'linear-gradient(135deg, hsl(195,80%,35%), hsl(210,70%,45%))' },
  { value: 'indigo', label: '靛藍', preview: 'linear-gradient(135deg, hsl(235,70%,50%), hsl(250,65%,55%))' },
  { value: 'rose', label: '玫瑰', preview: 'linear-gradient(135deg, hsl(345,75%,50%), hsl(355,70%,55%))' },
  { value: 'emerald', label: '翠綠', preview: 'linear-gradient(135deg, hsl(160,70%,38%), hsl(170,60%,45%))' },
  { value: 'amber', label: '琥珀', preview: 'linear-gradient(135deg, hsl(35,92%,50%), hsl(25,85%,50%))' },
  { value: 'slate', label: '石墨', preview: 'linear-gradient(135deg, hsl(220,15%,35%), hsl(215,20%,45%))' },
];

interface ThemeColorContextType {
  color: ThemeColor;
  setColor: (c: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

const themes: Record<ThemeColor, Record<string, string>> = {
  teal: {
    '--primary': '195 80% 35%',
    '--primary-foreground': '0 0% 100%',
    '--ring': '195 80% 45%',
    '--accent': '35 92% 50%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-primary': 'linear-gradient(135deg, hsl(195 80% 35%) 0%, hsl(210 70% 45%) 100%)',
    '--gradient-accent': 'linear-gradient(135deg, hsl(35 92% 50%) 0%, hsl(25 95% 55%) 100%)',
    '--shadow-glow': '0 0 20px hsl(195 80% 45% / 0.2)',
  },
  indigo: {
    '--primary': '235 70% 50%',
    '--primary-foreground': '0 0% 100%',
    '--ring': '235 70% 55%',
    '--accent': '280 65% 55%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-primary': 'linear-gradient(135deg, hsl(235 70% 50%) 0%, hsl(250 65% 55%) 100%)',
    '--gradient-accent': 'linear-gradient(135deg, hsl(280 65% 55%) 0%, hsl(290 60% 60%) 100%)',
    '--shadow-glow': '0 0 20px hsl(235 70% 55% / 0.2)',
  },
  rose: {
    '--primary': '345 75% 50%',
    '--primary-foreground': '0 0% 100%',
    '--ring': '345 75% 55%',
    '--accent': '15 90% 55%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-primary': 'linear-gradient(135deg, hsl(345 75% 50%) 0%, hsl(355 70% 55%) 100%)',
    '--gradient-accent': 'linear-gradient(135deg, hsl(15 90% 55%) 0%, hsl(25 85% 55%) 100%)',
    '--shadow-glow': '0 0 20px hsl(345 75% 55% / 0.2)',
  },
  emerald: {
    '--primary': '160 70% 38%',
    '--primary-foreground': '0 0% 100%',
    '--ring': '160 70% 45%',
    '--accent': '45 90% 50%',
    '--accent-foreground': '0 0% 10%',
    '--gradient-primary': 'linear-gradient(135deg, hsl(160 70% 38%) 0%, hsl(170 60% 45%) 100%)',
    '--gradient-accent': 'linear-gradient(135deg, hsl(45 90% 50%) 0%, hsl(40 85% 55%) 100%)',
    '--shadow-glow': '0 0 20px hsl(160 70% 45% / 0.2)',
  },
  amber: {
    '--primary': '35 92% 45%',
    '--primary-foreground': '0 0% 100%',
    '--ring': '35 92% 50%',
    '--accent': '195 70% 45%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-primary': 'linear-gradient(135deg, hsl(35 92% 45%) 0%, hsl(25 85% 50%) 100%)',
    '--gradient-accent': 'linear-gradient(135deg, hsl(195 70% 45%) 0%, hsl(205 65% 50%) 100%)',
    '--shadow-glow': '0 0 20px hsl(35 92% 50% / 0.2)',
  },
  slate: {
    '--primary': '220 15% 35%',
    '--primary-foreground': '0 0% 100%',
    '--ring': '220 15% 45%',
    '--accent': '200 60% 50%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-primary': 'linear-gradient(135deg, hsl(220 15% 35%) 0%, hsl(215 20% 45%) 100%)',
    '--gradient-accent': 'linear-gradient(135deg, hsl(200 60% 50%) 0%, hsl(210 55% 55%) 100%)',
    '--shadow-glow': '0 0 20px hsl(220 15% 45% / 0.2)',
  },
};

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<ThemeColor>(() => {
    return (localStorage.getItem('theme-color') as ThemeColor) || 'teal';
  });

  useEffect(() => {
    localStorage.setItem('theme-color', color);
    const root = document.documentElement;
    const vars = themes[color];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [color]);

  return (
    <ThemeColorContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const ctx = useContext(ThemeColorContext);
  if (!ctx) throw new Error('useThemeColor must be used within ThemeColorProvider');
  return ctx;
}
