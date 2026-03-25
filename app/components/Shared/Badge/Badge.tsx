interface IBadgeProps {
  text: string;
  className?: string;
}

const Badge = ({ text, className }: IBadgeProps) => {
  return (
    <div
      className={`shrink-0 p-2 py-0.5 rounded-full text-[13px] uppercase tracking-wider font-mono ${className}`}
    >
      {text}
    </div>
  );
};

export default Badge;
