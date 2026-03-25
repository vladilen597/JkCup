"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { Loader2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { removeJudge } from "@/app/utils/store/tournamentsSlice";
import UserInfoBlock from "../../UserInfoBlock/UserInfoBlock";
import { IUser } from "@/app/lib/types";
import axios from "axios";
import { toast } from "react-toastify";

const JudgeLine: React.FC<{
  user: IUser;
  index: number;
  hideDelete?: boolean;
}> = ({ user, hideDelete }) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { id: tournamentId }: { id: string } = useParams();
  const { id, role } = user;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRemoveJudge = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setIsLoading(true);

    try {
      await axios.delete(`/api/tournaments/${tournamentId}/judges`, {
        data: { userId: user.id },
      });

      dispatch(removeJudge({ tournamentId: tournamentId, judgeId: user.id }));

      toast.success("Судья успешно удален с турнира");
    } catch (error: any) {
      console.error(
        "Ошибка при удалении судьи:",
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickLine = () => {
    router.push("/users/" + id);
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
        className={`flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/70 transition-all duration-200 group ${
          role === "superadmin" ? "border-neon" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <UserInfoBlock {...user} />
        </div>
        {(currentUser?.role === "superadmin" ||
          currentUser?.role === "admin") &&
          !hideDelete && (
            <div className="flex items-center justify-center w-10">
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
            </div>
          )}
      </motion.li>
    </div>
  );
};

export default JudgeLine;
