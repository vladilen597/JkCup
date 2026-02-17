import { motion } from "motion/react";
import { Loader2, X } from "lucide-react";
import { ChangeEvent, SubmitEvent } from "react";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";
import { selectTypeOptions } from "../CreateTournamentModal/CreateTournamentModal";

interface IEditModalProps {
  name: string;
  description: string;
  game: string;
  start_date: string;
  max_players: number;
  players_per_team: number;
  isLoading: boolean;
  type: ISelectOption;
  status: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextareaChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onMaxPlayersChange: (value: number) => void;
  onTeamAmountChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  handleUpdateStatus: (value: string) => void;
  handleChangeTournamentType: (value: ISelectOption) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const EditModal = ({
  name,
  description,
  game,
  start_date,
  max_players,
  players_per_team,
  isLoading,
  status,
  type,
  onInputChange,
  onTextareaChange,
  onMaxPlayersChange,
  onTeamAmountChange,
  onStartDateChange,
  handleUpdateStatus,
  handleChangeTournamentType,
  onSubmit,
  onClose,
}: IEditModalProps) => {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-bold">Редактировать турнир</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={onInputChange}
            className="w-full p-2.5 rounded-lg bg-muted border border-border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            name="description"
            value={description}
            onChange={onTextareaChange}
            className="w-full p-2.5 rounded-lg bg-muted border border-border min-h-[100px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Игра</label>
          <input
            name="game"
            type="text"
            value={game}
            onChange={onInputChange}
            className="w-full p-2.5 rounded-lg bg-muted border border-border"
            required
          />
        </div>

        <div className="col-span-2">
          <span className="text-sm font-medium">Тип турнира</span>
          <CustomSelect
            containerClassName="mt-1  border-2 border-border text-lg rounded-lg bg-muted"
            triggerClassName="pr-2 text-sm! text-left py-2"
            options={selectTypeOptions}
            value={type}
            onChange={handleChangeTournamentType}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Макс. игроков
          </label>
          <input
            name="max_players"
            type="number"
            value={max_players}
            onChange={(event) => onMaxPlayersChange(+event.target.value)}
            className="w-full p-2.5 rounded-lg bg-muted border border-border"
            min="2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Игроков в команде
            </label>
            <input
              name="players_per_team"
              type="number"
              value={players_per_team}
              onChange={(event) => onTeamAmountChange(+event.target.value)}
              className="w-full p-2.5 rounded-lg bg-muted border border-border"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Дата начала
            </label>
            <input
              name="start_date"
              type="datetime-local"
              value={start_date}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="w-full p-2.5 rounded-lg bg-muted border border-border"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Статус</label>
          <select
            value={status}
            onChange={(event) => handleUpdateStatus(event.target.value)}
            className="w-full p-2.5 rounded-lg bg-muted border border-border box-border"
          >
            <option value="open">Открыт</option>
            <option value="ongoing">В процессе</option>
            <option value="finished">Завершён</option>
            <option value="canceled">Отменён</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Сохранить
          </button>
        </div>
      </form>
    </>
  );
};

export default EditModal;
