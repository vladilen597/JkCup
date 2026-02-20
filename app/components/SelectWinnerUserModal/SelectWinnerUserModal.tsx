import { selectWinnerUser } from "@/app/utils/store/tournamentsSlice";
import SelectUserList from "./SelectUserList/SelectUserList";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { IUser } from "@/app/utils/store/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { useParams } from "next/navigation";
import { db } from "@/app/utils/firebase";
import { Trophy } from "lucide-react";
import { useState } from "react";

interface ISelectWinnerUserModalProps {
  users: IUser[];
  onClose: () => void;
}

const SelectWinnerUserModal = ({
  users,
  onClose,
}: ISelectWinnerUserModalProps) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { id: tournamentId }: { id: string } = useParams();
  const dispatch = useAppDispatch();

  const handleSubmitUserWinner = async () => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      await updateDoc(tournamentRef, {
        winner_user: selectedUser,
        status: "finished",
      });
      if (selectedUser) {
        dispatch(
          selectWinnerUser({ tournamentId: tournamentId, user: selectedUser }),
        );
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Выбрать победителя
      </h3>
      <section className="mt-4">
        <SelectUserList
          users={users}
          selectedUser={selectedUser}
          onUserClick={setSelectedUser}
        />
      </section>
      <div className="flex items-center gap-2 justify-end mt-2 ">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          buttonType={selectedUser ? BUTTON_TYPES.DEFAULT : BUTTON_TYPES.CANCEL}
          label="Выбрать победителя"
          onClick={handleSubmitUserWinner}
        />
      </div>
    </>
  );
};

export default SelectWinnerUserModal;
