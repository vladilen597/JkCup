import { ITeam } from "@/app/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";

const DraggableTeam = ({ team }: { team: ITeam }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: team.id,
    data: { ...team, type: "team" },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 bg-zinc-800/80 border border-zinc-700 rounded-lg cursor-grab hover:border-primary/50 transition-all active:scale-95 active:cursor-grabbing"
    >
      <GripVertical className="w-4 h-4 text-zinc-600" />
      <div>
        <h3 className="font-semibold text-sm truncate">
          {team.name || "Без названия"}
        </h3>
        <ul className="mt-2 space-y-2">
          {team.members.map((member) => (
            <li className="flex items-center gap-2">
              <UserInfoBlock size="small" {...member.profile} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DraggableTeam;
