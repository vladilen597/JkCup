import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface IPortalModalProps {
  fullscreen?: boolean;
  children: React.ReactNode;
  contentClassName?: string;
  isOpen: boolean;
  onClose?: () => void;
}

interface ICustomModalProps extends IPortalModalProps {
  isOpen: boolean;
}

const PortalModal = ({
  fullscreen,
  children,
  contentClassName,
  isOpen,
  onClose,
}: IPortalModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (onClose) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
      className="fixed top-0 left-0 h-screen w-screen z-50 flex items-center justify-center backdrop-blur-xl"
    >
      <div className="absolute top-0 left-0 bg-black/50 h-full w-full"></div>
      <div
        ref={containerRef}
        className={cn(
          "relative max-h-[90vh] overflow-y-auto bg-card rounded-xl p-6 z-10 max-w-2xl w-full mt-2",
          fullscreen ? "w-full h-full" : "",
          contentClassName,
        )}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 block cursor-pointer p-2 ml-auto mr-0"
        >
          <X />
        </button>
      </div>
    </motion.div>,
    document.body,
  );
};

const CustomModal = ({
  children,
  isOpen,
  fullscreen,
  contentClassName,
  onClose,
}: ICustomModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <PortalModal
          contentClassName={contentClassName}
          fullscreen={fullscreen}
          isOpen={isOpen}
          onClose={onClose}
        >
          {children}
        </PortalModal>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
