import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { useAppSelector } from "@/app/utils/store/hooks";
import { Users } from "lucide-react";

interface IJoinTournamentButtonProps {
  isTeamMode: boolean;
  isLoading: boolean;
  isFull: boolean;
  canJoinSingleTournament: boolean;
  isJoinedSingleTournament: boolean | undefined;
  canCreateTeam: boolean;
  handleOpenCreateTeamModal: () => void;
  handleJoinLeave: () => void;
}

const JoinTournamentButton = ({
  isTeamMode,
  isLoading,
  isFull,
  canJoinSingleTournament,
  isJoinedSingleTournament,
  canCreateTeam,
  handleOpenCreateTeamModal,
  handleJoinLeave,
}: IJoinTournamentButtonProps) => {
  const { currentUser } = useAppSelector((state) => state.user);

  console.log(!isTeamMode, !isFull, canJoinSingleTournament);

  if (!currentUser?.id) {
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

  if (!isTeamMode && !isFull && canJoinSingleTournament) {
    return (
      <CustomButton
        label={isJoinedSingleTournament ? "Покинуть" : "Вступить"}
        buttonType={
          isJoinedSingleTournament ? BUTTON_TYPES.DANGER : BUTTON_TYPES.DEFAULT
        }
        isLoading={isLoading}
        disabled={isLoading}
        onClick={handleJoinLeave}
      />
    );
  }
};

export default JoinTournamentButton;
