import { IUser } from "@/app/utils/store/userSlice";
import UserAddItem from "./UserAddItem/UserAddItem";
import { useEffect, useState } from "react";
import axios from "axios";

interface IUserAddListProps {
  teamId: string;
  handleClose: () => void;
}

const UserAddList = ({ teamId, handleClose }: IUserAddListProps) => {
  const [users, setUsers] = useState<IUser[]>([]);

  const handleLoadUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleLoadUsers();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-bold">Добавить сокомандника</h3>
      </div>

      <ul className="flex flex-col gap-2 max-h-75 overflow-y-auto">
        {users.map((user, index) => {
          return (
            <UserAddItem
              user={user}
              index={index}
              teamId={teamId}
              onClose={handleClose}
            />
          );
        })}
      </ul>
    </>
  );
};

export default UserAddList;
