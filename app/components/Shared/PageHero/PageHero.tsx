import { motion } from "motion/react";
import Title from "../../Title/Title";
import { ReactNode } from "react";

const PageHero = ({
  title,
  description,
  icon,
  controls,
  bottomContent,
}: {
  title: string;
  description: string;
  controls?: ReactNode;
  icon: ReactNode;
  bottomContent?: ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative font-mono overflow-hidden rounded-2xl  p-8 md:p-12 mb-10"
    >
      <div className="absolute inset-0 -top-8 h-40 bg-linear-to-b from-primary/15 to-transparent rounded-3xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <Title title={title} />
          </div>

          {controls}
        </div>

        <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
      </div>
      <div className="mt-8">{bottomContent}</div>
    </motion.div>
  );
};

export default PageHero;
