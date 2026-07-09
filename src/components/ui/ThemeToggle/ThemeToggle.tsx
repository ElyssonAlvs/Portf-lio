import { useTheme } from '../../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      style={{
        background: 'var(--tag-bg)',
        border: '1px solid var(--tag-border)',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        transition: 'var(--transition-smooth)'
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
