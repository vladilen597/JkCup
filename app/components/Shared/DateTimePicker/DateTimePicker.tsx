import React, { useState, useRef } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DateTimePickerProps {
  value?: string | Date | null;
  onChange: (dateIso: string) => void;
}

const DarkDateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const dateObj = value ? new Date(value) : null;

  const formatDateForInput = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatDisplay = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return "Выберите дату";
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    const newDate = new Date(val);
    onChange(newDate.toISOString());
  };

  return (
    <div className="flex flex-col gap-2 font-sans antialiased w-full">
      <div
        onClick={() => inputRef.current?.showPicker()}
        className="w-full group relative flex items-center justify-between px-2 py-1.5 
                   bg-background border border-border rounded-2xl shadow-2xl cursor-pointer
                   transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Calendar size={18} className="text-primary" />
          </div>

          <div className="flex flex-col">
            <span className={`text-sm tracking-wide`}>
              {formatDisplay(dateObj)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-slate-800" />
          <ChevronDown
            size={16}
            className="text-primary transition-transform duration-300"
          />
        </div>

        <input
          ref={inputRef}
          type="datetime-local"
          value={formatDateForInput(dateObj)}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer scheme-dark"
        />
      </div>
    </div>
  );
};

export default DarkDateTimePicker;
