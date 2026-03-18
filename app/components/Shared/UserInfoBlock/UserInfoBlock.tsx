import { useAppSelector } from "@/app/utils/store/hooks";
import Image from "next/image";
import Discord from "../../Icons/Discord";
import Steam from "../../Icons/Steam";
import { MouseEvent } from "react";
import { IUser } from "@/app/lib/types";
import { cn } from "@/lib/utils";

const UserInfoBlock = ({
  id,
  image_url,
  full_name,
  discord,
  steam_link,
  steam_display_name,
  size = "default",
}: Partial<IUser> & { size?: "small" | "default" }) => {
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
          width={size === "default" ? 40 : 20}
          height={size === "default" ? 40 : 20}
          src={image_url}
          alt={full_name || ""}
          className={cn(
            "rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all",
            size === "default" && "w-10 h-10",
            size === "small" && "w-7 h-7",
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20",
            size === "default" && "w-10 h-10",
            size === "small" && "w-7 h-7 text-xs",
          )}
        >
          {full_name?.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div>
          <p
            className={cn(
              "font-semibold text-foreground truncate leading-5 text-sm",
              size === "default" && "text-sm",
              size === "small" && "text-xs",
            )}
          >
            {full_name}
            {isCurrentUser && (
              <span className="ml-2 text-xs leading-0 text-orange-400">Вы</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            {discord && (
              <p className="flex shrink-0 items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                <Discord
                  className={cn(
                    "w-4 h-4",
                    size === "default" && "w-4 h-4",
                    size === "small" && "w-3 h-3",
                  )}
                />
                {discord}
              </p>
            )}
            {!!steam_link && !!steam_display_name && (
              <p className="flex shrink-0 items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400 hover:text-white transition-colors">
                <Steam
                  className={cn(
                    "w-4 h-4",
                    size === "default" && "w-4 h-4",
                    size === "small" && "w-3 h-3",
                  )}
                />
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
