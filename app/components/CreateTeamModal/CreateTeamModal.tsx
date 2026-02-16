import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { doc, updateDoc } from "firebase/firestore";
import { AlertCircle, Loader2, Users } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { db } from "@/app/utils/firebase";
import { motion } from "motion/react";
import { addTournamentTeam } from "@/app/utils/store/tournamentsSlice";
import { v4 as uuidv4 } from "uuid";

interface ICreateTeamModalProps {
  tournamentId: string;
  onClose: () => void;
}

const CreateTeamModal = ({ tournamentId, onClose }: ICreateTeamModalProps) => {
  const [teamData, setTeamData] = useState({
    name: "",
  });
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleCreateTeam = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!tournamentId) return;
      const tournamentRef = doc(db, "tournaments", tournamentId);
      const uid = uuidv4();

      await updateDoc(tournamentRef, {
        teams: [
          {
            uid,
            creator_uid: currentUser.uid,
            name: teamData.name,
            users: [currentUser],
          },
        ],
      });

      dispatch(
        addTournamentTeam({
          uid,
          tournamentId,
          teamName: teamData.name,
          currentUser: currentUser,
        }),
      );

      onClose();
    } catch (error) {
      setError("Не удалось создать или вступить в команду");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateField = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setTeamData({
        ...teamData,
        [event.target.name]: event.target.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-xl p-6 w-full max-w-md border border-border"
      >
        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Создать команду
        </h3>
        <p className="text-muted-foreground mb-6">
          Это действие нельзя отменить. Все данные турнира будут удалены
          навсегда.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">
            Название команды
          </label>
          <input
            name="name"
            type="name"
            value={teamData.name}
            onChange={handleUpdateField}
            className="w-full p-2 rounded-lg bg-muted border border-border"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
          >
            Отмена
          </button>
          <button
            onClick={handleCreateTeam}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg  disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Создать
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTeamModal;
