import UserInfoBlock from "@/app/components/Shared/UserInfoBlock/UserInfoBlock";
import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import { IUser } from "@/app/utils/store/userSlice";
import { useEffect, useState } from "react";

type Props = {};

const SelectTeamUserList = ({ usersIds }: { usersIds: string[] }) => {
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
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.uid}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <UserInfoBlock {...user} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SelectTeamUserList;
