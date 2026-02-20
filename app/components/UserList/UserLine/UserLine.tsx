"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAppSelector } from "@/app/utils/store/hooks";
import Link from "next/link";
import { roleColors, roles } from "@/app/(app)/users/[id]/page";
import Discord from "../../Icons/Discord";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import RoleSelect from "../../Shared/RoleSelect/RoleSelect";
import { X } from "lucide-react";
import Image from "next/image";

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

interface UserLineProps {
  uid: string;
  displayName: string;
  photoUrl: string | null;
  status?: string;
  index?: number;
  discord: string;
  showRoles?: boolean;
  role: string;
  hideDelete?: boolean;
  onDeleteClick: () => void;
}

const UserLine: React.FC<UserLineProps> = ({
  uid,
  displayName,
  photoUrl,
  status = "registered",
  index = 0,
  discord,
  role,
  showRoles,
  hideDelete,
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

  const isCurrentUser = uid === currentUser.uid;
  const isSuperAdmin = currentUser.role === "superadmin";

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
    <Link href={"/users/" + uid}>
      <motion.li
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group ${
          role === "superadmin" ? "border-neon" : ""
        }`}
      >
        {photoUrl ? (
          <Image
            width={40}
            height={40}
            src={photoUrl}
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
          <div>
            <p className="font-semibold text-foreground truncate leading-5 text-sm">
              {displayName}
              {isCurrentUser && (
                <span className="ml-2 text-xs leading-0 text-orange-400">
                  Вы
                </span>
              )}
            </p>
            {discord && (
              <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                <Discord className="w-4 h-4" /> {discord}
              </p>
            )}
          </div>
          {status !== "registered" && (
            <p className="text-xs text-secondary font-medium">{status}</p>
          )}
        </div>

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
        {!hideDelete && onDeleteClick && (
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
    </Link>
  );
};

export default UserLine;
