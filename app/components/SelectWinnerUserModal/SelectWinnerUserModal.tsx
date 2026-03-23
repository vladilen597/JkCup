import { selectWinnerUser } from "@/app/utils/store/tournamentsSlice";
import SelectUserList from "./SelectUserList/SelectUserList";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { IUser } from "@/app/lib/types"; // Твой обновленный интерфейс
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { useParams } from "next/navigation";
import { Trophy } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ISelectWinnerUserModalProps {
  registrations: any[];
  onClose: () => void;
}

const SelectWinnerUserModal = ({
  registrations,
  onClose,
}: ISelectWinnerUserModalProps) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { id: tournamentId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const users = registrations.map((reg) => reg.profile).filter(Boolean);

  const handleSubmitUserWinner = async () => {
    if (!selectedUser) return;

    try {
      const { data: updatedTournament } = await axios.patch(
        `/api/tournaments/${tournamentId}/winner`,
        {
          winnerId: selectedUser.id,
          type: "user",
        },
      );

      dispatch(
        selectWinnerUser({
          tournamentId: tournamentId,
          user: updatedTournament.winner_user,
        }),
      );

      toast.success(`Победитель ${selectedUser.full_name} выбран!`);
      onClose();
    } catch (error: any) {
      toast.error("Не удалось сохранить победителя");
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        Выбрать победителя
      </h3>

      <section className="mt-4 max-h-100 overflow-y-auto">
        <SelectUserList
          users={users}
          selectedUser={selectedUser}
          onUserClick={setSelectedUser}
        />
      </section>

      <div className="flex items-center gap-2 justify-end mt-4">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          disabled={!selectedUser}
          buttonType={selectedUser ? BUTTON_TYPES.DEFAULT : BUTTON_TYPES.CANCEL}
          label="Подтвердить победу"
          onClick={handleSubmitUserWinner}
        />
      </div>
    </>
  );
};

export default SelectWinnerUserModal;
