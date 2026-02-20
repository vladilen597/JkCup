import { useEffect, useRef } from "react";
import { DoorClosed, Settings } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface IProfileDropdownProps {
  handleClickLogout: () => void;
  userId: string;
  onClose: () => void; // Добавляем пропс для закрытия
}

const ProfileDropdown = ({
  handleClickLogout,
  userId,
  onClose,
}: IProfileDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full bg-primary-foreground right-0 mt-2 w-48 p-1.5 rounded-xl glass-panel neon-border z-50"
    >
      <Link
        href={"/users/" + userId}
        onClick={onClose}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-bg-primary hover:bg-primary/10 transition-colors cursor-pointer"
      >
        <Settings className="h-4 w-4" />
        Настройки
      </Link>
      <button
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        onClick={() => {
          handleClickLogout();
          onClose();
        }}
      >
        <DoorClosed className="h-4 w-4" />
        Выйти
      </button>
    </motion.div>
  );
};

export default ProfileDropdown;
