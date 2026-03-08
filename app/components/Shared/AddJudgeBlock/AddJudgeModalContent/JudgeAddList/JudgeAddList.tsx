import JudgeAddItem from "./JudgeAddItem/JudgeAddItem";
import { IUser } from "@/app/utils/store/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import UserShimmer from "@/app/components/UserShimmer/UserShimmer";

interface IJudgeAddListProps {
  occupiedUserIds: Set<string>;
  handleClose: () => void;
}

const JudgeAddList = ({ occupiedUserIds, handleClose }: IJudgeAddListProps) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/users");

      const filteredUsers = data.users.filter(
        (user: IUser) =>
          !occupiedUserIds.has(user.uid) && user.role !== "guest",
      );
      setUsers(filteredUsers);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
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

      {isLoading ? (
        <UserShimmer />
      ) : (
        <ul className="flex flex-col gap-2 max-h-175 overflow-y-auto">
          {users.map((user, index) => {
            return (
              <JudgeAddItem
                key={user.uid}
                user={user}
                index={index}
                onClose={handleClose}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default JudgeAddList;
