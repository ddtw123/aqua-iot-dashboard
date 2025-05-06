"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

type ThemeContextType = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;

    if (storedTheme) {
      setTheme(storedTheme);
      root.classList.toggle('dark', storedTheme === 'dark');
    } else {
      root.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const root = window.document.documentElement;
    root.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}