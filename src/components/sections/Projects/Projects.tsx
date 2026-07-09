import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { projects } from '../../../data/projects';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import { Tag } from '../../ui/Tag/Tag';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/card';
import styles from './Projects.module.css';

const ExternalIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export const Projects = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;

  return (
    <AnimatedSection id="projects">
      <SectionTitle title={t.title} />
      
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <motion.a 
            key={index}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="block h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="h-full flex flex-col hover:border-primary transition-colors duration-300">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl leading-tight">{project.name}</CardTitle>
                  <div className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors">
                    <ExternalIcon />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base">
                  {project.description[language]}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </CardFooter>
            </Card>
          </motion.a>
        ))}
      </div>
    </AnimatedSection>
  );
};
