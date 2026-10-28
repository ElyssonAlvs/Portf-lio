interface SectionTitleProps {
  title: string;
  className?: string;
}

export const SectionTitle = ({ title, className = "" }: SectionTitleProps) => {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <h2 className="text-xs uppercase font-mono tracking-wider text-[var(--text-muted)] font-semibold">
        {title}
      </h2>
      <div className="flex-grow h-px bg-[var(--border)]" />
    </div>
  );
};
