import { Badge } from '../badge';

interface TagProps {
  label: string;
}

export const Tag = ({ label }: TagProps) => {
  return (
    <Badge 
      variant="secondary" 
      className="font-mono text-xs border border-[var(--tag-border)] bg-[var(--tag-bg)] text-[var(--tag-text)] transition-colors duration-200"
    >
      {label}
    </Badge>
  );
};
