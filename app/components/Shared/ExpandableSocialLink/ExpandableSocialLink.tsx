import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface ExpandableSocialLinkProps extends HTMLMotionProps<"a"> {
  icon: React.ReactNode;
  label: string;
  href: string;
  size?: "default" | "small";
}

const contentVariants = {
  initial: { width: 0, opacity: 0, marginLeft: 0 },
  hover: {
    width: "auto",
    opacity: 1,
    marginLeft: 8,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const ExpandableSocialLink = ({
  icon,
  label,
  href,
  size = "default",
  className,
  ...props
}: ExpandableSocialLinkProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial="initial"
      whileHover="hover"
      className={cn(
        "group flex items-center justify-center overflow-hidden w-fit cursor-pointer outline-none",
        "border border-neutral-800 rounded-md bg-neutral-900/50 transition-colors duration-200",
        "hover:border-neutral-500 hover:bg-neutral-800 hover:text-white text-neutral-400",
        size === "default" ? "h-9 px-2.5" : "h-7 px-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center transition-colors",
          size === "default" ? "w-4 h-4" : "w-3 h-3",
        )}
      >
        {icon}
      </div>

      <motion.span
        variants={contentVariants}
        className="whitespace-nowrap overflow-hidden font-semibold text-xs leading-none"
      >
        {label}
      </motion.span>
    </motion.a>
  );
};

export default ExpandableSocialLink;
