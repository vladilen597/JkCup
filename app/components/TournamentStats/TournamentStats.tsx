import useTournamentUsersRealtime from "@/app/utils/useTournamentUsersRealtime";
import { Loader2, Sword, Swords, User, Users } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

const TournamentStats: React.FC = () => {
  const {
    totalJoinedUsers,
    totalSingleTournaments,
    totalTeamTournaments,
    totalTeams,
  } = useTournamentUsersRealtime({
    onlyActive: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2">
        <User className="text-primary w-4 h-4" />
        <div>
          <span className="text-xs text-muted-foreground">Участники</span>
          <p className="text-sm font-bold text-foreground font-display">
            <CountUp start={0} end={totalJoinedUsers} />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2">
        <Users className="text-primary w-4 h-4" />
        <div>
          <span className="text-xs text-muted-foreground">Команды</span>
          <p className="text-sm font-bold text-foreground font-display">
            <CountUp start={0} end={totalTeams} />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2">
        <Swords className="text-primary w-4 h-4" />
        <div>
          <span className="text-xs text-muted-foreground">
            Командных турниров
          </span>
          <p className="text-sm font-bold text-foreground font-display">
            <CountUp start={0} end={totalTeamTournaments} />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2">
        <Sword className="text-primary w-4 h-4" />
        <div>
          <span className="text-xs text-muted-foreground">
            Одиночных турниров
          </span>
          <p className="text-sm font-bold text-foreground font-display">
            <CountUp start={0} end={totalSingleTournaments} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default TournamentStats;
