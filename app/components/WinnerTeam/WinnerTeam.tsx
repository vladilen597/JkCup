import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import { IUser } from "@/app/utils/store/userSlice";
import React, { useEffect, useState } from "react";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";

type Props = {};

const WinnerTeam = ({ usersIds }: { usersIds: string[] }) => {
  const [users, setUsers] = useState<IUser[]>([]);

  const handleLoadUsers = async () => {
    try {
      const users = await handleGetUsersByIds(usersIds);
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleLoadUsers();
  }, []);

  return (
    <ul className="mt-2">
      {users.map((user) => (
        <li key={user.uid} className="flex items-center gap-2">
          <UserInfoBlock {...user} />
        </li>
      ))}
    </ul>
  );
};

export default WinnerTeam;
