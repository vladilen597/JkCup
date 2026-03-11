"use client";

import { useDebouncedCallback } from "use-debounce";
import React, { useCallback, useEffect, useState } from "react";

interface ChangeInfoInputProps {
  roundId: string;
  matchId: string;
  currentValue: string; // текущее значение info (match.info || "")
  onUpdate: (roundId: string, matchId: string, info: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function ChangeInfoInput({
  roundId,
  matchId,
  currentValue,
  onUpdate,
  placeholder = "Счёт / время начала",
  disabled = false,
}: ChangeInfoInputProps) {
  const [localValue, setLocalValue] = useState(currentValue);

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  const handleBlur = () => {
    if (localValue !== currentValue) {
      onUpdate(roundId, matchId, localValue.trim());
    }
  };

  return (
    <div className="px-3 pb-2 pt-1">
      <input
        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        disabled={disabled}
      />
    </div>
  );
}
