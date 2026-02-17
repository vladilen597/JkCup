"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAppSelector } from "@/app/utils/store/hooks";
import Link from "next/link";
import { roleColors, roles } from "@/app/(app)/users/[id]/page";
import Discord from "../../Icons/Discord";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import CustomSelect from "../../Shared/CustomSelect/CustomSelect";

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
  joinedAt?: any;
  status?: string;
  index?: number;
  discord: string;
  showRoles?: boolean;
  role: string;
}

const UserLine: React.FC<UserLineProps> = ({
  uid,
  displayName,
  photoUrl,
  joinedAt,
  status = "registered",
  index = 0,
  discord,
  role,
  showRoles,
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
  const joinedDate = joinedAt?.toDate?.()
    ? joinedAt.toDate().toLocaleDateString()
    : "—";

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
          <img
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

        {/* {showRoles && (
          <>
            {isSuperAdmin &&
            currentUser.uid !== uid &&
            role !== "superadmin" ? (
              <select
                className="text-xs font-mono outline-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                value={userRole}
                onChange={handleUpdateRole}
              >
                <option className="bg-muted outline-0 text-right" value="user">
                  Пользователь
                </option>
                <option
                  className="bg-muted outline-0  text-right"
                  value="admin"
                >
                  Админ
                </option>
              </select>
            ) : (
              <div
                className={`text-right text-xs text-muted-foreground font-mono ${roleColors[role as keyof typeof roleColors]}`}
              >
                {roles[role as keyof typeof roles]}
              </div>
            )}
          </>
        )} */}

        {showRoles && (
          <>
            {isSuperAdmin &&
            currentUser.uid !== uid &&
            role !== "superadmin" ? (
              <CustomSelect
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
      </motion.li>
    </Link>
  );
};

export default UserLine;
