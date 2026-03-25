import { useAppSelector } from "@/app/utils/store/hooks";
import { DoorOpen, Loader2, Trash2, X } from "lucide-react";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/lib/types";
import CustomButton, {
  BUTTON_TYPES,
} from "../../Shared/CustomButton/CustomButton";
import { useState } from "react";

interface ITeamUserItemProps extends IUser {
  isLoading: boolean;
  isMyTeam: boolean;
  isCurrentUserCreator: boolean;
  canLeave: boolean;
  creator_id: string;
  onLeaveClick: () => void;
}

const TeamUserItem = ({
  id,
  image_url,
  full_name,
  discord_full_name,
  isLoading,
  isMyTeam,
  isCurrentUserCreator,
  steam_name,
  steam_profile_url,
  canLeave,
  creator_id,
  onLeaveClick,
}: ITeamUserItemProps) => {
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const router = useRouter();

  const isCurrentUser = currentUser.id === id;

  const handleClickLine = () => {
    router.push("/users/" + id);
  };

  const handleClickLeave = async () => {
    setIsLeaveLoading(true);
    await onLeaveClick();
    setIsLeaveLoading(false);
  };

  return (
    <li className="flex items-center justify-between">
      <div
        className="rounded-lg w-full cursor-pointer flex items-center justify-between"
        onClick={handleClickLine}
      >
        <div key={id} className="flex items-center gap-3 text-sm">
          <UserInfoBlock
            id={id}
            image_url={image_url}
            discord_full_name={discord_full_name}
            full_name={full_name}
            steam_name={steam_name}
            steam_profile_url={steam_profile_url}
          />
        </div>
        {creator_id === id && (
          <span className="text-amber-300 font-mono text-xs">Капитан</span>
        )}
      </div>
      {isMyTeam && (
        <>
          {isCurrentUserCreator && !isCurrentUser && (
            <CustomButton
              className="p-1 rounded-sm bg-red-600/20 border border-red-600! text-red-600"
              buttonType={BUTTON_TYPES.DANGER}
              isLoading={isLeaveLoading}
              icon={<X className="w-4 h-4" />}
              onClick={handleClickLeave}
            />
          )}

          {!isCurrentUserCreator && isCurrentUser && canLeave && (
            <CustomButton
              className="p-1 rounded-sm bg-red-600/20 border border-red-600! text-red-600"
              buttonType={BUTTON_TYPES.DANGER}
              isLoading={isLeaveLoading}
              icon={<DoorOpen className="w-4 h-4" />}
              onClick={handleClickLeave}
            />
          )}
        </>
      )}
    </li>
  );
};

export default TeamUserItem;
