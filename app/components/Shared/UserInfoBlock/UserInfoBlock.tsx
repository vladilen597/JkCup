import ExpandableSocialLink from "../ExpandableSocialLink/ExpandableSocialLink";
import { useAppSelector } from "@/app/utils/store/hooks";
import Discord from "../../Icons/Discord";
import { IUser } from "@/app/lib/types";
import Steam from "../../Icons/Steam";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const UserInfoBlock = ({
  id,
  image_url,
  full_name,
  discord_id,
  discord_full_name,
  steam_name,
  steam_profile_url,
  size = "default",
}: Partial<IUser> & { size?: "small" | "default" }) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const isCurrentUser = currentUser?.id === id;

  const handleClickSteamLink = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  const handleClickDiscordLink = (e: MouseEvent<HTMLAnchorElement>) => {
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
          <div className="flex items-center gap-1">
            {discord_full_name && (
              <ExpandableSocialLink
                href={`discord://-/users/${discord_id}`}
                label={discord_full_name}
                onClick={handleClickDiscordLink}
                size="small"
                icon={<Discord className="w-full h-full" />}
              />
            )}
            {!!steam_name && !!steam_profile_url && (
              <ExpandableSocialLink
                href={steam_profile_url}
                label={steam_name}
                onClick={handleClickSteamLink}
                size="small"
                icon={<Steam className="w-full h-full" />}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoBlock;
