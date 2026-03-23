import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronDown, Timer } from "lucide-react";

interface WheelProps {
  items: number[];
  value: number;
  label: string;
  onChange: (value: number) => void;
}

const Wheel: React.FC<WheelProps> = ({ items, value, label, onChange }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: true,
    dragFree: true,
    containScroll: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    onChange(items[index]);
  }, [emblaApi, items, onChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.scrollTo(items.indexOf(value));
  }, [emblaApi, value, items, onSelect]);

  return (
    <div className="flex flex-col items-center">
      <div className="h-32 overflow-hidden relative w-16" ref={emblaRef}>
        <div className="flex flex-col h-full select-none">
          {items.map((item) => (
            <div
              key={item}
              className="h-8 flex items-center justify-center text-sm font-medium shrink-0"
            >
              {item < 10 ? `0${item}` : item}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background opacity-80" />
        <div className="absolute top-1/2 -translate-y-1/2 h-8 w-full border-y border-primary/20 pointer-events-none" />
      </div>
      <span className="text-[10px] uppercase text-muted-foreground font-bold mt-1">
        {label}
      </span>
    </div>
  );
};

export default Wheel;
