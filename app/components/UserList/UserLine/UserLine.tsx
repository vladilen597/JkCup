"use client";

import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { roleColors, roles } from "@/app/(app)/users/[id]/page";
import RoleSelect from "../../Shared/RoleSelect/RoleSelect";
import { useAppSelector } from "@/app/utils/store/hooks";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { motion } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { IUser } from "@/app/utils/store/userSlice";
import { useRouter } from "next/navigation";

const roleSelectOptions = [
  {
    id: 1,
    value: "user",
    label: "Пользователь",
  },
  {
    id: 2,
    value: "admin",
    label: "Админ",
  },
];

interface UserLineProps extends IUser {
  showRoles?: boolean;
  hideDelete?: boolean;
  index?: number;
  onDeleteClick: () => void;
}

const UserLine: React.FC<UserLineProps> = ({
  uid,
  displayName,
  photoUrl,
  index = 0,
  discord,
  role,
  showRoles,
  hideDelete,
  steamDisplayName,
  steamLink,
  onDeleteClick,
}) => {
  const [userRole, setUserRole] = useState<{
    id: number;
    value: string;
    label: string;
  }>({
    id: 1,
    value: "user",
    label: "Пользователь",
  });
  const { user: currentUser } = useAppSelector((state) => state.user);
  const router = useRouter();
  const isSuperAdmin = currentUser.role === "superadmin";

  const handleClickLine = () => {
    router.push("/users/" + uid);
  };

  const handleUpdateRole = async (value: {
    id: number;
    value: string;
    label: string;
  }) => {
    setUserRole(value);
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        role: value.value,
      });
    } catch (error) {
      console.log(error);
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
          uid={uid}
          discord={discord}
          displayName={displayName}
          photoUrl={photoUrl || ""}
          steamDisplayName={steamDisplayName}
          steamLink={steamLink}
        />

        {showRoles && (
          <>
            {isSuperAdmin &&
            currentUser.uid !== uid &&
            role !== "superadmin" ? (
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
        {!hideDelete &&
          currentUser.role === "superadmin" &&
          role !== "superadmin" &&
          currentUser.uid !== uid &&
          onDeleteClick && (
            <button
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
