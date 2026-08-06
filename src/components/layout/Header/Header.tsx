import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import styles from './Header.module.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2.5"/>
    <path d="M12 19.5V22"/>
    <path d="m4.93 4.93 1.77 1.77"/>
    <path d="m17.3 17.3 1.77 1.77"/>
    <path d="M2 12h2.5"/>
    <path d="M19.5 12H22"/>
    <path d="m6.7 17.3-1.77 1.77"/>
    <path d="m19.07 4.93-1.77 1.77"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    <path d="M19 3v2M20 4h-2" strokeWidth="1.8" opacity="0.8"/>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
    <path d="M2 12h20"/>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

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
            title={language === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
          >
            <GlobeIcon />
            <span className="font-mono text-xs font-bold ml-1">{language === 'pt' ? 'EN' : 'PT'}</span>
          </button>
          <button 
            className={styles.actionBtn} 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button 
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};
