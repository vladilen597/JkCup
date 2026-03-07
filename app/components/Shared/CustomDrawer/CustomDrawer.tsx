"use client";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ICustomDrawer {
  children?: ReactNode;
  className?: string;
  title?: string;
  position?: "right" | "left";
  onClose: () => void;
}

const CustomDrawer = ({
  onClose,
  className,
  title = "",
  position = "right",
  children,
}: ICustomDrawer) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-999"
      onClick={onClose}
    >
      <motion.div
        initial={position === "right" ? { x: "100%" } : { x: "-100%" }}
        animate={{ x: 0 }}
        exit={position === "right" ? { x: "100%" } : { x: "-100%" }}
        transition={{
          ease: "circOut",
          duration: 0.4,
        }}
        className={cn(
          "fixed h-screen w-full max-w-md bg-background shadow-2xl",
          position === "right" && "right-0 rounded-l-4xl",
          position === "left" && "left-0 right-auto  rounded-r-4xl",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="cursor-pointer" type="button" onClick={onClose}>
            <X className="text-neutral-400" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

export default CustomDrawer;
