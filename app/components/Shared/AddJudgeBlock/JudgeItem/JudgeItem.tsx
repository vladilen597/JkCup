"use client";

import React, { MouseEvent, useState } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/utils/firebase";
import { IUser } from "@/app/utils/store/userSlice";
import { removeJudge } from "@/app/utils/store/tournamentsSlice";
import UserInfoBlock from "../../UserInfoBlock/UserInfoBlock";

const JudgeLine: React.FC<{ user: IUser; index: number }> = ({
  user,
  index,
}) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { id: tournamentId }: { id: string } = useParams();
  const { uid, role } = user;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRemoveJudge = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      await updateDoc(tournamentRef, {
        judgesIds: arrayRemove(user.uid),
      });
      dispatch(removeJudge({ tournamentId, userId: uid }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickLine = () => {
    router.push("/users/" + uid);
  };

  return (
    <div
      className="not-first:border-t border-t-border/50 cursor-pointer"
      onClick={handleClickLine}
    >
      <motion.li
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/70  transition-all duration-200 group ${
          role === "superadmin" ? "border-neon" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <UserInfoBlock {...user} />
        </div>
        {(currentUser.role === "superadmin" ||
          currentUser.role === "admin") && (
          <>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <button
                onClick={handleRemoveJudge}
                className="rounded-full p-1 hover:bg-background/60 hover:text-white! group transition-colors cursor-pointer"
              >
                <X className="text-neutral-500 group-hover:text-white transition-colors" />
              </button>
            )}
          </>
        )}
      </motion.li>
    </div>
  );
};

export default JudgeLine;
