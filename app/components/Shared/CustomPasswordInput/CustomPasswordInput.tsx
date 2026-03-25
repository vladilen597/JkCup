import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { ChangeEvent, memo, ReactNode, useState } from "react";

interface ICustomPasswordInputProps {
  name?: string;
  label?: string;
  value: string;
  className?: string;
  icon?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CustomPasswordInput = memo(
  ({
    name,
    label,
    value,
    className,
    icon,
    required = false,
    disabled = false,
    autoFocus,
    placeholder,
    autoComplete = "off",
    onChange,
  }: ICustomPasswordInputProps) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleTogglePasswordShown = () => {
      setIsPasswordShown((prevState) => !prevState);
    };

    return (
      <label className={cn("w-full block", className)}>
        {!!label && (
          <span className="flex items-center gap-2 text-sm font-medium">
            {!!icon && <span>{icon}</span>}
            {label}
          </span>
        )}
        <div className="mt-1 relative flex items-center">
          <input
            autoFocus={autoFocus}
            name={name}
            type={isPasswordShown ? "text" : "password"}
            value={value}
            onChange={onChange}
            className="w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
          <button
            type="button"
            className="right-2 absolute cursor-pointer flex items-end h-6 w-6"
            onClick={handleTogglePasswordShown}
          >
            {isPasswordShown ? <Eye /> : <EyeClosed className="pt-0.5" />}
          </button>
        </div>
      </label>
    );
  },
);

export default CustomPasswordInput;
