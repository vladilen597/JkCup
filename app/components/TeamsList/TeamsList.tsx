import { db } from "@/app/utils/firebase";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { removeTeamParticipant } from "@/app/utils/store/tournamentsSlice";
import { IUser } from "@/app/utils/store/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

interface TeamListProps {
  teams: ITeam[];
  tournamentId: string;
  maxPlayersPerTeam: number;
  currentUserUid?: string;
  isLoading?: boolean;
  onJoinTeam?: (teamId: string) => void;
}

const TeamList = ({
  teams = [],
  tournamentId,
  maxPlayersPerTeam,
  currentUserUid,
  isLoading = false,
  onJoinTeam,
}: TeamListProps) => {
  const dispatch = useAppDispatch();

  const handleLeaveTeam = async (teamId: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);

      const updatedTeams = teams.map((team) => {
        if (team.uid === teamId) {
          return {
            ...team,
            users: team.users.filter((user) => user.uid !== currentUserUid),
          };
        } else {
          return team;
        }
      });

      dispatch(removeTeamParticipant({ tournamentId, updatedTeams }));

      await updateDoc(tournamentRef, {
        teams: updatedTeams,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (teams.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">Команд пока нет</p>
    );
  }

  return (
    <div className="">
      {teams.map((team) => {
        const users = team.users || [];
        const filled = users.length;
        const isMyTeam = users.some((user) => user.uid === currentUserUid);

        return (
          <div
            key={team.uid}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-all not-first:mt-2"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">
                {team.name || `Команда ${team.uid.slice(0, 6)}`}
              </h3>
              <span className="text-sm text-gray-400">
                {filled} / {maxPlayersPerTeam}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {filled === 0 ? (
                <p className="text-gray-500 text-sm text-center py-2">
                  Пустая команда
                </p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.uid}
                    className="flex items-center gap-3 text-sm"
                  >
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                        {user.displayName?.[0] || "?"}
                      </div>
                    )}
                    <span className="truncate">{user.displayName}</span>
                    {user.uid === currentUserUid && (
                      <span className="text-xs text-green-400 ml-auto">Вы</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              {filled < maxPlayersPerTeam && !isMyTeam && (
                <button
                  onClick={() => onJoinTeam?.(team.uid)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Присоединиться"
                  )}
                </button>
              )}

              {isMyTeam && (
                <button
                  onClick={() => handleLeaveTeam(team.uid)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Покинуть"
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamList;
