import { useState } from "react";
import { useParams } from "next/navigation";
import { Trophy, Medal, Users } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { selectWinnerTeam } from "@/app/utils/store/tournamentsSlice";
import { IArchivedTeam, ITeam, ITournamentWinner } from "@/app/lib/types";
import SelectTeamList from "./SelectTeamList/SelectTeamList";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";

interface IReward {
  id: string;
  value: string;
}

interface ISelectWinnerTeamModalProps {
  teams: ITeam[] | IArchivedTeam[];
  availableRewards: IReward[];
  onClose: () => void;
}

interface ITeamsDistribution {
  [rewardId: string]: ITeam | IArchivedTeam | null;
}

const SelectWinnerTeamModal = ({
  teams = [],
  availableRewards = [],
  onClose,
}: ISelectWinnerTeamModalProps) => {
  const { id } = useParams<{ id: string }>();
  const tournamentId = Array.isArray(id) ? id : id;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [distribution, setDistribution] = useState<ITeamsDistribution>(() => {
    const initial: ITeamsDistribution = {};
    availableRewards.forEach((r) => {
      initial[r.id] = null;
    });
    return initial;
  });

  const [activeRewardId, setActiveRewardId] = useState<string | null>(
    availableRewards[0]?.id || null,
  );

  const handleTeamSelect = (team: ITeam | IArchivedTeam | null) => {
    if (!activeRewardId) {
      toast.warn("Сначала выберите призовое место сверху");
      return;
    }
    setDistribution((prev) => ({
      ...prev,
      [activeRewardId]: team,
    }));
  };

  const handleClearPlace = (rewardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDistribution((prev) => ({
      ...prev,
      [rewardId]: null,
    }));
  };

  const handleSubmitTeamWinners = async () => {
    setIsLoading(true);

    const finalWinnersArray = availableRewards
      .map((reward) => ({
        reward_id: reward.id,
        reward_value: reward.value,
        team: distribution[reward.id]
          ? {
              id: distribution[reward.id]!.id,
              name: distribution[reward.id]!.name,
              members: (distribution[reward.id] as any).members || [],
            }
          : null,
      }))
      .filter((item) => item.team !== null);

    if (finalWinnersArray.length === 0) {
      toast.error("Выберите победителя хотя бы для одного места");
      setIsLoading(false);
      return;
    }

    try {
      const { data: updatedTournament } = await axios.patch(
        `/api/tournaments/${tournamentId}/winner`,
        {
          type: "team",
          winners: finalWinnersArray,
        },
      );

      dispatch(
        selectWinnerTeam({
          tournamentId: tournamentId,
          winners: updatedTournament.winner_users as ITournamentWinner[],
        }),
      );

      toast.success("Призовые места успешно распределены среди команд!");
      onClose();
    } catch (error: any) {
      console.error("Winner selection error:", error);
      toast.error(
        error.response?.data?.error || "Не удалось сохранить победителей",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        Распределение мест между командами
      </h3>

      <section className="mt-4">
        <p className="text-sm text-zinc-400 mb-2">
          1. Выберите призовое место для назначения:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {availableRewards.map((reward, index) => {
            const isSelected = activeRewardId === reward.id;
            const assignedTeam = distribution[reward.id];

            return (
              <div
                key={reward.id}
                onClick={() => setActiveRewardId(reward.id)}
                className={`relative flex flex-col p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "border-neon bg-neon/10 text-white"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold tracking-wider text-zinc-500">
                    {index + 1} Место
                  </span>
                  <Medal
                    className={`h-4 w-4 ${
                      index === 0
                        ? "text-amber-400"
                        : index === 1
                          ? "text-zinc-300"
                          : "text-amber-700"
                    }`}
                  />
                </div>
                <div className="text-lg font-bold mt-1 text-white">
                  {reward.value}
                </div>

                <div className="mt-2 text-xs truncate min-h-[1.25rem]">
                  {assignedTeam ? (
                    <div className="flex items-center justify-between bg-zinc-800/80 px-2 py-1 rounded border border-zinc-700">
                      <span className="text-white font-bold text-md truncate max-w-[80%]">
                        {assignedTeam.name || `Team ${assignedTeam.id}`}
                      </span>
                      <button
                        onClick={(e) => handleClearPlace(reward.id, e)}
                        className="text-zinc-500 hover:text-rose-400 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-600 italic">Не назначена</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 max-h-60 overflow-y-auto border-t border-zinc-800 pt-4">
        {activeRewardId && (
          <p className="text-sm text-zinc-400 mb-2 flex items-center gap-1.5">
            2. Назначить команду на выбранное место (Кликните по команде):
          </p>
        )}
        <SelectTeamList
          teams={teams}
          selectedTeam={activeRewardId ? distribution[activeRewardId] : null}
          onTeamClick={handleTeamSelect}
        />
      </section>

      <div className="flex items-center gap-2 justify-end mt-6 border-t border-zinc-800 pt-4">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          disabled={isLoading}
          buttonType={BUTTON_TYPES.DEFAULT}
          label="Сохранить результаты"
          isLoading={isLoading}
          onClick={handleSubmitTeamWinners}
        />
      </div>
    </>
  );
};

export default SelectWinnerTeamModal;
