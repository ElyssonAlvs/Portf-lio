interface SectionTitleProps {
  title: string;
  className?: string;
}

export const SectionTitle = ({ title, className = "" }: SectionTitleProps) => {
  return (
    <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-6 text-foreground ${className}`}>
      {title}
    </h2>
  );
};
