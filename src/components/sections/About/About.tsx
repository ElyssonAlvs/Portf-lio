import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import styles from './About.module.css';

import elyssonImg from '../../../assets/images/elysson.jpg';

export const About = () => {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <AnimatedSection id="about">
      <SectionTitle title={t.title} />
      
      <div className={styles.aboutGrid}>
        <div className={styles.imageContainer}>
          <img src={elyssonImg} alt="Elysson Alves" className={styles.image} />
          <div className={styles.imageDecoration} />
        </div>
        
        <div>
          <p className={styles.bio}>{t.bio}</p>
        </div>
      </div>
    </AnimatedSection>
  );
};
