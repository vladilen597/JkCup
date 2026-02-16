import { motion } from "motion/react";
import { Dispatch, SetStateAction, SubmitEvent } from "react";

interface ICreateTournamentModalProps {
  formData: {
    name: string;
    game: string;
    description: string;
    max_players: number;
    team_amount: number;
    start_date: string;
  };
  handleChange: (value: {
    name: string;
    game: string;
    description: string;
    max_players: number;
    team_amount: number;
    start_date: string;
  }) => void;
  onClose: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

const CreateTournamentModal = ({
  formData,
  handleChange,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              handleChange({ ...formData, description: e.target.value })
            }
            className="w-full p-2 rounded-lg bg-muted border border-border min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Макс. игроков
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

        <div>
          <label className="block text-sm font-medium mb-1">
            Командный (игроков в команде)
          </label>
          <input
            type="number"
            value={formData.team_amount}
            onChange={(e) =>
              handleChange({
                ...formData,
                team_amount: Number(e.target.value),
              })
            }
            className="w-full p-2 rounded-lg bg-muted border border-border"
            min="1"
            required
          />
        </div>

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
