import useTournamentUsersRealtime from "@/app/utils/useTournamentUsersRealtime";
import { Loader2, RefreshCcw, Users } from "lucide-react";
import React from "react";

const TournamentStats: React.FC = () => {
  const { stats, loading, error, refresh } = useTournamentUsersRealtime({
    onlyActive: false,
    minUsers: 0,
    includeEmpty: true,
  });

  if (loading) {
    return (
      <div className="tournament-stats loading">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournament-stats error">
        <p className="error-message">Error: {error}</p>
        <button onClick={refresh} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="tournament-stats empty">
        <p>No tournament data available</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2">
        <Users className="text-primary w-4 h-4" />
        <div>
          <span className="text-xs text-muted-foreground">Участники</span>
          <p className="text-sm font-bold text-foreground font-display">
            {stats.totalJoinedUsers}
          </p>
        </div>
      </div>

      <button onClick={refresh} className="refresh-button">
        <RefreshCcw />
      </button>
    </div>
  );
};

export default TournamentStats;
