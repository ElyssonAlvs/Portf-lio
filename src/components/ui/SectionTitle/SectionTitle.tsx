interface SectionTitleProps {
  title: string;
}

export const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <h2 style={{ 
      fontSize: '2rem', 
      marginBottom: '2rem', 
      position: 'relative',
      display: 'inline-block'
    }}>
      {title}
      <span style={{
        position: 'absolute',
        bottom: '-8px',
        left: 0,
        width: '40px',
        height: '4px',
        backgroundColor: 'var(--accent)',
        borderRadius: '2px'
      }} />
    </h2>
  );
};
