import { Users } from "lucide-react";
import UserLine from "./UserLine/UserLine";

interface UserListProps {
  users: any[];
  emptyMessage?: string;
}

const UserList = ({
  users,
  emptyMessage = "Пока нет участников",
}: UserListProps) => {
  if (users.length === 0) {
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
        <UserLine key={user.id} {...user} index={i} />
      ))}
    </ul>
  );
};

export default UserList;
