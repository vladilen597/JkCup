import { useAppSelector } from "@/app/utils/store/hooks";
import Image from "next/image";
import Discord from "../../Icons/Discord";
import Steam from "../../Icons/Steam";
import { MouseEvent } from "react";
import { IUser } from "@/app/lib/types";

const UserInfoBlock = ({
  id,
  image_url,
  full_name,
  discord,
  steam_link,
  steam_display_name,
}: Partial<IUser>) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const isCurrentUser = currentUser.id === id;

  const handleClickSteamLink = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {image_url ? (
        <Image
          unoptimized
          width={40}
          height={40}
          src={image_url}
          alt={full_name || ""}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20">
          {full_name?.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div>
          <p className="font-semibold text-foreground truncate leading-5 text-sm">
            {full_name}
            {isCurrentUser && (
              <span className="ml-2 text-xs leading-0 text-orange-400">Вы</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            {discord && (
              <p className="flex shrink-0 items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                <Discord className="w-4 h-4" /> {discord}
              </p>
            )}
            {!!steam_link && !!steam_display_name && (
              <p className="flex shrink-0 items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400 hover:text-white transition-colors">
                <Steam className="w-4 h-4" />{" "}
                <a
                  onClick={handleClickSteamLink}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={steam_link}
                >
                  {steam_display_name}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoBlock;
