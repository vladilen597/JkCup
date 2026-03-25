import JudgeAddItem from "./JudgeAddItem/JudgeAddItem";
import { useEffect, useState } from "react";
import axios from "axios";
import UserShimmer from "@/app/components/UserShimmer/UserShimmer";
import { IUser } from "@/app/lib/types";
import CustomButton, { BUTTON_TYPES } from "../../../CustomButton/CustomButton";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { setJudges } from "@/app/utils/store/tournamentsSlice";

interface IJudgeAddListProps {
  occupiedUserIds: Set<string>;
  handleClose: () => void;
}

const JudgeAddList = ({ occupiedUserIds, handleClose }: IJudgeAddListProps) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const { id }: { id: string } = useParams();

  const handleLoadUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/users");

      const filteredUsers = data.filter(
        (user: IUser) => !occupiedUserIds.has(user.id) && user.role !== "guest",
      );
      setUsers(filteredUsers);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onUserClick = (userId: string) => {
    if (selectedUsersIds.includes(userId)) {
      const updatedUsersIds = selectedUsersIds.filter(
        (selectedUserId) => selectedUserId !== userId,
      );
      setSelectedUsersIds(updatedUsersIds);
    } else {
      setSelectedUsersIds((prevState) => [...prevState, userId]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/tournaments/${id}/judges`, {
        profileIds: selectedUsersIds,
      });

      dispatch(setJudges({ tournamentId: id, judges: data }));

      toast.success(`Добавлено судей: ${selectedUsersIds.length}`);
      handleClose();
    } catch (err) {
      console.error("Ошибка при добавлении судьи", err);
    } finally {
      setIsSubmitting(false);
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
        <UserShimmer amount={5} />
      ) : (
        <ul className="flex flex-col gap-2 max-h-175 overflow-y-auto">
          {users.map((user, index) => {
            return (
              <JudgeAddItem
                key={user.id}
                user={user}
                index={index}
                onClose={handleClose}
                isSelected={selectedUsersIds.includes(user.id)}
                onClick={() => onUserClick(user.id)}
              />
            );
          })}
        </ul>
      )}
      <div className="mt-2 flex gap-2 w-fit ml-auto mr-0">
        <CustomButton
          buttonType={BUTTON_TYPES.CANCEL}
          label="Отмена"
          onClick={handleClose}
        />
        <CustomButton
          label="Добавить"
          disabled={isLoading}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default JudgeAddList;
