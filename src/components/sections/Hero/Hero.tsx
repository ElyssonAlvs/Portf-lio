import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { Button } from '../../ui/button';

export const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <AnimatedSection id="hero" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>{t.greeting}</p>
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '16px', letterSpacing: '-0.02em' }}>Elysson Alves.</h1>
      <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--text-muted)', marginBottom: '40px' }}>{t.role}</h2>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors">
          <a href="https://github.com/ElyssonAlvs" target="_blank" rel="noreferrer">
            {t.cta_github}
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="border border-border rounded-md font-medium transition-colors">
          <a href="/cv/Elysson_Alves_CV.pdf" download>
            {t.cta_cv}
          </a>
        </Button>
      </div>
    </AnimatedSection>
  );
};
