import { type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { publications } from '../../../data/publications';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import styles from './Publications.module.css';

const typeIcons: Record<string, ReactElement> = {
  workshop: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  journal: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  conference: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  thesis: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
};

const typeLabels: Record<string, { pt: string; en: string }> = {
  workshop: { pt: "Workshop", en: "Workshop" },
  journal: { pt: "Revista", en: "Journal" },
  conference: { pt: "Conferência", en: "Conference" },
  thesis: { pt: "TCC", en: "Thesis" },
};

const AwardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

type Language = 'pt' | 'en';

interface Publication {
  title: string;
  venue: string | { pt: string; en: string };
  venueFullName: { pt: string; en: string };
  award: { pt: string; en: string } | null;
  url: string | null;
  type: string;
}

const PublicationCard = ({ pub, index, language }: { pub: Publication; index: number; language: Language }) => {
  const venueLabel = typeof pub.venue === 'string' ? pub.venue : pub.venue[language];

  const card = (
    <div className={`${styles.card} ${pub.award ? styles.cardAwarded : ''} ${pub.url ? styles.cardClickable : ''}`}>
      <div className={styles.cardAccent} />

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.typeBadge}>
            {typeIcons[pub.type]}
            {typeLabels[pub.type][language]}
          </span>

          {pub.award && (
            <span className={styles.awardBadge}>
              <AwardIcon />
              {pub.award[language]}
            </span>
          )}
        </div>

        <h3 className={styles.cardTitle}>{pub.title}</h3>

        <div className={styles.cardVenue}>
          <span className={styles.venueName}>{venueLabel}</span>
          <span className={styles.venueFullName}>{pub.venueFullName[language]}</span>
        </div>
      </div>

      {pub.url && (
        <div className={styles.cardLink}>
          <ExternalLinkIcon />
        </div>
      )}
    </div>
  );

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  if (pub.url) {
    return (
      <motion.a
        key={index}
        href={pub.url}
        target="_blank"
        rel="noreferrer"
        className={styles.cardWrapper}
        {...motionProps}
      >
        {card}
      </motion.a>
    );
  }

  return (
    <motion.div key={index} className={styles.cardWrapper} {...motionProps}>
      {card}
    </motion.div>
  );
};

export const Publications = () => {
  const { language } = useLanguage();
  const t = translations[language].publications;

  return (
    <AnimatedSection id="publications">
      <SectionTitle title={t.title} />

      <div className={styles.grid}>
        {publications.map((pub, index) => (
          <PublicationCard key={index} pub={pub as Publication} index={index} language={language as Language} />
        ))}
      </div>
    </AnimatedSection>
  );
};
