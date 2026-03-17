import { useTournamentStats } from "@/app/utils/useTournamentUsersRealtime";
import { Loader2, Sword, Swords, User, Users } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

const TournamentStats: React.FC = () => {
  const { count } = useTournamentStats();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2">
        <User className="text-primary w-4 h-4" />
        <div>
          <span className="text-xs text-muted-foreground">Участники</span>
          <p className="text-sm font-bold text-foreground font-display">
            <CountUp start={0} end={count} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default TournamentStats;
