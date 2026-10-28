import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { experiences } from '../../../data/experience';
import { educationList } from '../../../data/education';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import styles from './Experience.module.css';

export const Experience = () => {
  const { language } = useLanguage();
  const t = translations[language].experience;
  const [activeSubTab, setActiveSubTab] = useState<'professional' | 'academic'>('professional');

  return (
    <AnimatedSection id="experience" className="w-full">
      <SectionTitle title={t.title} />

      <div className={styles.container}>
        {/* Seletor de Sub-abas Limpo */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveSubTab('professional')}
            className={`${styles.tabBtn} ${activeSubTab === 'professional' ? styles.active : ''}`}
          >
            {t.professional}
          </button>
          <button
            onClick={() => setActiveSubTab('academic')}
            className={`${styles.tabBtn} ${activeSubTab === 'academic' ? styles.active : ''}`}
          >
            {t.academic}
          </button>
        </div>

        {/* Índice Cronológico Editorial */}
        <AnimatePresence mode="wait">
          {activeSubTab === 'professional' ? (
            <motion.div
              key="professional"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={styles.list}
            >
              {experiences.map((exp, index) => {
                const stackString = exp.tags
                  ? exp.tags.map((tag) => (typeof tag === 'string' ? tag : tag[language])).join(' · ')
                  : '';

                return (
                  <article key={index} className={styles.item}>
                    <div className={styles.period}>
                      {exp.period[language]}
                    </div>
                    <div className={styles.content}>
                      <div className={styles.header}>
                        <h3 className={styles.role}>
                          {exp.role[language]}
                        </h3>
                        <span className="text-xs text-[var(--text-muted)]">·</span>
                        <span className={styles.company}>
                          {exp.company}
                        </span>
                      </div>
                      <p className={styles.description}>
                        {exp.description[language]}
                      </p>
                      {stackString && (
                        <p className={styles.techStack}>
                          {stackString}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="academic"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={styles.list}
            >
              {educationList.map((edu, index) => (
                <article key={index} className={styles.item}>
                  <div className={styles.period}>
                    {edu.period[language]}
                  </div>
                  <div className={styles.content}>
                    <div className={styles.header}>
                      <h3 className={styles.role}>
                        {edu.degree[language]}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)]">·</span>
                      <span className={styles.company}>
                        {edu.institution}
                      </span>
                    </div>
                    {edu.description && (
                      <p className={styles.description}>
                        {edu.description[language]}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
};
