import { useAppSelector } from "@/app/utils/store/hooks";
import { Loader2, Users } from "lucide-react";
import CustomButton from "../Shared/CustomButton/CustomButton";

interface IJoinTournamentButtonProps {
  isTeamMode: boolean;
  isLoading: boolean;
  isFull: boolean;
  isJoinedSingleTournament: boolean | undefined;
  canCreateTeam: boolean;
  handleOpenCreateTeamModal: () => void;
  handleJoinLeave: () => void;
}

const JoinTournamentButton = ({
  isTeamMode,
  isLoading,
  isFull,
  isJoinedSingleTournament,
  canCreateTeam,
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

  if (isTeamMode && !isFull && canCreateTeam) {
    return (
      <CustomButton
        label="Создать команду"
        icon={<Users className="w-4 h-4" />}
        isLoading={isLoading}
        disabled={isLoading}
        onClick={handleOpenCreateTeamModal}
      />
    );
  }

  if (!isTeamMode && !isFull) {
    return (
      <CustomButton
        label={isJoinedSingleTournament ? "Покинуть" : "Вступить"}
        className={
          isJoinedSingleTournament
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }
        isLoading={isLoading}
        disabled={isLoading}
        onClick={handleJoinLeave}
      />
    );
  }
};

export default JoinTournamentButton;
