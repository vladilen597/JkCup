import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Diamond } from "lucide-react";

const roles: Record<string, string> = {
  user: "Участник",
  admin: "Админ",
  superadmin: "Гл.Админ",
  guest: "Гость",
};

const roleStyleMap: Record<string, { text: string; block: string }> = {
  guest: { text: "text-neutral-400", block: "border-neutral-400!" },
  user: {
    text: "text-white border-white!",
    block: "border-white",
  },
  admin: {
    text: "text-primary",
    block: "border-primary!",
  },
  superadmin: {
    text: "text-gold",
    block: "border-gold!",
  },
};

interface RoleBadgeProps {
  type?: "default" | "small";
  role: string;
}

const RoleBadge = ({ type = "default", role }: RoleBadgeProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex bg-background items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-medium tracking-wider uppercase bg-surface-2",
        roleStyleMap[role].block,
        type === "small" && "p-0! border-none!",
      )}
    >
      <Diamond className={cn("w-3 h-3", roleStyleMap[role].text)} />
      <span className={roleStyleMap[role].text || roleStyleMap.guest.text}>
        {roles[role] || roles.guest}
      </span>
    </motion.span>
  );
};

export default RoleBadge;
