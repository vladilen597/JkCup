import { ChevronDown } from "lucide-react";
import { MouseEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ICustomSelectProps {
  value: { id: number; value: string; label: string };
  onChange: (value: { id: number; value: string; label: string }) => void;
  options: { id: number; value: string; label: string }[];
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

const CustomSelect = ({ value, onChange, options }: ICustomSelectProps) => {
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
      className="relative"
      onClick={handleToggleIsOpen}
    >
      <div className="text-xs font-mono flex items-center gap-2 justify-end py-2">
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
            className="absolute top-full right-0 bg-primary-foreground/80 rounded-lg overflow-hidden"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
          >
            {options.map((option) => (
              <li
                className="p-2 px-4  hover:bg-primary-foreground"
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
