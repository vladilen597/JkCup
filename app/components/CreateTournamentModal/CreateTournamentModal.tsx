import { motion } from "motion/react";
import { SubmitEvent } from "react";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";

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
    players_per_team: number;
    start_date: string;
  };
  handleChange: (value: any) => void;
  handleChangeTournamentType: (value: ISelectOption) => void;
  onClose: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

const CreateTournamentModal = ({
  formData,
  handleChange,
  handleChangeTournamentType,
  onClose,
  onSubmit,
}: ICreateTournamentModalProps) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 p-6 bg-card rounded-xl border border-border/50"
      onSubmit={onSubmit}
    >
      <h3 className="text-xl font-bold mb-4">Новый турнир</h3>

      <div className="space-y-2">
        <div>
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

        <div>
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
            triggerClassName="pr-2 text-sm! text-left py-2"
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
            value={formData.max_players}
            onChange={(e) =>
              handleChange({
                ...formData,
                max_players: Number(e.target.value),
              })
            }
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
              min="1"
              required
            />
          </div>
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
