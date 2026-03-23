import React, { ReactNode } from "react";

const StatCard = ({
  icon,
  label,
  value,
  highlight = false,
  content,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | ReactNode;
  highlight?: boolean;
  content?: ReactNode;
}) => {
  return (
    <div className="rounded-xl font-mono p-4 bg-card hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-mono tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      {value ? (
        <span
          className={`capitalize text-lg font-bold font-mono ${highlight ? "text-primary" : "text-foreground"}`}
        >
          {value}
        </span>
      ) : (
        content
      )}
    </div>
  );
};

export default StatCard;
