"use client";

import { motion } from "framer-motion";
import { Loader2, X, Plus, Clock } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";
import { selectTypeOptions } from "../CreateTournamentModal/CreateTournamentModal";
import { useDurationInput } from "react-duration-input";

interface IEditModalProps {
  name: string;
  description: string;
  game: string;
  start_date: string;
  max_players: number;
  max_teams: number;
  players_per_team: number;
  duration: number;
  isLoading: boolean;
  type: ISelectOption;
  status: string;
  rewards: { id: string; value: string }[];
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextareaChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onTeamAmountChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  handleUpdateStatus: (value: string) => void;
  handleChangeTournamentType: (value: ISelectOption) => void;
  handleChangeMaxTeamsOrPlayers: (value: number) => void;
  handleRewardChange: (index: number, value: string) => void;
  handleAddReward: () => void;
  handleDeleteReward: (id: string) => void;
  handleChangeDuration: (ms: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const EditModal = ({
  name,
  description,
  game,
  start_date,
  max_players,
  max_teams,
  players_per_team,
  duration = 0,
  isLoading,
  status,
  type,
  rewards,
  onInputChange,
  onTextareaChange,
  onTeamAmountChange,
  onStartDateChange,
  handleUpdateStatus,
  handleChangeTournamentType,
  handleChangeMaxTeamsOrPlayers,
  handleRewardChange,
  handleAddReward,
  handleDeleteReward,
  handleChangeDuration,
  onSubmit,
  onClose,
}: IEditModalProps) => {
  const durationInputProps = useDurationInput({
    timeInMilliseconds: duration,
    isMilliseconds: false,
    onTimeUpdate: (ms: number) => {
      handleChangeDuration(ms);
    },
  });

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-bold">Редактировать турнир</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              name="name"
              type="text"
              value={name}
              onChange={onInputChange}
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Игра</label>
            <input
              name="game"
              type="text"
              value={game}
              onChange={onInputChange}
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            name="description"
            value={description}
            onChange={onTextareaChange}
            className="w-full p-2.5 rounded-lg bg-muted border border-border min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-2">
          <span className="text-sm font-medium">Тип турнира</span>
          <CustomSelect
            containerClassName="mt-1 border-2 border-border text-lg rounded-lg bg-muted"
            triggerClassName="pl-2 justify-start text-sm! text-left py-2"
            options={selectTypeOptions}
            value={type}
            onChange={handleChangeTournamentType}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Макс. {type.value === "team" ? "команд" : "игроков"}
          </label>
          <input
            type="number"
            value={type.value === "team" ? max_teams : max_players}
            onChange={(e) => handleChangeMaxTeamsOrPlayers(+e.target.value)}
            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            min="2"
            required
          />
        </div>

        {type.value === "team" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Игроков в команде
            </label>
            <input
              name="players_per_team"
              type="number"
              value={players_per_team}
              onChange={(event) => onTeamAmountChange(+event.target.value)}
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              required
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Длительность турнира
          </label>

          <input
            {...durationInputProps}
            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Например: 2:30 (2 часа 30 минут)"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Награды</label>
            <button
              type="button"
              onClick={handleAddReward}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить награду
            </button>
          </div>

          {rewards.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Награды не добавлены
            </p>
          ) : (
            <div className="space-y-2 pr-1">
              {rewards.map((reward, index) => (
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
                        handleRewardChange(index, e.target.value)
                      }
                      placeholder="Введите награду"
                      className="w-full p-2 pr-10 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      className="absolute right-2 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                      type="button"
                      onClick={() => handleDeleteReward(reward.id)}
                      disabled={rewards.length <= 1}
                    >
                      <X
                        className={`w-4 h-4 ${rewards.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Дата начала</label>
          <input
            name="start_date"
            type="datetime-local"
            value={start_date}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Статус</label>
          <select
            value={status}
            onChange={(event) => handleUpdateStatus(event.target.value)}
            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="open">Открыт</option>
            <option value="about_to_start">Регистрация закрыта</option>
            <option value="ongoing">В процессе</option>
            <option value="finished">Завершён</option>
            <option value="canceled">Отменён</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
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
