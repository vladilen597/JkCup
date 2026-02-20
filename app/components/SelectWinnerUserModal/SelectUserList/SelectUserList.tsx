import { useAppSelector } from "@/app/utils/store/hooks";
import Discord from "../../Icons/Discord";
import { SetStateAction } from "react";
import Image from "next/image";
import { IUser } from "@/app/utils/store/userSlice";
import { cn } from "@/lib/utils";

interface ISelectUserListProps {
  users: IUser[];
  selectedUser: IUser | null;
  onUserClick: (user: SetStateAction<IUser | null>) => void;
}

const SelectUserList = ({
  users = [],
  selectedUser,
  onUserClick,
}: ISelectUserListProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  if (users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Пользователей нет
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li
          className={cn(
            "border rounded-lg p-4 cursor-pointer",
            selectedUser?.uid === user.uid && "outline-2 outline-neon",
          )}
          key={user.uid}
          onClick={() => onUserClick(user)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              {user.photoUrl ? (
                <Image
                  width={40}
                  height={40}
                  src={user.photoUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  {user.displayName?.[0] || "?"}
                </div>
              )}
              <div>
                <div>
                  <span className="truncate">{user.displayName}</span>
                  {currentUser.uid === user.uid && (
                    <span className="ml-2 text-xs text-orange-400">Вы</span>
                  )}
                </div>
                {user.discord && (
                  <p className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                    <Discord className="w-4 h-4" /> {user.discord}
                  </p>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SelectUserList;
