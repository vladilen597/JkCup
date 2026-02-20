import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { addJudge } from "@/app/utils/store/tournamentsSlice";
import Discord from "@/app/components/Icons/Discord";
import { IUser } from "@/app/utils/store/userSlice";
import { useParams } from "next/navigation";
import { db } from "@/app/utils/firebase";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface IJudgeAddItemProps {
  user: IUser;
  index: number;
  onClose: () => void;
}

const JudgeAddItem = ({ user, index, onClose }: IJudgeAddItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { id: tournamentId }: { id: string } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddUser = async (user: IUser) => {
    setIsLoading(true);
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);

      await updateDoc(tournamentRef, {
        judges: arrayUnion(user),
      });

      dispatch(addJudge({ tournamentId, user }));
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group ${
        user.role === "superadmin" ? "border-neon" : ""
      }`}
    >
      {user.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={user.displayName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20">
          {user.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div>
          <p className="font-semibold text-foreground truncate leading-5 text-sm">
            {user.displayName}
          </p>
          {user.discord && (
            <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
              <Discord className="w-4 h-4" /> {user.discord}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="flex items-center gap-2 border border-neon p-2 rounded-lg text-sm"
        onClick={() => handleAddUser(user)}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Добавить
      </button>
    </motion.li>
  );
};

export default JudgeAddItem;
