import { ITeam } from "@/app/utils/store/tournamentsSlice";
import { useAppSelector } from "@/app/utils/store/hooks";
import TeamItem from "./TeamItem/TeamItem";
import { IUser } from "@/app/utils/store/userSlice";

interface TeamListProps {
  teams: ITeam[];
  judges: IUser[];
  tournamentId: string;
  maxPlayersPerTeam: number;
  isLoading?: boolean;
  tournament_status: string;
  onJoinTeam?: (teamId: string) => void;
}

const TeamList = ({
  teams = [],
  judges,
  tournament_status,
  maxPlayersPerTeam,
}: TeamListProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const occupiedUserIds = new Set(
    teams.flatMap((team) => team.users?.map((user) => user.uid) || []),
  );
  const isUserJudge = judges.some((judge) => judge.uid === currentUser.uid);

  const isUserHasTeam = occupiedUserIds.has(currentUser?.uid || "");
  const isCurrentUserCanJoin = !isUserHasTeam && !isUserJudge;

  if (teams.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">Команд пока нет</p>
    );
  }

  return (
    <ul>
      {teams.map((team) => {
        const users = team.users || [];
        const filled = users.length;
        const isMyTeam = users.some((user) => user.uid === currentUser.uid);

        return (
          <TeamItem
            key={team.uid}
            {...team}
            teams={teams}
            filled={filled}
            is_my_team={isMyTeam}
            canJoin={isCurrentUserCanJoin}
            players_per_team={maxPlayersPerTeam}
            tournament_status={tournament_status}
            occupiedUserIds={occupiedUserIds}
          />
        );
      })}
    </ul>
  );
};

export default TeamList;
