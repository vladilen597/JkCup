import { useAppSelector } from "@/app/utils/store/hooks";
import { DoorOpen, Loader2 } from "lucide-react";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { IUser } from "@/app/utils/store/userSlice";

interface ITeamUserItemProps extends IUser {
  isLoading: boolean;
  isMyTeam: boolean;
  isCurrentUserCreator: boolean;
  canLeave: boolean;
  onLeaveClick: () => void;
}

const TeamUserItem = ({
  uid,
  photoUrl,
  displayName,
  discord,
  isLoading,
  isMyTeam,
  isCurrentUserCreator,
  steamDisplayName,
  steamLink,
  canLeave,
  onLeaveClick,
}: ITeamUserItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const isCurrentUser = currentUser.uid === uid;

  return (
    <div className="flex items-center justify-between">
      <div key={uid} className="flex items-center gap-3 text-sm">
        <UserInfoBlock
          uid={uid}
          photoUrl={photoUrl}
          discord={discord}
          displayName={displayName}
          steamDisplayName={steamDisplayName}
          steamLink={steamLink}
        />
      </div>
      {isMyTeam &&
        ((isCurrentUser && !isCurrentUserCreator && canLeave) ||
          (!isCurrentUser && isCurrentUserCreator && canLeave)) && (
          <button
            onClick={onLeaveClick}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              <div className="p-2 bg-red-600/80 rounded-sm">
                <DoorOpen className="w-4 h-4" />
              </div>
            )}
          </button>
        )}
    </div>
  );
};

export default TeamUserItem;
