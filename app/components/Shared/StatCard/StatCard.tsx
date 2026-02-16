import React from "react";

const StatCard = ({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) => {
  return (
    <div className="rounded-xl p-4 bg-card border border-border/50 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <span
        className={`capitalize text-lg font-bold font-mono ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
};

export default StatCard;
