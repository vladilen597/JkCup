import { Check } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";

interface CustomCheckboxProps {
  name?: string;
  checked: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox = ({
  name,
  checked,
  label,
  disabled = false,
  className = "",
  labelClassName = "",
  onChange,
}: CustomCheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <div className="relative bg-background flex items-center justify-center h-5 w-5 border border-zinc-600 rounded overflow-hidden">
        <input
          name={name}
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={onChange}
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
