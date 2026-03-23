import { motion } from "motion/react";

const InfoBlock = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col justify-between bg-card p-3 h-24 rounded-lg">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xs font-mono tracking-widest text-muted-foreground"
      >
        {title}
      </motion.span>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-mono"
      >
        {value}
      </motion.p>
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-widest text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default InfoBlock;
