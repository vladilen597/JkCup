"use client";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ICustomDrawer {
  children?: ReactNode;
  onClose: () => void;
}

const CustomDrawer = ({ onClose, children }: ICustomDrawer) => {
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
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{
          ease: "circOut",
          duration: 0.4,
        }}
        className="fixed h-screen right-0 w-full max-w-md bg-background rounded-l-4xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold">Уведомления</h2>
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
