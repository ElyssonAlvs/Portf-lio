import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { Button } from '../../ui/button';
import cvFile from '../../../assets/cv/Elysson_Alves_CV.pdf';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero = ({ setActiveTab }: HeroProps) => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <AnimatedSection id="hero" style={{ minHeight: 'calc(80vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
      <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: '16px', fontSize: '1.1rem' }}>{t.greeting}</p>
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: '16px', letterSpacing: '-0.03em', fontWeight: 800, lineHeight: 1 }}>Elysson Alves.</h1>
      <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--text-muted)', marginBottom: '40px', fontWeight: 500 }}>{t.role}</h2>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button onClick={() => setActiveTab('projects')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors">
          {language === 'pt' ? 'Ver Projetos' : 'View Projects'}
        </Button>
        <Button onClick={() => setActiveTab('contact')} variant="outline" size="lg" className="border border-border rounded-md font-medium transition-colors">
          {t.cta_contact}
        </Button>
        <Button asChild variant="outline" size="lg" className="border border-border rounded-md font-medium transition-colors">
          <a href={cvFile} download="Elysson_Alves_CV.pdf">
            {t.cta_cv}
          </a>
        </Button>
        <Button asChild variant="ghost" size="lg" className="rounded-md font-medium transition-colors text-muted-foreground hover:text-foreground">
          <a href="https://github.com/ElyssonAlvs" target="_blank" rel="noreferrer">
            {t.cta_github}
          </a>
        </Button>
      </div>
    </AnimatedSection>
  );
};
