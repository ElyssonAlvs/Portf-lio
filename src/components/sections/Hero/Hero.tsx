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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-2">
        
        {/* Coluna da Esquerda: Hero / Apresentação */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left order-2 lg:order-1">
          <p className="font-mono mb-2 text-sm sm:text-base" style={{ color: 'var(--accent)' }}>
            {tHero.greeting}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight leading-none text-foreground">
            Elysson Alves.
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-5 text-muted-foreground flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {tHero.role}
          </h2>
          
          <div className="flex flex-wrap gap-3 mt-1">
            <Button onClick={() => setActiveTab('projects')} size="default" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors">
              {language === 'pt' ? 'Ver Projetos' : 'View Projects'}
            </Button>
            <Button onClick={() => setActiveTab('contact')} variant="outline" size="default" className="border border-border rounded-md font-medium transition-colors">
              {tHero.cta_contact}
            </Button>
            <Button asChild variant="outline" size="default" className="border border-border rounded-md font-medium transition-colors">
              <a href={cvFile} download="Elysson_Alves_CV.pdf">
                {tHero.cta_cv}
              </a>
            </Button>
            <Button asChild variant="ghost" size="default" className="rounded-md font-medium transition-colors text-muted-foreground hover:text-foreground">
              <a href="https://github.com/ElyssonAlvs" target="_blank" rel="noreferrer">
                {tHero.cta_github}
              </a>
            </Button>
          </div>
        </div>
        
        {/* Coluna da Direita: Sobre Mim */}
        <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
          <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 md:p-6 shadow-[var(--card-shadow)] hover:border-primary/30 hover:shadow-[var(--card-shadow-hover)] transition-[border-color,box-shadow] duration-300">
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4">
              
              {/* Container da Imagem */}
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <img 
                  src={elyssonImg} 
                  alt="Elysson Alves" 
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full object-cover border-4 border-background shadow-lg transition-colors duration-300 group-hover:border-primary/50" 
                />
              </div>
              
              {/* Bio & Texto */}
              <div className="flex flex-col text-left sm:text-left lg:text-center">
                <h3 className="text-lg font-bold mb-2 text-foreground tracking-tight sm:text-left lg:text-center">
                  {tAbout.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal">
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
