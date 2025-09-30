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
    text: '#111827',
    primary: '#2563eb',
    secondary: '#6b7280',
    surface: '#f3f4f6',
    border: '#e5e7eb',
    danger: '#dc2626',
    success: '#16a34a',
  },
};

const dark: Theme = {
  colors: {
    background: '#0b1220',
    text: '#e5e7eb',
    primary: '#60a5fa',
    secondary: '#9ca3af',
    surface: '#111827',
    border: '#1f2937',
    danger: '#f87171',
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
