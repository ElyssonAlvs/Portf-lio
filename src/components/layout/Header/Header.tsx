import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { ThemeToggle } from '../../ui/ThemeToggle/ThemeToggle';
import { LanguageToggle } from '../../ui/LanguageToggle/LanguageToggle';
import styles from './Header.module.css';

export const Header = () => {
  const { language } = useLanguage();
  const t = translations[language].nav;

  const navItems = [
    { label: t.about, href: '#about' },
    { label: t.experience, href: '#experience' },
    { label: t.skills, href: '#skills' },
    { label: t.projects, href: '#projects' },
    { label: t.publications, href: '#publications' },
    { label: t.contact, href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={styles.header}>
      <a
        href="#"
        className={styles.logo}
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      >
        Elysson Alves.
      </a>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.navLink}
            onClick={(e) => handleNavClick(e, item.href)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.controls}>
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
};
