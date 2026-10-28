import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      localStorage.removeItem('theme');
      const savedTheme = localStorage.getItem('portfolio_theme');
      if (savedTheme === 'light') {
        return 'light';
      }
    } catch {
      // Safe fallback if localStorage is blocked
    }
    return 'dark'; // Default: Dark Mode
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Tailwind/Shadcn uses the .dark class on <html>
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('portfolio_theme', theme);
    } catch {
      // Safe fallback if localStorage is blocked
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
