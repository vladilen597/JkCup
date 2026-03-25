"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

const EmptyListPlaceholder = ({
  icon,
  text,
  isLoading,
}: {
  icon: ReactNode;
  text: string;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 animate-spin">
        <Loader2 className="h-10 w-10 text-muted-foreground" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-muted-foreground"
    >
      <div>{icon}</div>
      <p className="text-sm mt-2.5">{text}</p>
    </motion.div>
  );
};

export default EmptyListPlaceholder;
