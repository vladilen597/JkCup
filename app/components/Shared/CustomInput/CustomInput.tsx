import { cn } from "@/lib/utils";
import { ChangeEvent, memo, ReactNode } from "react";

interface ICustomInputProps {
  name?: string;
  label?: string;
  value: string;
  className?: string;
  icon?: ReactNode;
  type?: "text" | "numeric";
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = memo(
  ({
    name,
    label,
    value,
    className,
    icon,
    type = "text",
    required = false,
    onChange,
  }: ICustomInputProps) => {
    return (
      <label className={cn("w-full", className)}>
        {!!label && (
          <span className="block text-sm font-medium">
            {!!icon && <span>{icon}</span>}
            {label}
          </span>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1 w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          required={required}
        />
      </label>
    );
  },
);

export default CustomInput;
