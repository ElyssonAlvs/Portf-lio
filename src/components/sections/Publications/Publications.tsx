import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { publications, type PublicationItem } from '../../../data/publications';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import styles from './Publications.module.css';

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export const Publications = () => {
  const { language } = useLanguage();
  const t = translations[language].publications;

  return (
    <AnimatedSection id="publications" className="w-full">
      <SectionTitle title={t.title} />

      <div className={styles.list}>
        {publications.map((pub: PublicationItem, index: number) => {
          const venueLabel = typeof pub.venue === 'string' ? pub.venue : pub.venue[language];
          const venueFull = typeof pub.venueFullName === 'string' ? pub.venueFullName : pub.venueFullName[language];

          return (
            <article key={index} className={styles.item}>
              <div className={styles.mainInfo}>
                <h3 className={styles.paperTitle}>
                  {pub.title}
                </h3>

                {pub.award && (
                  <span className={styles.award}>
                    ★ {pub.award[language]}
                  </span>
                )}

                <span className={styles.venue} title={venueFull}>
                  {venueLabel}
                </span>
              </div>

              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.paperLink}
                  aria-label={`${t.view_paper} - ${pub.title}`}
                >
                  <span>{t.view_paper}</span>
                  <ExternalLinkIcon />
                </a>
              )}
            </article>
          );
        })}
      </div>
    </AnimatedSection>
  );
};
