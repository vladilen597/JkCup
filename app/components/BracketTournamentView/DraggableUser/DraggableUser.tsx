import { IUser } from "@/app/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";

const DraggableUser = ({ user }: { user: IUser }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: user.id,
    data: { ...user, type: "player" },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 bg-zinc-800/80 border border-zinc-700 rounded-lg cursor-grab hover:border-primary/50 transition-all active:scale-95 active:cursor-grabbing"
    >
      <GripVertical className="w-4 h-4 text-zinc-600" />
      <UserInfoBlock {...user} />
    </div>
  );
};

export default DraggableUser;
