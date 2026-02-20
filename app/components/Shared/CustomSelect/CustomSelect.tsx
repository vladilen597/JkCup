import { ChevronDown } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface ISelectOption {
  id: number;
  value: string;
  label: string;
}

interface ICustomSelectProps {
  value: ISelectOption;
  containerClassName?: string;
  triggerClassName?: string;
  onChange: (value: ISelectOption) => void;
  options: ISelectOption[];
}

const containerVariants = {
  expanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
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

const triggerVariants = {
  expanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  collapsed: {
    transform: "rotate(0deg)",
  },
};

const contentVariants = {
  expanded: {
    opacity: 1,
    height: "auto",
  },
  collapsed: {
    opacity: 0,
    height: 0,
  },
};

const CustomSelect = ({
  value,
  containerClassName,
  triggerClassName,
  onChange,
  options,
}: ICustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLLabelElement>(null);

  const handleToggleIsOpen = (e: MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prevState) => !prevState);
  };

  return (
    <motion.label
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block relative bg-muted rounded-lg ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <motion.div className="flex items-center p-3 justify-between text-sm">
        {value.label || "Не выбрано"}
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
            className="w-full box-border text-sm absolute top-full right-0 bg-muted rounded-bl-lg rounded-br-lg overflow-hidden z-10 shadow-2xl select-none"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {options.map((option) => (
              <li
                key={option.id}
                className={`p-3 hover:bg-primary-foreground/50 ${value.id === option.id && "bg-primary-foreground/80"}`}
                onClick={() => onChange(option)}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.label>
  );
};

export default CustomSelect;
