import { useAppSelector } from "@/app/utils/store/hooks";
import { IUser } from "@/app/utils/store/userSlice";
import Image from "next/image";
import Discord from "../../Icons/Discord";
import Steam from "../../Icons/Steam";
import Link from "next/link";
import { MouseEvent } from "react";

const UserInfoBlock = ({
  uid,
  photoUrl,
  displayName,
  discord,
  steamLink,
  steamDisplayName,
}: Partial<IUser>) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const isCurrentUser = currentUser.uid === uid;

  const handleClickSteamLink = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {photoUrl ? (
        <Image
          unoptimized
          width={40}
          height={40}
          src={photoUrl}
          alt={displayName || ""}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20">
          {displayName?.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div>
          <p className="font-semibold text-foreground truncate leading-5 text-sm">
            {displayName}
            {isCurrentUser && (
              <span className="ml-2 text-xs leading-0 text-orange-400">Вы</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            {discord && (
              <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                <Discord className="w-4 h-4" /> {discord}
              </p>
            )}
            {!!steamLink && !!steamDisplayName && (
              <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400 hover:text-white transition-colors">
                <Steam className="w-4 h-4" />{" "}
                <Link
                  onClick={handleClickSteamLink}
                  className="underline"
                  href={steamLink}
                >
                  {steamDisplayName}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoBlock;
