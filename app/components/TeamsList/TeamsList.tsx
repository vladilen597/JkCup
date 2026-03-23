import { useAppSelector } from "@/app/utils/store/hooks";
import TeamItem from "./TeamItem/TeamItem";
import {
  IArchivedJudge,
  IArchivedTeam,
  ITeam,
  ITournamentJudge,
} from "@/app/lib/types";

interface TeamListProps {
  teams: ITeam[] | IArchivedTeam[];
  judges: ITournamentJudge[] | IArchivedJudge[];
  tournamentId: string;
  maxPlayersPerTeam: number;
  isLoading?: boolean;
  tournament_status: string;
  onJoinTeam?: (teamId: string) => void;
}

const TeamList = ({
  teams = [],
  judges = [],
  tournament_status,
  maxPlayersPerTeam,
}: TeamListProps) => {
  const { currentUser } = useAppSelector((state) => state.user);

  const occupiedUserIds = new Set([
    ...teams.flatMap((team) => team.members?.map((m) => m.profile_id) || []),
    ...judges.map((judge) => judge.profile_id),
  ]);

  const isUserJudge = judges.some(
    (judge) => judge.profile_id === currentUser?.id,
  );

  const isUserGuest = currentUser?.role === "guest";
  const isUserHasTeam = occupiedUserIds.has(currentUser?.id || "");

  const isCurrentUserCanJoin = !isUserHasTeam && !isUserJudge && !isUserGuest;

  if (teams.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">Команд пока нет</p>
    );
  }

  return (
    <ul className="grid lg:grid-cols-2 grid-cols-1 gap-2">
      {teams.map((team) => {
        const filled = team.members?.length || 0;

        return (
          <TeamItem
            key={team.id}
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
