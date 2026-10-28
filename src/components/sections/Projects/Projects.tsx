import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { projects } from '../../../data/projects';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import styles from './Projects.module.css';

const ExternalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const Projects = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;

  return (
    <AnimatedSection id="projects" className="w-full">
      <SectionTitle title={t.title} />

      <div className={styles.list}>
        {projects.map((project) => {
          const category = project.category[language];
          const primaryMetric = project.metrics[0];
          const stackString = project.tags
            .map((tag) => (typeof tag === 'string' ? tag : tag[language]))
            .join(' · ');

          return (
            <article key={project.id} className={styles.item}>
              {/* Linha Superior: Nome + Categoria à esquerda | Métrica à direita */}
              <div className={styles.itemHeader}>
                <div className={styles.itemTitleGroup}>
                  <h3 className={styles.projectName}>
                    {project.name}
                  </h3>
                  <span className={styles.categoryBadge}>
                    {category}
                  </span>
                </div>

                {primaryMetric && (
                  <div className={styles.metricGroup} title={primaryMetric.label[language]}>
                    <span className={styles.metricLabel}>{primaryMetric.label[language]}:</span>
                    <span className={styles.metricValue}>{primaryMetric.value}</span>
                  </div>
                )}
              </div>

              {/* Linha do Meio: Descrição Factual e Concisa */}
              <p className={styles.itemDesc}>
                {project.description[language]}
              </p>

              {/* Linha Inferior: Stack com · à esquerda | Ações à direita */}
              <div className={styles.itemFooter}>
                <div className={styles.techStack}>
                  {stackString}
                </div>

                <div className={styles.actions}>
                  <Link
                    to={`/project/${project.id}`}
                    className={styles.archLink}
                    aria-label={`${t.view_architecture}: ${project.name}`}
                  >
                    <span>{t.view_architecture}</span>
                    <ArrowRightIcon />
                  </Link>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.githubLink}
                    aria-label={`GitHub ${project.name}`}
                  >
                    <span>{t.github_repo}</span>
                    <ExternalIcon />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AnimatedSection>
  );
};
