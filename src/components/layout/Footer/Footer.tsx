import { useLanguage } from '../../../contexts/LanguageContext';
import styles from './Footer.module.css';

export const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; {currentYear} Elysson Alves. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
      </p>
    </footer>
  );
};
