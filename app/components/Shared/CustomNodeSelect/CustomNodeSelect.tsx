import { ChevronDown } from "lucide-react";
import {
  Fragment,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";

export interface ISelectOption {
  id: number;
  node: ReactNode;
}

interface ICustomSelectProps {
  titleNode: ReactNode;
  containerClassName?: string;
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

const contentVariants = {
  expanded: {
    opacity: 1,
    scaleY: "100%",
  },
  collapsed: {
    opacity: 0,
    scaleY: 0,
  },
};

const CustomNodeSelect = ({
  containerClassName,
  titleNode,
  options,
}: ICustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLLabelElement>(null);

  const handleToggleIsOpen = (e: MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prevState) => !prevState);
  };

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

  return (
    <motion.label
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block relative rounded-lg ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <motion.div className="flex items-center gap-3 p-3 justify-between">
        {titleNode}
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
            className="w-full origin-top space-y-4 p-3 box-border text-sm absolute top-full right-0 bg-background rounded-bl-lg rounded-br-lg overflow-hidden z-10 shadow-2xl select-none"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{
              ease: "easeInOut",
            }}
          >
            {options.map((option) => (
              <Fragment key={option.id}>{option.node}</Fragment>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.label>
  );
};

export default CustomNodeSelect;
