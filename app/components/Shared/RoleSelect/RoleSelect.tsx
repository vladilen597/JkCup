import { ChevronDown, Diamond } from "lucide-react";
import { MouseEvent, useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ISelectOption {
  id: number;
  value: string;
  label: string;
}

interface IRoleSelectProps {
  value: ISelectOption;
  containerClassName?: string;
  triggerClassName?: string;
  onChange: (value: ISelectOption) => void;
  options: ISelectOption[];
}

const containerVariants = {
  expanded: {},
  collapsed: {},
};

const labelVariants = {
  expanded: {
    transform: "rotate(180deg)",
  },
  collapsed: {
    transform: "rotate(0deg)",
  },
};

const contentVariants = {
  expanded: {
    opacity: 1,
  },
  collapsed: {
    opacity: 0,
  },
};

const triggerVariants = {
  expanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  collapsed: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
};

const roleStyleMap: Record<string, { text: string; block: string }> = {
  guest: { text: "text-neutral-400", block: "border-neutral-400!" },
  user: {
    text: "text-white border-white!",
    block: "border-white",
  },
  admin: {
    text: "text-primary",
    block: "border-primary!",
  },
  superadmin: {
    text: "text-gold",
    block: "border-gold!",
  },
};

const RoleSelect = ({
  value,
  containerClassName,
  triggerClassName,
  onChange,
  options,
}: IRoleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLLabelElement>(null);

  const handleToggleIsOpen = (e: MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prevState) => !prevState);
  };

  const optionsWithoutCurrent = useMemo(
    () => options.filter((option) => option.value !== value.value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (option: ISelectOption) => {
    onChange(option);
  };

  return (
    <motion.label
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block w-fit relative ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <motion.div
        className={cn(
          "inline-flex bg-background items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-medium tracking-wider uppercase bg-surface-2 cursor-pointer",
          triggerClassName,
          roleStyleMap[value.value].block,
          roleStyleMap[value.value].text,
        )}
        variants={triggerVariants}
      >
        <div className="flex items-center gap-2">
          <Diamond className={cn("w-3 h-3")} />
          {value.label || "Не выбрано"}
        </div>
        <motion.div
          variants={labelVariants}
          initial="collapsed"
          animate={isOpen ? "expanded" : "collapsed"}
          exit="collapsed"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className={cn(
              "absolute bg-background top-full w-full border-l border-r border-b font-mono text-xs right-0 rounded-b-lg overflow-hidden z-10",
              roleStyleMap[value.value].block,
            )}
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {optionsWithoutCurrent.map((option) => (
              <li
                key={option.id}
                className={cn(
                  "flex items-center gap-2 p-2 px-3 hover:bg-primary/10 cursor-pointer uppercase",
                  roleStyleMap[option.value].text,
                )}
                onClick={() => handleOptionClick(option)}
              >
                <Diamond
                  className={cn("w-3 h-3", roleStyleMap[option.value].text)}
                />
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.label>
  );
};

export default RoleSelect;
