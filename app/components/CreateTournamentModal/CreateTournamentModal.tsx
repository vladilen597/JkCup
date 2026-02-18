import { useDurationInput } from "react-duration-input";
import { motion } from "motion/react";
import { SubmitEvent } from "react";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";
import { X, Plus, Clock, Users } from "lucide-react";

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
    duration: number;
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
  const inputProps = useDurationInput({
    timeInMilliseconds: formData.duration,
    isMilliseconds: false,
    onTimeUpdate: (value) =>
      handleChange((prevState: any) => {
        return {
          ...prevState,
          duration: value,
        };
      }),
  });

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

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                handleChange({ ...formData, name: e.target.value })
              }
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="w-full p-2.5 rounded-lg bg-muted border border-border min-h-25 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-2">
          <span className="text-sm font-medium">Тип турнира</span>
          <CustomSelect
            containerClassName="mt-1 border-2 border-border text-lg rounded-lg bg-muted"
            triggerClassName="pl-2 text-sm! text-left py-2 text-left justify-start"
            options={selectTypeOptions}
            value={formData.type}
            onChange={handleChangeTournamentType}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full">
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Users className="w-4 h-4" /> Макс.{" "}
              {formData.type.value === "team" ? "команд" : "игроков"}
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
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              min="2"
              required
            />
          </div>
          {formData.type.value === "team" && (
            <div className="w-full">
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
                className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                min="2"
                required
              />
            </div>
          )}
        </div>
        <div>
          <label className="flex gap-2 items-center text-sm font-medium mb-1">
            <Clock className="w-4 h-4" /> Продолжительность
          </label>
          <input
            {...inputProps}
            onTimeUpdate={(value) => console.log(value)}
            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Награды</label>
            {canAddMoreRewards && (
              <button
                type="button"
                onClick={handleAddReward}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить награду
              </button>
            )}
          </div>

          {formData.rewards.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Награды не добавлены
            </p>
          ) : (
            <div className="space-y-3">
              {formData.rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="relative group"
                >
                  <label className="block text-xs text-muted-foreground mb-1">
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
                      placeholder="Введите награду"
                      className="w-full p-2.5 pr-10 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      className="absolute right-2.5 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                      type="button"
                      onClick={() =>
                        handleChange((prevState: any) => ({
                          ...prevState,
                          rewards: prevState.rewards.filter(
                            (r: { id: string; value: string }) =>
                              r.id !== reward.id,
                          ),
                        }))
                      }
                      disabled={formData.rewards.length <= 1}
                    >
                      <X
                        className={`w-4 h-4 ${formData.rewards.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дата начала</label>
          <input
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) =>
              handleChange({ ...formData, start_date: e.target.value })
            }
            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Создать
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          Отмена
        </button>
      </div>
    </motion.form>
  );
};

export default CreateTournamentModal;
