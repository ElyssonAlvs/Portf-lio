import { Badge } from '../badge';

interface TagProps {
  label: string;
}

export const Tag = ({ label }: TagProps) => {
  return (
    <Badge variant="secondary" className="font-mono text-xs">
      {label}
    </Badge>
  );
};
