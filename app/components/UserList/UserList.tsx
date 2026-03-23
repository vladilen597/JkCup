"use client";

import UserLine from "./UserLine/UserLine";
import { Users } from "lucide-react";
import { IArchivedParticipant, ITournamentRegistration } from "@/app/lib/types";

interface UserListProps {
  showRoles?: boolean;
  registrations: ITournamentRegistration[] | IArchivedParticipant[];
  emptyMessage?: string;
  hideDelete?: boolean;
  handleClickDelete?: (userId: any) => void;
}

const UserList = ({
  showRoles,
  registrations,
  emptyMessage = "Пока нет участников",
  hideDelete,
  handleClickDelete,
}: UserListProps) => {
  if (registrations?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {registrations?.map((registration, i) => (
        <UserLine
          key={registration.profile.id}
          {...registration.profile}
          index={i}
          showRoles={showRoles}
          hideDelete={hideDelete}
          onDeleteClick={() => {
            if (handleClickDelete) {
              handleClickDelete(registration.id);
            } else undefined;
          }}
        />
      ))}
    </ul>
  );
};

export default UserList;
