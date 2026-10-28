import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { Button } from '../../ui/button';
import cvFile from '../../../assets/cv/Elysson_Alves_CV.pdf';
import elyssonImg from '../../../assets/images/elysson.jpg';

interface HeroProps {
  setActiveTab?: (tab: string) => void;
}

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const ExternalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Hero = ({ setActiveTab }: HeroProps) => {
  const { language } = useLanguage();
  const tHero = translations[language].hero;
  const tAbout = translations[language].about;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (setActiveTab) {
      setActiveTab(id);
    }
  };

  return (
    <AnimatedSection id="hero" className="w-full">
      <div className="pt-2 sm:pt-4 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda: Apresentação & Credenciais */}
          <div className="lg:col-span-8 flex flex-col justify-center text-left">
            {/* Indicador sutil de status */}
            <div className="font-mono text-xs text-[var(--accent)] font-semibold flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--state-verified)] inline-block animate-pulse shrink-0" />
              <span>
                {language === 'pt'
                  ? 'Quixadá / Fortaleza · CE · Disponível para projetos'
                  : 'Quixadá / Fortaleza, CE · Available for projects'}
              </span>
            </div>

            {/* Nome */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-display mb-1.5">
              Elysson Alves
            </h1>

            {/* Cargo */}
            <p className="text-base sm:text-lg font-semibold text-[var(--text-secondary)] mb-2.5">
              {tHero.role}
            </p>

            {/* Credencial em linha limpa */}
            <div className="text-xs font-mono text-[var(--text-muted)] mb-3 flex items-center gap-2 flex-wrap">
              <span>
                {language === 'pt'
                  ? 'Dev Backend · UFC · Bacharel em SI'
                  : 'Backend Dev · UFC · B.S. in Info Systems'}
              </span>
            </div>

            {/* Bio editorial fluida */}
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-[62ch] mb-4">
              {tAbout.bio}
            </p>

            {/* Stack técnica em mono */}
            <p className="text-xs font-mono text-[var(--accent)] mb-6">
              &gt; Python · FastAPI · LangGraph · FastMCP · PostgreSQL · Docker · Java
            </p>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Button
                onClick={() => scrollToSection('projects')}
                size="sm"
                className="h-9 px-4 rounded-md font-mono text-xs font-bold transition-colors shadow-none whitespace-nowrap bg-[#09090b] text-[#ffffff] hover:bg-[#27272a] dark:bg-[#ffffff] dark:text-[#09090b] dark:hover:bg-[#f4f4f5] gap-1.5"
              >
                <span>{tHero.cta_projects}</span>
                <ArrowDownIcon />
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-md font-mono text-xs border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors whitespace-nowrap gap-1.5"
              >
                <a href="https://github.com/ElyssonAlvs" target="_blank" rel="noreferrer">
                  <GitHubIcon />
                  <span>{tHero.cta_github}</span>
                  <ExternalIcon />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-md font-mono text-xs border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors whitespace-nowrap gap-1.5"
              >
                <a href="https://linkedin.com/in/elysson-alves" target="_blank" rel="noreferrer">
                  <LinkedInIcon />
                  <span>{tHero.cta_linkedin}</span>
                  <ExternalIcon />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-md font-mono text-xs border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors whitespace-nowrap gap-1.5"
              >
                <a href={cvFile} download="Elysson_Alves_CV.pdf">
                  <DownloadIcon />
                  <span>{tHero.cta_cv}</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Coluna Direita: Foto em Destaque Nobre */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <img
              src={elyssonImg}
              alt="Elysson Alves"
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl object-cover border-2 border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
