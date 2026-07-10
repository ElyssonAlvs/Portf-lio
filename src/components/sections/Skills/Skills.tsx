import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { skillCategories } from '../../../data/skills';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import { Tag } from '../../ui/Tag/Tag';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import styles from './Skills.module.css';

export const Skills = () => {
  const { language } = useLanguage();
  const t = translations[language].skills;

  return (
    <AnimatedSection id="skills">
      <SectionTitle title={t.title} />
      
      <div className={styles.grid}>
        {skillCategories.map((category, index) => (
          <motion.div 
            key={index}
            className={styles.categoryCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="h-full bg-surface/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary/80">{category.category[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.items.map(item => {
                    const label = typeof item === 'string' ? item : item[language];
                    return <Tag key={label} label={label} />;
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
};
