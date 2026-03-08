import { useEffect, useState } from "react";
import TeamUserItem from "../TeamUserItem/TeamUserItem";
import { IUser } from "@/app/utils/store/userSlice";
import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import { useAppSelector } from "@/app/utils/store/hooks";
import { Loader2 } from "lucide-react";

const TeamUserList = ({
  usersIds,
  isCurrentUserCreator,
  isLoading,
  canLeave,
  onLeaveClick,
}: {
  usersIds: string[];
  isCurrentUserCreator: boolean;
  isLoading: boolean;
  canLeave: boolean;
  onLeaveClick: (userId: string) => void;
}) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { user: currentUser } = useAppSelector((state) => state.user);

  const isMyTeam = usersIds.includes(currentUser.uid);

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
  }, [usersIds]);

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <TeamUserItem
          key={user.uid}
          {...user}
          isMyTeam={isMyTeam}
          isLoading={isLoading}
          isCurrentUserCreator={isCurrentUserCreator}
          onLeaveClick={() => onLeaveClick(user.uid)}
          canLeave={canLeave}
        />
      ))}
    </ul>
  );
};

export default TeamUserList;
