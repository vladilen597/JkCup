import { X, Palette, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ITag } from "@/app/lib/types";

export const TAG_PALETTE = [
  { bg: "#2DD4BF20", text: "#2DD4BF" },
  { bg: "#3B82F620", text: "#60A5FA" },
  { bg: "#A855F720", text: "#C084FC" },
  { bg: "#F43F5E20", text: "#FB7185" },
  { bg: "#EAB30820", text: "#FACC15" },
  { bg: "#71717A20", text: "#A1A1AA" },
];

interface ITagSelectProps extends ITag {
  onChange: (value: string) => void;
  onDeleteClick: () => void;
  onColorChange: (bg: string, txt: string) => void;
}

const TagSelect = ({
  value,
  bgColor,
  textColor,
  onChange,
  onDeleteClick,
  onColorChange,
}: ITagSelectProps) => {
  const [showPalette, setShowPalette] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value === "") inputRef.current?.focus();
  }, []);

  return (
    <div className="relative inline-block group">
      <div
        className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] border border-white/5 transition-all"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <button
          type="button"
          onClick={() => setShowPalette(!showPalette)}
          className="hover:opacity-100 opacity-60 transition-opacity"
        >
          <Palette className="w-3 h-3" />
        </button>

        <input
          ref={inputRef}
          className="bg-transparent border-none outline-none min-w-[30px] font-medium placeholder:text-current/40"
          style={{ width: `${Math.max(value.length, 2)}ch` }}
          type="text"
          value={value}
          placeholder="..."
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />

        <button
          type="button"
          onClick={onDeleteClick}
          className="hover:opacity-100 opacity-60 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {showPalette && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPalette(false)}
          />
          <div className="absolute top-full mt-2 left-0 z-20 bg-[#18181b] border border-border shadow-2xl rounded-xl p-2 flex gap-1.5">
            {TAG_PALETTE.map((color) => (
              <button
                key={color.bg}
                type="button"
                className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
                style={{ backgroundColor: color.bg }}
                onClick={() => {
                  onColorChange(color.bg, color.text);
                  setShowPalette(false);
                }}
              >
                {bgColor === color.bg && (
                  <Check className="w-3 h-3" style={{ color: color.text }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TagSelect;
