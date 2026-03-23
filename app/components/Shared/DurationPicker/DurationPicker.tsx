import React, { useMemo, useState } from "react";
import { Timer, ChevronDown } from "lucide-react";
import Wheel from "../WheelPicker/WheelPicker";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

const DurationPicker: React.FC<{
  valueMs: number;
  onChange: (ms: number) => void;
}> = ({ valueMs, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const h = Math.floor(valueMs / 3600000);
  const m = Math.floor((valueMs % 3600000) / 60000);

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group flex items-center justify-between px-2 py-1.5 bg-background border border-border rounded-2xl shadow-2xl cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Timer size={18} className="text-primary" />
          </div>
          <span className="text-sm font-medium select-none">
            {h} ч {m} мин
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="absolute origin-top top-full mt-2 left-0 right-0 z-50 p-4 bg-background border border-border rounded-2xl shadow-2xl flex justify-center gap-8"
          >
            <Wheel
              items={Array.from({ length: 24 }, (_, i) => i)}
              value={h}
              label="Часы"
              onChange={(v) => onChange((v * 3600 + m * 60) * 1000)}
            />
            <div className="text-xl font-bold self-center text-primary -mt-4">
              :
            </div>
            <Wheel
              items={Array.from({ length: 12 }, (_, i) => i * 5)}
              value={m}
              label="Минуты"
              onChange={(v) => onChange((h * 3600 + v * 60) * 1000)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DurationPicker;
