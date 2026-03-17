import SelectTeamUserList from "./SelectTeamUserList/SelectTeamUserList";
import { useAppSelector } from "@/app/utils/store/hooks";
import { ITeam } from "@/app/lib/types";
import { SetStateAction } from "react";
import { cn } from "@/lib/utils";

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
        return (
          <li
            key={team.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer",
              selectedTeam?.id === team.id && "outline-2 outline-neon",
            )}
            onClick={() => onTeamClick(team)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                {team.name || `Team ${team.id}`}
              </h3>
            </div>

            <SelectTeamUserList usersIds={team.usersIds} />
          </li>
        );
      })}
    </ul>
  );
};

export default SelectTeamList;
