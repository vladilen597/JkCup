"use client";

import UserLine from "./UserLine/UserLine";
import { Users } from "lucide-react";
import { IArchivedParticipant, ITournamentRegistration } from "@/app/lib/types";
import EmptyListPlaceholder from "../Shared/EmptyListPlaceholder/EmptyListPlaceholder";

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
  hideDelete,
  handleClickDelete,
}: UserListProps) => {
  if (registrations?.length === 0) {
    return (
      <EmptyListPlaceholder
        icon={<Users className="h-10 w-10" />}
        text="Участников пока нет"
      />
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
