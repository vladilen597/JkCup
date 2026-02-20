import { useAppSelector } from "@/app/utils/store/hooks";
import { DoorOpen, Loader2 } from "lucide-react";
import Discord from "../../Icons/Discord";
import Image from "next/image";

interface ITeamUserItemProps {
  uid: string;
  photoUrl: string;
  displayName: string;
  discord: string;
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
  canLeave,
  onLeaveClick,
}: ITeamUserItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const isCurrentUser = currentUser.uid === uid;

  return (
    <div className="flex items-center justify-between">
      <div key={uid} className="flex items-center gap-3 text-sm">
        {photoUrl ? (
          <Image
            width={40}
            height={40}
            src={photoUrl}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
            {displayName?.[0] || "?"}
          </div>
        )}
        <div>
          <div className="">
            <span className="truncate">{displayName}</span>
            {isCurrentUser && (
              <span className="ml-2 ext-xs leading-0 text-orange-400">Вы</span>
            )}
          </div>
          {discord && (
            <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
              <Discord className="w-4 h-4" /> {discord}
            </p>
          )}
        </div>
      </div>
      {isMyTeam &&
        ((isCurrentUser && !isCurrentUserCreator && canLeave) || // Non-creator users can leave
          (!isCurrentUser && isCurrentUserCreator && canLeave)) && ( // Creator can kick others
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
