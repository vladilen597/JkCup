import { ITeam } from "@/app/utils/store/tournamentsSlice";
import { useAppSelector } from "@/app/utils/store/hooks";
import Discord from "../../Icons/Discord";
import { SetStateAction } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TeamListProps {
  teams: ITeam[];
  selectedTeam: ITeam | null;
  onTeamClick: (team: SetStateAction<ITeam | null>) => void;
}

const SelectTeamList = ({
  teams = [],
  selectedTeam,
  onTeamClick,
}: TeamListProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  if (teams.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Команд нет</p>;
  }

  return (
    <ul className="space-y-2">
      {teams.map((team) => {
        const users = team.users || [];

        return (
          <li
            key={team.uid}
            className={cn(
              "border rounded-lg p-4 cursor-pointer",
              selectedTeam?.uid === team.uid && "outline-2 outline-neon",
            )}
            onClick={() => onTeamClick(team)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                {team.name || `Team ${team.uid}`}
              </h3>
            </div>

            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.uid}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      {user.photoUrl ? (
                        <Image
                          width={40}
                          height={40}
                          src={user.photoUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                          {user.displayName?.[0] || "?"}
                        </div>
                      )}
                      <div>
                        <div>
                          <span className="truncate">{user.displayName}</span>
                          {currentUser.uid === user.uid && (
                            <span className="ml-2 text-xs text-orange-400">
                              Вы
                            </span>
                          )}
                        </div>
                        {user.discord && (
                          <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                            <Discord className="w-4 h-4" /> {user.discord}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default SelectTeamList;
