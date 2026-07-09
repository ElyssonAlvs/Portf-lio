import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import { Button } from '../../ui/button';
import styles from './Contact.module.css';

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

export const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const [copied, setCopied] = useState(false);
  
  const email = "elyssontech@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatedSection id="contact">
      <div className={styles.contactContainer}>
        <SectionTitle title={t.title} />
        
        <p className={styles.description}>
          {language === 'pt' 
            ? "Estou sempre aberto a novas oportunidades e conexões. Quer você tenha uma pergunta, uma proposta de projeto ou apenas queira dizer um oi, tentarei o meu melhor para retornar."
            : "I'm always open to new opportunities and connections. Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you."}
        </p>

        <Button onClick={handleCopyEmail} size="lg" className="rounded-full gap-2 mb-12" variant="outline">
          <MailIcon />
          {copied ? t.email_copied : email}
        </Button>

        <div className={styles.socials}>
          <a href="https://github.com/ElyssonAlvs" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href="https://linkedin.com/in/elysson-alves" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
};
