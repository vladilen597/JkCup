import { ITeam } from "@/app/utils/store/tournamentsSlice";
import { useAppSelector } from "@/app/utils/store/hooks";
import TeamItem from "./TeamItem/TeamItem";
import { useState } from "react";

interface TeamListProps {
  teams: ITeam[];
  tournamentId: string;
  maxPlayersPerTeam: number;
  isLoading?: boolean;
  tournament_status: string;
  onJoinTeam?: (teamId: string) => void;
}

const TeamList = ({
  teams = [],
  tournament_status,
  maxPlayersPerTeam,
}: TeamListProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const isUserHasTeam = teams.some((team) =>
    team.users?.some((user) => user.uid === currentUser.uid),
  );

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
            canJoin={!isUserHasTeam}
            players_per_team={maxPlayersPerTeam}
            tournament_status={tournament_status}
          />
        );
      })}
    </ul>
  );
};

export default TeamList;
