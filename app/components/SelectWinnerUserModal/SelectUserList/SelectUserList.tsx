import { useAppSelector } from "@/app/utils/store/hooks";
import Discord from "../../Icons/Discord";
import { SetStateAction } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IUser } from "@/app/lib/types";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";

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
  const { currentUser } = useAppSelector((state) => state.user);

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
            "flex items-center gap-2 border rounded-lg p-4 cursor-pointer",
            selectedUser?.id === user.id && "border-neon!",
          )}
          key={user.id}
          onClick={() => onUserClick(user)}
        >
          <UserInfoBlock {...user} />
        </li>
      ))}
    </ul>
  );
};

export default SelectUserList;
