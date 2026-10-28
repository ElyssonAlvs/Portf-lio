import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../i18n/translations';
import { AnimatedSection } from '../../ui/AnimatedSection/AnimatedSection';
import { SectionTitle } from '../../ui/SectionTitle/SectionTitle';
import { Button } from '../../ui/button';
import styles from './Contact.module.css';

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--state-verified)]">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ExternalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const [copied, setCopied] = useState(false);

  const email = "elyssontech@gmail.com";
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatedSection id="contact" className="w-full">
      <div className={styles.container}>
        <SectionTitle title={t.title} />

        <p className={styles.description}>
          {t.description}
        </p>

        <div className={styles.actionRow}>
          {/* Botão de Cópia Compacto */}
          <Button
            onClick={handleCopyEmail}
            size="sm"
            className="h-8 px-3 bg-[#09090b] text-[#ffffff] hover:bg-[#27272a] dark:bg-[#ffffff] dark:text-[#09090b] dark:hover:bg-[#f4f4f5] font-mono text-xs font-semibold rounded-md gap-1.5 transition-colors shadow-none whitespace-nowrap"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>
              {copied ? t.copied : `${t.copy_btn} ${email}`}
            </span>
          </Button>

          {/* Links Diretos e Limpos */}
          <div className={styles.directLinks}>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <span>{t.open_gmail}</span>
              <ExternalIcon />
            </a>

            <span className="text-[var(--border-strong)]">·</span>

            <a
              href="https://github.com/ElyssonAlvs"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <span>GitHub</span>
              <ExternalIcon />
            </a>

            <span className="text-[var(--border-strong)]">·</span>

            <a
              href="https://linkedin.com/in/elysson-alves"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <span>LinkedIn</span>
              <ExternalIcon />
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
