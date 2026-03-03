"use client";

import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import { IUser } from "@/app/utils/store/userSlice";
import { useEffect, useState } from "react";
import UserLine from "./UserLine/UserLine";
import { Users } from "lucide-react";

interface UserListProps {
  showRoles?: boolean;
  usersIds: string[];
  emptyMessage?: string;
  hideDelete?: boolean;
  handleClickDelete?: (userId: any) => void;
}

const UserList = ({
  showRoles,
  usersIds,
  emptyMessage = "Пока нет участников",
  hideDelete,
  handleClickDelete,
}: UserListProps) => {
  const [users, setUsers] = useState<IUser[]>([]);

  const handleLoadUsersArray = async () => {
    try {
      const users: IUser[] = await handleGetUsersByIds(usersIds);
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (usersIds.length) {
      handleLoadUsersArray();
    }
  }, [usersIds]);

  if (usersIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {users.map((user, i) => (
        <UserLine
          key={user.uid}
          {...user}
          index={i}
          showRoles={showRoles}
          hideDelete={hideDelete}
          onDeleteClick={() => {
            if (handleClickDelete) {
              handleClickDelete(user.uid);
            } else undefined;
          }}
        />
      ))}
    </ul>
  );
};

export default UserList;
