import { useAppSelector } from "@/app/utils/store/hooks";
import { DoorOpen, Loader2 } from "lucide-react";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/lib/types";

interface ITeamUserItemProps extends IUser {
  isLoading: boolean;
  isMyTeam: boolean;
  isCurrentUserCreator: boolean;
  canLeave: boolean;
  onLeaveClick: () => void;
}

const TeamUserItem = ({
  id,
  image_url,
  full_name,
  discord,
  isLoading,
  isMyTeam,
  isCurrentUserCreator,
  steam_display_name,
  steam_link,
  canLeave,
  onLeaveClick,
}: ITeamUserItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const router = useRouter();

  const isCurrentUser = currentUser.id === id;

  const handleClickLine = () => {
    router.push("/users/" + id);
  };

  return (
    <li className="flex items-center justify-between">
      <div
        className="rounded-lg w-full cursor-pointer"
        onClick={handleClickLine}
      >
        <div key={id} className="flex items-center gap-3 text-sm">
          <UserInfoBlock
            id={id}
            image_url={image_url}
            discord={discord}
            full_name={full_name}
            steam_display_name={steam_display_name}
            steam_link={steam_link}
          />
        </div>
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
    </li>
  );
};

export default TeamUserItem;
