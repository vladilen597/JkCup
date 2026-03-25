import { useAppSelector } from "@/app/utils/store/hooks";
import DraggableTeam from "../DraggableTeam/DraggableTeam";
import { ITeam, ITournamentRegistration } from "@/app/lib/types";
import { Users } from "lucide-react";
import DraggableUser from "../DraggableUser/DraggableUser";

interface IPlayersSelectBlockProps {
  isTeamMode: boolean;
  teams: ITeam[];
  registrations: ITournamentRegistration[];
}

const PlayersSelectBlock = ({
  isTeamMode,
  teams,
  registrations,
}: IPlayersSelectBlockProps) => {
  const { currentUser } = useAppSelector((state) => state.user);

  const isAdmin =
    currentUser.role === "admin" || currentUser.role === "superadmin";

  if (!isAdmin) return null;

  if (isTeamMode) {
    return (
      <ul className="space-y-2">
        {teams.map((team) => (
          <li key={team.id}>
            <DraggableTeam team={team} />
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm mx-4">
        <h4 className="flex items-center gap-2 mb-4 font-bold text-zinc-400 text-sm uppercase tracking-tight">
          <Users className="w-4 h-4" /> Доступные игроки
        </h4>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          {registrations.map((registration) => (
            <DraggableUser
              key={registration.profile_id}
              user={registration.profile}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default PlayersSelectBlock;
