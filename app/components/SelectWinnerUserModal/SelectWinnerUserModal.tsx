import SelectUserList from "./SelectUserList/SelectUserList";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { IUser } from "@/app/lib/types";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { useParams } from "next/navigation";
import { Trophy, Medal, UserCheck } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { selectWinnerUser } from "@/app/utils/store/tournamentsSlice";

interface IReward {
  id: string;
  value: string;
}

interface ISelectWinnerUserModalProps {
  registrations: any[];
  availableRewards: IReward[];
  onClose: () => void;
}

interface IWinnersDistribution {
  [rewardId: string]: IUser | null;
}

const SelectWinnerUserModal = ({
  registrations,
  availableRewards = [],
  onClose,
}: ISelectWinnerUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [distribution, setDistribution] = useState<IWinnersDistribution>(() => {
    const initial: IWinnersDistribution = {};
    availableRewards.forEach((r) => {
      initial[r.id] = null;
    });
    return initial;
  });

  const [activeRewardId, setActiveRewardId] = useState<string | null>(
    availableRewards[0]?.id || null,
  );

  const { id: tournamentId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const users = registrations.map((reg) => reg.profile).filter(Boolean);

  const handleUserSelect = (user: IUser) => {
    if (!activeRewardId) {
      toast.warn("Сначала выберите призовое место сверху");
      return;
    }

    setDistribution((prev) => ({
      ...prev,
      [activeRewardId]: user,
    }));
  };

  const handleClearPlace = (rewardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDistribution((prev) => ({
      ...prev,
      [rewardId]: null,
    }));
  };

  const handleSubmitWinners = async () => {
    setIsLoading(true);

    const finalWinners = availableRewards
      .map((reward) => ({
        reward_id: reward.id,
        reward_value: reward.value,
        user_id: distribution[reward.id]?.id || null,
      }))
      .filter((w) => w.user_id !== null);

    if (finalWinners.length === 0) {
      toast.error("Выберите победителя хотя бы для одного места");
      setIsLoading(false);
      return;
    }

    try {
      const { data: updatedTournament } = await axios.patch(
        `/api/tournaments/${tournamentId}/winner`,
        {
          type: "user",
          winners: finalWinners,
        },
      );

      dispatch(
        selectWinnerUser({
          tournamentId: tournamentId,
          winners: updatedTournament.winner_users,
        }),
      );

      toast.success("Призовые места успешно распределены!");
      onClose();
    } catch (error: any) {
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
        Распределение призовых мест
      </h3>

      <section className="mt-4">
        <p className="text-sm text-zinc-400 mb-2">
          1. Выберите призовое место для назначения:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {availableRewards.map((reward, index) => {
            const isSelected = activeRewardId === reward.id;
            const assignedUser = distribution[reward.id];

            return (
              <div
                key={reward.id}
                onClick={() => setActiveRewardId(reward.id)}
                className={`relative flex flex-col p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-neon/10 text-white"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold tracking-wider text-zinc-500">
                    {index + 1} Место
                  </span>
                  <Medal
                    className={`h-4 w-4 ${index === 0 ? "text-amber-400" : index === 1 ? "text-zinc-300" : "text-amber-700"}`}
                  />
                </div>
                <div className="text-lg font-bold mt-1 text-white">
                  {reward.value}
                </div>

                <div className="mt-2 text-xs truncate min-h-5">
                  {assignedUser ? (
                    <div className="flex items-center justify-between bg-zinc-800/80 px-2 py-1 rounded border border-zinc-700">
                      <span className="text-white truncate max-w-[80%]">
                        {assignedUser.full_name}
                      </span>
                      <button
                        onClick={(e) => handleClearPlace(reward.id, e)}
                        className="text-zinc-500 hover:text-rose-400 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-600 italic">Не назначен</span>
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
            2. Назначить игрока на выбранное место (Кликните по игроку):
          </p>
        )}
        <SelectUserList
          users={users}
          selectedUser={activeRewardId ? distribution[activeRewardId] : null}
          onUserClick={handleUserSelect}
        />
      </section>

      <div className="flex items-center gap-2 justify-end mt-6 border-t border-zinc-800 pt-4">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          isLoading={isLoading}
          buttonType={BUTTON_TYPES.DEFAULT}
          label="Сохранить результаты"
          onClick={handleSubmitWinners}
        />
      </div>
    </>
  );
};

export default SelectWinnerUserModal;
