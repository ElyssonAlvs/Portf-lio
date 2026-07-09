import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { experiences } from '../../../data/experience';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import { Tag } from '../../ui/Tag/Tag';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/card';
import styles from './Experience.module.css';

export const Experience = () => {
  const { language } = useLanguage();
  const t = translations[language].experience;

  return (
    <AnimatedSection id="experience">
      <SectionTitle title={t.title} />
      
      <div className={styles.timeline}>
        {experiences.map((exp, index) => (
          <motion.div 
            key={index}
            className={styles.timelineItem}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl mb-1">{exp.role[language]}</CardTitle>
                      <div className="text-primary font-medium">{exp.company}</div>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap font-mono">{exp.period[language]}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-foreground/80 leading-relaxed">
                    {exp.description[language]}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map(tag => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
};
