import { useLanguage } from '../../../contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage} 
      aria-label="Toggle language"
      style={{
        background: 'var(--tag-bg)',
        border: '1px solid var(--tag-border)',
        borderRadius: '18px',
        padding: '0 12px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        transition: 'var(--transition-smooth)'
      }}
    >
      {language}
    </button>
  );
};
