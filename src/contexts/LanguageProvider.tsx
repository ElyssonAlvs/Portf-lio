import { useState, type ReactNode } from 'react';
import { LanguageContext, type Language } from './LanguageContext';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'pt' || savedLang === 'en') {
      return savedLang;
    }
    // Default to portuguese if locale is pt-BR, else let them choose (defaulting to pt)
    const userLang = navigator.language;
    return userLang.startsWith('pt') ? 'pt' : 'en';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'pt' ? 'en' : 'pt';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
