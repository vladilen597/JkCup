import { cn } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";
import { ChangeEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ISearchInputProps {
  value: string;
  className?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({
  value,
  className,
  isLoading,
  placeholder = "Поиск по пользователям",
  onChange,
}: ISearchInputProps) => {
  return (
    <label className={cn("w-full", className)}>
      <div className="flex relative items-center">
        <Search className="absolute left-3 text-neon/50" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="w-full p-2.5 rounded-lg bg-muted/10 ring-1 ring-neon/20 focus:outline-none focus:ring-2 focus:ring-neon/30 pl-12"
          placeholder={placeholder}
        />
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-spin"
            >
              <Loader2 />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </label>
  );
};

export default SearchInput;
