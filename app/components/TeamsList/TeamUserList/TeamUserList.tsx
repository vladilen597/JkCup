import TeamUserItem from "../TeamUserItem/TeamUserItem";
import { ITeamMember } from "@/app/lib/types";

const TeamUserList = ({
  members,
  isCurrentUserCreator,
  isLoading,
  canLeave,
  isMyTeam,
  onLeaveClick,
}: {
  members: ITeamMember[];
  isCurrentUserCreator: boolean;
  isLoading: boolean;
  canLeave: boolean;
  isMyTeam: boolean;
  onLeaveClick: (userId: string) => void;
}) => {
  return (
    <ul className="space-y-2">
      {members.map((user) => (
        <TeamUserItem
          key={user.id}
          {...user.profile}
          isMyTeam={isMyTeam}
          isLoading={isLoading}
          isCurrentUserCreator={isCurrentUserCreator}
          onLeaveClick={() => onLeaveClick(user.id)}
          canLeave={canLeave}
        />
      ))}
    </ul>
  );
};

export default TeamUserList;
