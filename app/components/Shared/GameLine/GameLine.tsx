import { IGame } from "@/app/lib/types";
import { useAppSelector } from "@/app/utils/store/hooks";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";

const GameLine = ({
  image_url,
  name,
  onDeleteClick,
}: IGame & { onDeleteClick: () => void }) => {
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700">
      <Image
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        src={image_url}
        fill
        alt={name}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="block truncate text-sm font-bold text-white drop-shadow-md">
          {name}
        </span>
      </div>

      {currentUser.role === "superadmin" && (
        <button
          className="cursor-pointer absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-zinc-400 backdrop-blur-md transition-all hover:bg-red-500 hover:text-white"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default GameLine;
