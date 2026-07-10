import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import styles from './Header.module.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[language].nav;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'experience', label: t.experience },
    { id: 'skills', label: t.skills },
    { id: 'projects', label: t.projects },
    { id: 'publications', label: t.publications },
    { id: 'contact', label: t.contact }
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.container}`}>
        <button onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }} className={styles.logo}>
          Elysson<span>.</span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navLink} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <button 
            className={styles.actionBtn} 
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>
          <button 
            className={styles.actionBtn} 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button 
            className={`${styles.menuBtn} ${isMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
