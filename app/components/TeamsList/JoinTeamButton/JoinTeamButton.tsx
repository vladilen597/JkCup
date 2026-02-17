import { useAppSelector } from "@/app/utils/store/hooks";
import { Loader2, Plus } from "lucide-react";

interface IJoinTeamButtonProps {
  isTeamPrivate: boolean;
  isCurrentUserCreator: boolean;
  isLoading: boolean;
  isMyTeam: boolean;
  isTeamFull: boolean;
  onJoinClick: () => void;
  handleClickInvite: () => void;
}

const JoinTeamButton = ({
  isTeamPrivate,
  isCurrentUserCreator,
  isLoading,
  isMyTeam,
  isTeamFull,
  onJoinClick,
  handleClickInvite,
}: IJoinTeamButtonProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  if (isTeamPrivate) {
    if (isCurrentUserCreator && !isTeamFull) {
      return (
        <div>
          <button
            onClick={handleClickInvite}
            className="flex items-center gap-3 cursor-pointer"
            disabled={isLoading}
          >
            <span className="flex items-center justify-center rounded-full w-10 h-10 border border-neutral-500">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </span>
            {!isLoading && (
              <span className="text-neutral-400 text-sm">
                Добавить сокомандника
              </span>
            )}
          </button>
        </div>
      );
    }
  }

  if (!isMyTeam && !isTeamFull && currentUser.uid && !isTeamPrivate) {
    return (
      <div>
        <button
          onClick={onJoinClick}
          className="flex items-center gap-3 cursor-pointer"
          disabled={isLoading}
        >
          <span className="flex items-center justify-center rounded-full w-10 h-10 border border-neutral-500">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </span>
          {!isLoading && (
            <span className="text-neutral-400 text-sm">Присоединиться</span>
          )}
        </button>
      </div>
    );
  }
};

export default JoinTeamButton;
