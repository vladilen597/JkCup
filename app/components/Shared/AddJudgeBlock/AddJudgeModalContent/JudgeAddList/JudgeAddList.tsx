import JudgeAddItem from "./JudgeAddItem/JudgeAddItem";
import { IUser } from "@/app/utils/store/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";

interface IJudgeAddListProps {
  occupiedUserIds: Set<string>;
  handleClose: () => void;
}

const JudgeAddList = ({ occupiedUserIds, handleClose }: IJudgeAddListProps) => {
  const [users, setUsers] = useState<IUser[]>([]);

  const handleLoadUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");

      const filteredUsers = data.users.filter(
        (user: IUser) => !occupiedUserIds.has(user.uid),
      );
      setUsers(filteredUsers);
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
        <h3 className="text-xl font-bold">Добавить судью</h3>
      </div>

      <ul className="flex flex-col gap-2 max-h-75 overflow-y-auto">
        {users.map((user, index) => {
          return (
            <JudgeAddItem user={user} index={index} onClose={handleClose} />
          );
        })}
      </ul>
    </>
  );
};

export default JudgeAddList;
