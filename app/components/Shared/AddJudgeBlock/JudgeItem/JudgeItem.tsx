"use client";

import React, { MouseEvent, useState } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import Link from "next/link";
import Discord from "@/app/components/Icons/Discord";
import { Cross, Loader2, X } from "lucide-react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/app/utils/firebase";
import { IUser } from "@/app/utils/store/userSlice";
import { removeJudge } from "@/app/utils/store/tournamentsSlice";
import UserInfoBlock from "../../UserInfoBlock/UserInfoBlock";

const UserLine: React.FC<{ user: IUser; index: number }> = ({
  user,
  index,
}) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { id: tournamentId }: { id: string } = useParams();
  const isCurrentUser = user.uid === currentUser.uid;
  const { uid, displayName, photoUrl, discord, role } = user;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleRemoveJudge = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      await updateDoc(tournamentRef, {
        judges: arrayRemove(user),
      });
      dispatch(removeJudge({ tournamentId, userId: uid }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={"/users/" + uid}
      className="not-first:border-t border-t-border/50"
    >
      <motion.li
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/70  transition-all duration-200 group ${
          role === "superadmin" ? "border-neon" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <UserInfoBlock {...user} />
        </div>
        {currentUser.role !== "user" && (
          <>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <button onClick={handleRemoveJudge}>
                <X className="text-neutral-500" />
              </button>
            )}
          </>
        )}
      </motion.li>
    </Link>
  );
};

export default UserLine;
