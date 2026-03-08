import { IGame } from "@/app/utils/store/gamesSlice";
import { useAppSelector } from "@/app/utils/store/hooks";
import { X } from "lucide-react";
import Image from "next/image";

const GameLine = ({
  image,
  name,
  onDeleteClick,
}: IGame & { onDeleteClick: () => void }) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  return (
    <div className="bg-muted/40 border border-border/50 rounded-lg p-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          className="rounded h-10 w-10 object-cover"
          src={image}
          width={40}
          height={40}
          alt="Game image"
        />
        <span className="">{name}</span>
      </div>
      {(currentUser.role === "admin" || currentUser.role === "superadmin") && (
        <button
          className="text-neutral-500"
          type="button"
          onClick={onDeleteClick}
        >
          <X />
        </button>
      )}
    </div>
  );
};

export default GameLine;
