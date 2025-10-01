import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    surface: string;
    border: string;
    danger: string;
    success: string;
  };
};

const light: Theme = {
  colors: {
    background: '#ffffff',
    text: '#0b0b0b',
    primary: '#16a34a',
    secondary: '#6b7280',
    surface: '#f8fafc',
    border: '#e5e7eb',
    danger: '#ef4444',
    success: '#16a34a',
  },
};

const dark: Theme = {
  colors: {
    background: '#000000',
    text: '#e5e7eb',
    primary: '#22c55e',
    secondary: '#9ca3af',
    surface: '#0f172a',
    border: '#1f2937',
    danger: '#ef4444',
    success: '#34d399',
  },
};

type ThemeContextType = {
  theme: Theme;
  mode: 'light' | 'dark';
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark'>(system === 'dark' ? 'dark' : 'light');

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const value = useMemo<ThemeContextType>(() => ({ theme: mode === 'dark' ? dark : light, mode, toggle }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
