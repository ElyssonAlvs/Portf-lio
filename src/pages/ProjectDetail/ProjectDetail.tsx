import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import { projects } from '../../data/projects';
import { ArchitectureDiagram } from '../../components/sections/Projects/ArchitectureDiagram';
import { Button } from '../../components/ui/button';
import styles from './ProjectDetail.module.css';

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ExternalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ShieldAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--state-guardrail)] shrink-0">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--state-verified)] shrink-0">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const GitBranchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language].project_detail;

  const currentIndex = projects.findIndex((p) => p.id === projectId);
  const project = currentIndex !== -1 ? projects[currentIndex] : null;

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (project) {
      document.title = `${project.name} | Elysson Alves`;
    }
  }, [projectId, project]);

  const handleBackToPortfolio = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!project) {
    return (
      <div className={styles.detailContainer}>
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">
            {t.not_found_title}
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-md">
            {t.not_found_desc}
          </p>
          <Button onClick={handleBackToPortfolio} variant="outline" className="font-mono text-xs">
            <ArrowLeftIcon />
            <span>{t.back}</span>
          </Button>
        </div>
      </div>
    );
  }

  const categoryTag = project.category[language];
  const stackString = project.tags
    .map((tag) => (typeof tag === 'string' ? tag : tag[language]))
    .join(' · ');

  return (
    <div className={styles.detailContainer}>
      {/* Botão Superior Voltar */}
      <div>
        <button type="button" onClick={handleBackToPortfolio} className={styles.backBtn}>
          <ArrowLeftIcon />
          <span>← {t.back}</span>
        </button>
      </div>

      {/* Header do Projeto */}
      <header className={styles.headerSection}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={styles.categoryBadge}>
            {categoryTag}
          </span>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 px-3 border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] font-mono text-xs gap-1.5 transition-colors"
          >
            <a href={project.url} target="_blank" rel="noreferrer">
              <span>{t.github_repo}</span>
              <ExternalIcon />
            </a>
          </Button>
        </div>

        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.subtitle}>{project.subtitle[language]}</p>

        {/* Tags de Tecnologias em Texto Mono Limpo */}
        <p className={styles.techStack}>
          {stackString}
        </p>

        {/* Métricas Reais de Engenharia em Faixa Horizontal */}
        <div className={styles.metricsStrip}>
          {project.metrics.map((metric, idx) => (
            <div key={idx} className={styles.metricItem}>
              <span className={styles.metricLabel}>
                {metric.label[language]}:
              </span>
              <span className={styles.metricValue}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Visão Geral: Risco Mitigado & Solução Arquitetural */}
      <section className={styles.overviewSection}>
        <div className={styles.overviewBlock}>
          <div className={`${styles.overviewTitle} text-[var(--state-guardrail)]`}>
            <ShieldAlertIcon />
            <span>{t.mitigated_risk}</span>
          </div>
          <p className={styles.overviewText}>{project.problem[language]}</p>
        </div>

        <div className={styles.overviewBlock}>
          <div className={`${styles.overviewTitle} text-[var(--state-verified)]`}>
            <ShieldCheckIcon />
            <span>{t.architectural_solution}</span>
          </div>
          <p className={styles.overviewText}>{project.solution[language]}</p>
        </div>
      </section>

      {/* Topologia de Arquitetura em Pipeline Semântico */}
      <section className={styles.sectionBlock}>
        <div className="flex items-center justify-between">
          <h2 className={styles.sectionHeading}>
            <GitBranchIcon />
            <span>{t.topology_title}</span>
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline-block">
            {t.interactive_hint}
          </span>
        </div>

        <ArchitectureDiagram project={project} language={language} />
      </section>

      {/* Registro de Decisões de Arquitetura (ADR) */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionHeading}>
          <span>{t.adr_title}</span>
        </h2>

        <div className={styles.adrContainer}>
          <table className={styles.adrTable}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>{t.adr_decision}</th>
                <th style={{ width: '28%' }}>{t.adr_rejected}</th>
                <th style={{ width: '44%' }}>{t.adr_rationale}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono font-bold text-[var(--accent)] text-xs">
                  {project.adr.decision[language]}
                </td>
                <td className="font-mono text-xs text-[var(--text-muted)] line-through decoration-[var(--state-guardrail)]">
                  {project.adr.discarded[language]}
                </td>
                <td className="text-xs text-[var(--text-secondary)]">
                  {project.adr.rationale[language]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navegação Inferior Anterior / Próximo */}
      <footer className={styles.navBottom}>
        <div>
          {prevProject ? (
            <Link to={`/project/${prevProject.id}`} className={styles.navBtn}>
              <ArrowLeftIcon />
              <span>{prevProject.name}</span>
            </Link>
          ) : (
            <button type="button" onClick={handleBackToPortfolio} className={styles.navBtn}>
              <ArrowLeftIcon />
              <span>{t.portfolio_home}</span>
            </button>
          )}
        </div>

        <div>
          {nextProject ? (
            <Link to={`/project/${nextProject.id}`} className={styles.navBtn}>
              <span>{nextProject.name}</span>
              <ArrowRightIcon />
            </Link>
          ) : (
            <button type="button" onClick={handleBackToPortfolio} className={styles.navBtn}>
              <span>{t.back}</span>
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
