import { motion } from "motion/react";
import { SubmitEvent } from "react";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";
import { Cross, X } from "lucide-react";

export const selectTypeOptions = [
  {
    id: 1,
    value: "team",
    label: "Командный",
  },
  {
    id: 2,
    value: "single",
    label: "Одиночный",
  },
];

interface ICreateTournamentModalProps {
  formData: {
    name: string;
    game: string;
    type: ISelectOption;
    description: string;
    max_players: number;
    max_teams: number;
    players_per_team: number;
    start_date: string;
    rewards: { id: string; value: string }[];
  };
  handleChange: (value: any) => void;
  handleChangeTournamentType: (value: ISelectOption) => void;
  handleAddReward: () => void;
  onClose: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

const CreateTournamentModal = ({
  formData,
  handleChange,
  handleChangeTournamentType,
  onClose,
  handleAddReward,
  onSubmit,
}: ICreateTournamentModalProps) => {
  const canAddMoreRewards =
    formData.type.value === "team"
      ? formData.max_teams > formData.rewards.length
      : formData.max_players > formData.rewards.length;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 p-6 bg-card rounded-xl border border-border/50"
      onSubmit={onSubmit}
    >
      <h3 className="text-xl font-bold mb-4">Новый турнир</h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                handleChange({ ...formData, name: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Игра</label>
            <input
              type="text"
              value={formData.game}
              onChange={(e) =>
                handleChange({ ...formData, game: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              handleChange({ ...formData, description: e.target.value })
            }
            className="w-full p-2 rounded-lg bg-muted border border-border min-h-25"
          />
        </div>

        <div className="col-span-2">
          <span className="text-sm font-medium">Тип турнира</span>
          <CustomSelect
            containerClassName="mt-1  border-2 border-border text-lg rounded-lg bg-muted"
            triggerClassName="pl-2 text-sm! text-left py-2 text-left justify-start"
            options={selectTypeOptions}
            value={formData.type}
            onChange={handleChangeTournamentType}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Макс. {formData.type.value === "team" ? "команд" : "игроков"}
          </label>
          <input
            type="number"
            value={
              formData.type.value === "team"
                ? formData.max_teams
                : formData.max_players
            }
            onChange={(e) => {
              handleChange({
                ...formData,
                ...(formData.type.value === "team"
                  ? { max_teams: Number(e.target.value), rewards: [] }
                  : { max_players: Number(e.target.value), rewards: [] }),
              });
            }}
            className="w-full p-2 rounded-lg bg-muted border border-border"
            min="2"
            required
          />
        </div>

        {formData.type.value === "team" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Игроков в команде
            </label>
            <input
              type="number"
              value={formData.players_per_team}
              onChange={(e) =>
                handleChange({
                  ...formData,
                  players_per_team: Number(e.target.value),
                })
              }
              className="w-full p-2 rounded-lg bg-muted border border-border"
              min="2"
              required
            />
          </div>
        )}

        {formData.rewards.map((reward, index) => {
          return (
            <div key={reward.id}>
              <label className="block text-sm font-medium mb-1">
                Награда за {index + 1} место
              </label>
              <div className="flex items-center w-full relative">
                <input
                  type="text"
                  required
                  value={reward.value}
                  onChange={(e) =>
                    handleChange((prevState: any) => ({
                      ...prevState,
                      rewards: prevState.rewards.map(
                        (r: { id: string; value: string }, i: number) =>
                          i === index ? { ...r, value: e.target.value } : r,
                      ),
                    }))
                  }
                  className="w-full p-2 rounded-lg bg-muted border border-border"
                />
                <button
                  className="absolute right-2 cursor-pointer"
                  type="button"
                  onClick={() =>
                    handleChange((prevState: any) => ({
                      ...prevState,
                      rewards: prevState.rewards.filter(
                        (r: { id: string; value: string }, i: number) => {
                          return r.id !== reward.id;
                        },
                      ),
                    }))
                  }
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {canAddMoreRewards && (
          <button
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            type="button"
            onClick={handleAddReward}
          >
            Добавить награду за {formData.rewards.length + 1} место
          </button>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Дата начала</label>
          <input
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) =>
              handleChange({ ...formData, start_date: e.target.value })
            }
            className="w-full p-2 rounded-lg bg-muted border border-border"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Создать
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
        >
          Отмена
        </button>
      </div>
    </motion.form>
  );
};

export default CreateTournamentModal;
