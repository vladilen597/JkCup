import { ITeam } from "@/app/utils/store/tournamentsSlice";
import { useAppSelector } from "@/app/utils/store/hooks";
import TeamItem from "./TeamItem/TeamItem";
import { IUser } from "@/app/utils/store/userSlice";

interface TeamListProps {
  teams: ITeam[];
  judgesIds: string[];
  tournamentId: string;
  maxPlayersPerTeam: number;
  isLoading?: boolean;
  tournament_status: string;
  onJoinTeam?: (teamId: string) => void;
}

const TeamList = ({
  teams = [],
  judgesIds,
  tournament_status,
  maxPlayersPerTeam,
}: TeamListProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const occupiedUserIds = new Set(teams.flatMap((team) => team.usersIds));
  const isUserJudge = judgesIds.includes(currentUser.uid);

  const isUserHasTeam = occupiedUserIds.has(currentUser?.uid || "");
  const isCurrentUserCanJoin = !isUserHasTeam && !isUserJudge;

  if (teams.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">Команд пока нет</p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-2">
      {teams.map((team) => {
        const usersIds = team.usersIds;
        const filled = usersIds.length;

        return (
          <TeamItem
            key={team.uid}
            {...team}
            teams={teams}
            filled={filled}
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
