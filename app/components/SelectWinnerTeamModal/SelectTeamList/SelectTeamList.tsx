import SelectTeamUserList from "./SelectTeamUserList/SelectTeamUserList";
import { IArchivedTeam, ITeam } from "@/app/lib/types";
import { cn } from "@/lib/utils";

interface TeamListProps {
  teams: (ITeam | IArchivedTeam)[];
  selectedTeam: ITeam | IArchivedTeam | null;
  onTeamClick: (team: ITeam | IArchivedTeam | null) => void;
}

const SelectTeamList = ({
  teams = [],
  selectedTeam,
  onTeamClick,
}: TeamListProps) => {
  if (teams.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Команд нет</p>;
  }

  return (
    <ul className="space-y-2">
      {teams.map((team) => {
        const isSelected = selectedTeam?.id === team.id;

        const normalizedMembers = (team.members || []).map((m: any) => {
          const profileData = m.user || m.profile;
          const profileId = m.user_id || m.profile_id;

          return {
            ...m,
            profile_id: profileId,
            profile: profileData,
            joined_at: m.joined_at || m.created_at || new String(new Date()),
          };
        });

        return (
          <li
            key={team.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-colors bg-zinc-900/30 border-zinc-800 hover:border-zinc-700",
              isSelected && "border-neon!",
            )}
            onClick={() => onTeamClick(isSelected ? null : team)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className={cn(
                  "font-semibold text-zinc-300",
                  isSelected && "text-amber-400",
                )}
              >
                {team.name || `Team ${team.id}`}
              </h3>
            </div>

            <SelectTeamUserList members={normalizedMembers as any} />
          </li>
        );
      })}
    </ul>
  );
};

export default SelectTeamList;
