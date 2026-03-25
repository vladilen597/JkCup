import TeamUserItem from "../TeamUserItem/TeamUserItem";
import { ITeamMember } from "@/app/lib/types";

const TeamUserList = ({
  members,
  isCurrentUserCreator,
  isLoading,
  canLeave,
  isMyTeam,
  creator_id,
  onLeaveClick,
}: {
  members: ITeamMember[];
  isCurrentUserCreator: boolean;
  isLoading: boolean;
  canLeave: boolean;
  isMyTeam: boolean;
  creator_id: string;
  onLeaveClick: (teamMemberRecordId: string, profile_id: string) => void;
}) => {
  return (
    <ul className="space-y-2">
      {members.map((user) => (
        <TeamUserItem
          key={user.id}
          {...user.profile}
          isMyTeam={isMyTeam}
          isLoading={isLoading}
          creator_id={creator_id}
          isCurrentUserCreator={isCurrentUserCreator}
          onLeaveClick={() => onLeaveClick(user.id, user.profile_id)}
          canLeave={canLeave}
        />
      ))}
    </ul>
  );
};

export default TeamUserList;
