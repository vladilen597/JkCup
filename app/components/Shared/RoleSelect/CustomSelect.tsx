import { ChevronDown } from "lucide-react";
import { MouseEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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

const RoleSelect = ({
  value,
  containerClassName,
  triggerClassName,
  onChange,
  options,
}: IRoleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleIsOpen = (e: MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prevState) => !prevState);
  };

  return (
    <motion.label
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block relative ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <div
        className={`text-xs font-mono flex items-center gap-2 justify-end py-2 ${triggerClassName}`}
      >
        {value.label || "Не выбрано"}
        <motion.div
          variants={labelVariants}
          initial="collapsed"
          animate={isOpen ? "expanded" : "collapsed"}
          exit="collapsed"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute top-full font-mono text-xs right-0 bg-muted rounded-lg overflow-hidden z-10"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {options.map((option) => (
              <li
                key={option.id}
                className="p-2 px-4 hover:bg-primary-foreground"
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

export default RoleSelect;
