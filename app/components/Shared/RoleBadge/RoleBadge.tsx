import { motion } from "framer-motion";

const roles: Record<string, string> = {
  user: "Участник",
  admin: "Админ",
  superadmin: "Суперадмин",
  guest: "Гость",
};

const roleStyleMap: Record<string, string> = {
  guest: "text-role-guest border-[hsl(var(--role-guest)/0.3)]",
  user: "text-role-user border-[hsl(var(--role-user)/0.3)]",
  admin: "text-role-admin border-[hsl(var(--role-admin)/0.3)] glow-primary-sm",
  superadmin: "text-role-superadmin border-[hsl(var(--role-superadmin)/0.3)]",
};

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-medium tracking-wider uppercase bg-surface-2 ${roleStyleMap[role] || roleStyleMap.guest}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      {roles[role] || roles.guest}
    </motion.span>
  );
};

export default RoleBadge;
