import React from "react";
import { motion } from "framer-motion";

interface UserLineProps {
  id: string;
  displayName: string;
  photoURL: string | null;
  joinedAt?: any;
  status?: string;
  index?: number;
}

const UserLine: React.FC<UserLineProps> = ({
  displayName,
  photoURL,
  joinedAt,
  status = "registered",
  index = 0,
}) => {
  const joinedDate = joinedAt?.toDate?.()
    ? joinedAt.toDate().toLocaleDateString()
    : "—";

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group"
    >
      {photoURL ? (
        <img
          src={photoURL}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate text-sm">
          {displayName}
        </p>
        {status !== "registered" && (
          <p className="text-xs text-secondary font-medium">{status}</p>
        )}
      </div>

      <div className="text-right text-xs text-muted-foreground font-mono">
        {joinedDate}
      </div>
    </motion.li>
  );
};

export default UserLine;
