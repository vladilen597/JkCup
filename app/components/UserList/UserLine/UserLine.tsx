"use client";

import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { roleColors, roles } from "@/app/(app)/users/[id]/page";
import RoleSelect from "../../Shared/RoleSelect/RoleSelect";
import { useAppSelector } from "@/app/utils/store/hooks";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { motion } from "motion/react";
import { Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/lib/types";
import axios from "axios";

const roleSelectOptions = [
  {
    id: 1,
    value: "guest",
    label: "Гость",
  },
  {
    id: 2,
    value: "admin",
    label: "Админ",
  },
  {
    id: 3,
    value: "user",
    label: "Участник",
  },
];

interface UserLineProps extends IUser {
  showRoles?: boolean;
  hideDelete?: boolean;
  index?: number;
  onDeleteClick: () => void;
  onBlockClick?: () => void;
}

const UserLine: React.FC<UserLineProps> = ({
  id,
  full_name,
  image_url,
  index = 0,
  discord,
  role,
  showRoles,
  hideDelete,
  steam_display_name,
  steam_link,
  status,
  onDeleteClick,
  onBlockClick,
}) => {
  const [userRole, setUserRole] = useState<{
    id: number;
    value: string;
    label: string;
  }>({
    id: 1,
    value: "guest",
    label: "Гость",
  });
  const { user: currentUser } = useAppSelector((state) => state.user);
  const router = useRouter();
  const isSuperAdmin = currentUser.role === "superadmin";

  const handleClickLine = () => {
    router.push("/users/" + id);
  };

  const handleUpdateRole = async (value: {
    id: number;
    value: string;
    label: string;
  }) => {
    const oldRole = userRole;
    setUserRole(value);
    try {
      await axios.post("/api/users/user/update/role", {
        userId: id,
        newRole: value.value,
      });
    } catch (error) {
      console.log(error);
      setUserRole(oldRole);
    }
  };

  useEffect(() => {
    const loadedRole = roleSelectOptions.find(
      (roleOption) => roleOption.value === role,
    );
    if (loadedRole) {
      setUserRole(loadedRole);
    }
  }, []);

  return (
    <div className="cursor-pointer" onClick={handleClickLine}>
      <motion.li
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group ${
          role === "superadmin" ? "border-neon" : ""
        }`}
      >
        <UserInfoBlock
          id={id}
          discord={discord}
          full_name={full_name}
          image_url={image_url || ""}
          steam_display_name={steam_display_name}
          steam_link={steam_link}
        />

        {showRoles && (
          <>
            {isSuperAdmin && currentUser.id !== id && role !== "superadmin" ? (
              <RoleSelect
                value={userRole}
                onChange={handleUpdateRole}
                options={roleSelectOptions}
              />
            ) : (
              <div
                className={`text-right text-xs text-muted-foreground font-mono ${roleColors[role as keyof typeof roleColors]}`}
              >
                {roles[role as keyof typeof roles]}
              </div>
            )}
          </>
        )}
        {onBlockClick &&
          currentUser.role === "superadmin" &&
          role !== "superadmin" && (
            <button
              type="button"
              className="cursor-pointer hover:bg-background/60 rounded-full transition-colors p-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onBlockClick();
              }}
            >
              <Lock
                style={
                  status === "blocked"
                    ? { color: "#fb2c36" }
                    : { color: "#737373" }
                }
                className="w-4 h-4 transition-colors"
              />
            </button>
          )}
        {!hideDelete &&
          currentUser.role === "superadmin" &&
          role !== "superadmin" &&
          currentUser.id !== id &&
          onDeleteClick && (
            <button
              className="cursor-pointer hover:bg-background/60 rounded-full p-1 transition-colors"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteClick();
              }}
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          )}
      </motion.li>
    </div>
  );
};

export default UserLine;
