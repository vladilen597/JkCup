import { useAppSelector } from "@/app/utils/store/hooks";
import { Loader2 } from "lucide-react";

interface IJoinTournamentButtonProps {
  isTeamMode: boolean;
  isLoading: boolean;
  isFull: boolean;
  isJoinedSingleTournament: boolean | undefined;
  handleOpenCreateTeamModal: () => void;
  handleJoinLeave: () => void;
}

const JoinTournamentButton = ({
  isTeamMode,
  isLoading,
  isFull,
  isJoinedSingleTournament,
  handleOpenCreateTeamModal,
  handleJoinLeave,
}: IJoinTournamentButtonProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  if (!currentUser?.uid) {
    return (
      <button
        disabled
        className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-muted text-muted-foreground cursor-not-allowed"
      >
        Войдите, чтобы участвовать
      </button>
    );
  }

  if (isTeamMode && !isFull) {
    return (
      <button
        onClick={handleOpenCreateTeamModal}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-primary hover:bg-primary/90 text-primary-foreground`}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Создать команду
      </button>
    );
  }

  if (!isTeamMode && !isFull) {
    return (
      <button
        onClick={handleJoinLeave}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors
                ${isJoinedSingleTournament ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
                disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isJoinedSingleTournament ? "Покинуть" : "Вступить"}
      </button>
    );
  }
};

export default JoinTournamentButton;
