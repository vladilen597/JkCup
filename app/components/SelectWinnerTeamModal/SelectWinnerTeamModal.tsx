import SelectTeamList from "./SelectTeamList/SelectTeamList";
import { ITeam, selectWinnerTeam } from "@/app/utils/store/tournamentsSlice";
import { Trophy } from "lucide-react";
import { useState } from "react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/app/utils/store/hooks";

interface ISelectWinnerTeamModalProps {
  teams: ITeam[];
  onClose: () => void;
}

const SelectWinnerTeamModal = ({
  teams,
  onClose,
}: ISelectWinnerTeamModalProps) => {
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const { id: tournamentId }: { id: string } = useParams();
  const dispatch = useAppDispatch();

  const handleSubmitTeamWinner = async () => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      await updateDoc(tournamentRef, {
        winner_team: selectedTeam,
        status: "finished",
      });
      if (selectedTeam) {
        dispatch(
          selectWinnerTeam({ tournamentId: tournamentId, team: selectedTeam }),
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
        <SelectTeamList
          teams={teams}
          selectedTeam={selectedTeam}
          onTeamClick={setSelectedTeam}
        />
      </section>
      <div className="flex items-center gap-2 justify-end mt-2 ">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          buttonType={selectedTeam ? BUTTON_TYPES.DEFAULT : BUTTON_TYPES.CANCEL}
          label="Выбрать победителя"
          onClick={handleSubmitTeamWinner}
        />
      </div>
    </>
  );
};

export default SelectWinnerTeamModal;
