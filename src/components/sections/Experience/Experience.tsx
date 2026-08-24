import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { experiences } from '../../../data/experience';
import { educationList } from '../../../data/education';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import { Tag } from '../../ui/Tag/Tag';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/card';
import styles from './Experience.module.css';

export const Experience = () => {
  const { language } = useLanguage();
  const t = translations[language].experience;
  const [activeSubTab, setActiveSubTab] = useState<'professional' | 'academic'>('professional');

  return (
    <AnimatedSection id="experience">
      <SectionTitle title={t.title} />
      
      {/* Seletor de Sub-abas */}
      <div className="flex justify-center gap-3 mb-10 max-w-[800px] mx-auto">
        <button
          onClick={() => setActiveSubTab('professional')}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeSubTab === 'professional'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-[var(--surface)] text-muted-foreground border border-[var(--border)] hover:text-foreground'
          }`}
        >
          {t.professional}
        </button>
        <button
          onClick={() => setActiveSubTab('academic')}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeSubTab === 'academic'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-[var(--surface)] text-muted-foreground border border-[var(--border)] hover:text-foreground'
          }`}
        >
          {t.academic}
        </button>
      </div>

      <div className="max-w-[800px] mx-auto min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeSubTab === 'professional' ? (
            <motion.div
              key="professional"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={styles.timeline}
            >
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
                          {exp.tags.map(tag => {
                            const label = typeof tag === 'string' ? tag : tag[language];
                            return <Tag key={label} label={label} />;
                          })}
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="academic"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={styles.timeline}
            >
              {educationList.map((edu, index) => (
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
                            <CardTitle className="text-xl mb-1">{edu.degree[language]}</CardTitle>
                            <div className="text-primary font-medium">{edu.institution}</div>
                          </div>
                          <div className="text-sm text-muted-foreground whitespace-nowrap font-mono">{edu.period[language]}</div>
                        </div>
                      </CardHeader>
                      {edu.description && (
                        <CardContent>
                          <CardDescription className="text-base text-foreground/80 leading-relaxed">
                            {edu.description[language]}
                          </CardDescription>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
};
