import { ITeam } from "@/app/utils/store/tournamentsSlice";
import { useAppSelector } from "@/app/utils/store/hooks";
import TeamItem from "./TeamItem/TeamItem";

interface TeamListProps {
  teams: ITeam[];
  tournamentId: string;
  maxPlayersPerTeam: number;
  isLoading?: boolean;
  onJoinTeam?: (teamId: string) => void;
}

const TeamList = ({
  teams = [],
  tournamentId,
  maxPlayersPerTeam,
  isLoading = false,
}: TeamListProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

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
            players_per_team={maxPlayersPerTeam}
          />
        );
      })}
    </ul>
  );
};

export default TeamList;
