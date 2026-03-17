import Discord from "@/app/components/Icons/Discord";
import { motion } from "motion/react";
import { IUser } from "@/app/lib/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IJudgeAddItemProps {
  user: IUser;
  index: number;
  isSelected: boolean;
  onClose: () => void;
  onClick: () => void;
}

const JudgeAddItem = ({
  user,
  index,
  isSelected,
  onClick,
}: IJudgeAddItemProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group",
        user.role === "superadmin" ? "border-neon" : "",
        isSelected && "border-neon!",
      )}
      onClick={onClick}
    >
      {user.image_url ? (
        <Image
          width={40}
          height={40}
          src={user.image_url}
          alt={user.full_name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20">
          {user.full_name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div>
          <p className="font-semibold text-foreground truncate leading-5 text-sm">
            {user.full_name}
          </p>
          {user.discord && (
            <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
              <Discord className="w-4 h-4" /> {user.discord}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default JudgeAddItem;
