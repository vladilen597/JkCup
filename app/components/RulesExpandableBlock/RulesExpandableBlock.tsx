import { ChevronRight, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CleanHtml from "../Shared/CleanHtml/CleanHtml";

const containerVariants = {
  expanded: {},
  collapsed: {},
};

const arrowVariants = {
  expanded: { transform: "rotate(90deg)" },
  collapsed: { transform: "rotate(0deg)" },
};

const RulesExpandableBlock = ({ html }: { html: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      variants={containerVariants}
      className="cursor-pointer rounded-xl font-mono p-4 bg-card hover:border-primary/20 transition-colors"
      onClick={handleToggleExpanded}
    >
      <div className="">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-muted-foreground">
                <Users className="h-4 w-4" />
              </span>
              <span className="text-xs font-mono tracking-widest text-muted-foreground">
                Правила
              </span>
            </div>
            <span className="font-mono text-xs">Нажмите чтобы раскрыть</span>
          </div>
          <motion.div
            variants={arrowVariants}
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            exit="collapsed"
          >
            <ChevronRight className="text-neutral-400" />
          </motion.div>
        </div>
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <CleanHtml html={html} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RulesExpandableBlock;
