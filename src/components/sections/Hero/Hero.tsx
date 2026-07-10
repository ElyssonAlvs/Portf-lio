import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { Button } from '../../ui/button';
import cvFile from '../../../assets/cv/Elysson_Alves_CV.pdf';
import elyssonImg from '../../../assets/images/elysson.jpg';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero = ({ setActiveTab }: HeroProps) => {
  const { language } = useLanguage();
  const tHero = translations[language].hero;
  const tAbout = translations[language].about;

  return (
    <AnimatedSection id="hero" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(75vh-80px)] py-6">
        
        {/* Coluna da Esquerda: Hero / Apresentação */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left order-2 lg:order-1">
          <p className="font-mono mb-4 text-base md:text-lg" style={{ color: 'var(--accent)' }}>
            {tHero.greeting}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight leading-none text-foreground">
            Elysson Alves.
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-8 text-muted-foreground">
            {tHero.role}
          </h2>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <Button onClick={() => setActiveTab('projects')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors">
              {language === 'pt' ? 'Ver Projetos' : 'View Projects'}
            </Button>
            <Button onClick={() => setActiveTab('contact')} variant="outline" size="lg" className="border border-border rounded-md font-medium transition-colors">
              {tHero.cta_contact}
            </Button>
            <Button asChild variant="outline" size="lg" className="border border-border rounded-md font-medium transition-colors">
              <a href={cvFile} download="Elysson_Alves_CV.pdf">
                {tHero.cta_cv}
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-md font-medium transition-colors text-muted-foreground hover:text-foreground">
              <a href="https://github.com/ElyssonAlvs" target="_blank" rel="noreferrer">
                {tHero.cta_github}
              </a>
            </Button>
          </div>
        </div>
        
        {/* Coluna da Direita: Sobre Mim */}
        <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
          <div className="w-full bg-surface/50 border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6">
              
              {/* Container da Imagem */}
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <img 
                  src={elyssonImg} 
                  alt="Elysson Alves" 
                  className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-background shadow-md transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              
              {/* Bio & Texto */}
              <div className="flex flex-col text-left sm:text-left lg:text-center">
                <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight sm:text-left lg:text-center">
                  {tAbout.title}
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
                  {tAbout.bio}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
};
