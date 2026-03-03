import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ICustomInputProps {
  label?: string;
  value: string;
  className?: string;
  icon?: ReactNode;
  onChange: (value: string) => void;
}

const CustomInput = ({
  label,
  value,
  className,
  icon,
  onChange,
}: ICustomInputProps) => {
  return (
    <label className={cn("w-full", className)}>
      {!!label && (
        <span className="mb-1 flex items-center gap-2">
          {!!icon && <span>{icon}</span>}
          {label}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
    </label>
  );
};

export default CustomInput;
