import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { skillCategories } from '../../../data/skills';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import styles from './Skills.module.css';

export const Skills = () => {
  const { language } = useLanguage();
  const t = translations[language].skills;

  return (
    <AnimatedSection id="skills" className="w-full">
      <SectionTitle title={t.title} />

      <div className={styles.matrix}>
        {skillCategories.map((category, index) => {
          const itemsString = category.items
            .map((item) => (typeof item === 'string' ? item : item[language]))
            .join(' · ');

          return (
            <div key={index} className={styles.row}>
              <div className={styles.categoryTitle}>
                {category.category[language]}
              </div>
              <div className={styles.skillsText}>
                {itemsString}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
};
