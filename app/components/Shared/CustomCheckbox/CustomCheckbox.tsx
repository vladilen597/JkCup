// CustomCheckbox.tsx
import { Check } from "lucide-react";
import React, { useRef, useState } from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  labelClassName = "",
}: CustomCheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <label
      className={`flex items-center gap-2 ${className}`}
      onKeyDown={handleKeyDown}
    >
      <div className="relative flex items-center justify-center h-5 w-5 border border-zinc-600 rounded overflow-hidden">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-inherit"
        />
        {checked && (
          <div
            className={`bg-primary/20
            w-full h-full flex items-center justify-center
            ${!disabled && !checked && "group-hover:border-zinc-500"}
          `}
          >
            <Check width={12} height={12} className="text-white" />
          </div>
        )}
      </div>
      {label && (
        <span
          className={`select-none text-sm font-medium ${
            disabled ? "text-zinc-500" : "text-zinc-200"
          } ${labelClassName}`}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default CustomCheckbox;
