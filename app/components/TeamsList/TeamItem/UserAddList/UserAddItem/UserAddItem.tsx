import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import Discord from "@/app/components/Icons/Discord";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { db } from "@/app/utils/firebase";
import { useState } from "react";
import { addTeamParticipant } from "@/app/utils/store/tournamentsSlice";
import { Loader2 } from "lucide-react";
import { ITeam, IUser } from "@/app/lib/types";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

interface IUserAddItemProps {
  user: IUser;
  index: number;
  teamId: string;
  onClose: () => void;
}

const UserAddItem = ({ user, index, teamId, onClose }: IUserAddItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { id: tournamentId }: { id: string } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddUser = async (selectedUser: IUser) => {
    setIsLoading(true);
    try {
      const { data: newMember } = await axios.post(
        `/api/tournaments/${tournamentId}/teams/${teamId}/members`,
        {
          userId: selectedUser.id,
        },
      );

      dispatch(
        addTeamParticipant({
          tournamentId,
          teamId: teamId,
          member: newMember,
        }),
      );

      toast.success(`${selectedUser.full_name} добавлен в команду`);
      onClose();
    } catch (error: any) {
      console.error("Add user error:", error);
      toast.error(error.response?.data?.error || "Не удалось добавить игрока");
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
      {currentUser.id !== user.id && (
        <button
          type="button"
          className="flex items-center gap-2 border border-neon p-2 rounded-lg text-sm"
          onClick={() => handleAddUser(user)}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Добавить
        </button>
      )}
    </motion.li>
  );
};

export default UserAddItem;
