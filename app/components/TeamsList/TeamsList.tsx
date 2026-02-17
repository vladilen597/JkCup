import { db } from "@/app/utils/firebase";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  addTeamParticipant,
  ITeam,
  removeTeam,
  removeTeamParticipant,
} from "@/app/utils/store/tournamentsSlice";
import { doc, updateDoc } from "firebase/firestore";
import { ClockFading, DoorOpen, Loader2, Plus, Trash2 } from "lucide-react";

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
  const dispatch = useAppDispatch();

  const handleLeaveTeam = async (teamId: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);

      const updatedTeams = teams.map((team) => {
        if (team.uid === teamId) {
          return {
            ...team,
            users: team.users.filter((user) => user.uid !== currentUser.uid),
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

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      const teamToDelete = teams.find((team) => team.uid === teamId);

      if (teamToDelete) {
        await updateDoc(tournamentRef, {
          teams: teams.filter((team) => team.uid !== teamId),
        });

        dispatch(removeTeam({ tournamentId, teamId }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      const teamToJoin = teams.find((team) => team.uid === teamId);

      if (teamToJoin) {
        const newTeam = [...teamToJoin?.users, currentUser];
        await updateDoc(tournamentRef, {
          teams: teams.map((team) => {
            if (team.uid === teamId) {
              return {
                ...team,
                users: newTeam,
              };
            }
          }),
        });

        dispatch(
          addTeamParticipant({ tournamentId, teamId, user: currentUser }),
        );
      }
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
        const isMyTeam = users.some((user) => user.uid === currentUser.uid);

        return (
          <div
            key={team.uid}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-all not-first:mt-2"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">
                  {team.name || `Команда ${team.uid.slice(0, 6)}`}
                </h3>
                {team.creator_uid === currentUser.uid && (
                  <button
                    type="button"
                    className="bg-red-500 p-1 rounded-sm text-white cursor-pointer"
                    onClick={() => handleDeleteTeam(team.uid)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {filled} / {maxPlayersPerTeam}
              </span>
            </div>

            <div className="space-y-2">
              {users.map((user) => (
                <div className="flex items-center justify-between">
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
                    {user.uid === currentUser.uid && (
                      <span className="text-xs leading-0 text-orange-400">
                        Вы
                      </span>
                    )}
                  </div>
                  {isMyTeam && currentUser.uid === user.uid && (
                    <button
                      onClick={() => handleLeaveTeam(team.uid)}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        <div className="p-2 bg-red-600/80 rounded-sm">
                          <DoorOpen className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  )}
                </div>
              ))}
              {maxPlayersPerTeam > users.length && !isMyTeam && (
                <div>
                  <button
                    onClick={() => handleJoinTeam(team.uid)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="flex items-center justify-center rounded-full w-8 h-8 border border-neutral-500">
                      <Plus className="h-4 w-4" />
                    </span>
                    <span className="text-neutral-400 text-sm">
                      Присоединиться
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamList;
