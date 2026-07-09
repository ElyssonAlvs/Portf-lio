import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import styles from './Footer.module.css';

export const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; {currentYear} Elysson Alves. {t.made_with} React & Framer Motion.
      </p>
    </footer>
  );
};
