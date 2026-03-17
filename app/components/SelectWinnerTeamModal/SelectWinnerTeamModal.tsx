import SelectTeamList from "./SelectTeamList/SelectTeamList";
import { selectWinnerTeam } from "@/app/utils/store/tournamentsSlice";
import { Trophy } from "lucide-react";
import { useState } from "react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/app/utils/store/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import { ITeam } from "@/app/lib/types";

interface ISelectWinnerTeamModalProps {
  teams: ITeam[];
  onClose: () => void;
}

const SelectWinnerTeamModal = ({
  teams,
  onClose,
}: ISelectWinnerTeamModalProps) => {
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const { id: tournamentId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmitTeamWinner = async () => {
    if (!selectedTeam || !tournamentId) return;

    setIsLoading(true);
    try {
      await axios.put(
        `/api/tournaments`,
        {
          status: "finished",
          winner_team_id: selectedTeam.id,
        },
        {
          params: { id: tournamentId },
        },
      );

      dispatch(
        selectWinnerTeam({
          tournamentId: tournamentId,
          team: selectedTeam,
        }),
      );

      toast.success(`Команда ${selectedTeam.name} — победитель!`);
      onClose();
    } catch (error: any) {
      console.error("Winner selection error:", error);
      toast.error(
        error.response?.data?.error || "Не удалось выбрать победителя",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        Выбрать команду-победителя
      </h3>
      <section className="mt-4 max-h-[400px] overflow-y-auto">
        <SelectTeamList
          teams={teams}
          selectedTeam={selectedTeam}
          onTeamClick={setSelectedTeam}
        />
      </section>
      <div className="flex items-center gap-2 justify-end mt-4">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          disabled={!selectedTeam || isLoading}
          buttonType={selectedTeam ? BUTTON_TYPES.DEFAULT : BUTTON_TYPES.CANCEL}
          label="Выбрать победителя"
          isLoading={isLoading}
          onClick={handleSubmitTeamWinner}
        />
      </div>
    </>
  );
};

export default SelectWinnerTeamModal;
