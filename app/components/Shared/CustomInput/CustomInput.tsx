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
  disabled?: boolean;
  description?: ReactNode;
  placeholder?: string;
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
    disabled = false,
    description,
    placeholder,
    onChange,
  }: ICustomInputProps) => {
    return (
      <label className={cn("w-full block", className)}>
        {!!label && (
          <span className="flex items-center gap-2 text-sm font-medium">
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
          disabled={disabled}
          placeholder={placeholder}
        />
        {description && (
          <p className="block text-xs leading-5 text-neutral-400 mt-1">
            {description}
          </p>
        )}
      </label>
    );
  },
);

export default CustomInput;
