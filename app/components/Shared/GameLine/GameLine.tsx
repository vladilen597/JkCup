import { IGame } from "@/app/lib/types";
import { useAppSelector } from "@/app/utils/store/hooks";
import { X } from "lucide-react";
import Image from "next/image";

const GameLine = ({
  image_url,
  name,
  onDeleteClick,
}: IGame & { onDeleteClick: () => void }) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  return (
    <div className="bg-muted/40 border border-border/50 rounded-lg p-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          className="rounded h-10 w-10 object-cover"
          src={image_url}
          width={40}
          height={40}
          alt="Game image"
        />
        <span className="">{name}</span>
      </div>
      {currentUser.role === "superadmin" && (
        <button
          className="rounded-full p-1 hover:bg-background/60 hover:text-white! group transition-colors cursor-pointer"
          type="button"
          onClick={onDeleteClick}
        >
          <X className="text-neutral-500 group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
};

export default GameLine;
