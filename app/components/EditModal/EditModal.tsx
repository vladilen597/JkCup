"use client";

import { motion } from "framer-motion";
import { X, Plus, Clock, Tag } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";
import { selectTypeOptions } from "../CreateTournamentModal/CreateTournamentModal";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import DarkDateTimePicker from "../Shared/DateTimePicker/DateTimePicker";
import DurationPicker from "../Shared/DurationPicker/DurationPicker";
import dynamic from "next/dynamic";
import { ITag } from "@/app/lib/types";
import { v4 as uuidv4 } from "uuid";
import TagSelect, { TAG_PALETTE } from "../Shared/TagEdit/TagEdit";

const Tiptap = dynamic(
  () => import("@/app/components/Shared/RichEditor/RichEditor"),
  {
    ssr: false,
    loading: () => <div className="h-50 bg-muted animate-pulse rounded-lg" />,
  },
);
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
  tags: ITag[];
  rewards: { id: string; value: string }[];
  onTagsChange: (tags: ITag[]) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextareaChange: (value: string) => void;
  onTeamAmountChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  handleChangeTournamentType: (value: ISelectOption) => void;
  handleChangeMaxTeamsOrPlayers: (value: number) => void;
  handleRewardChange: (index: number, value: string) => void;
  handleAddReward: () => void;
  handleDeleteReward: (id: string) => void;
  handleChangeDuration: (ms: any) => void;
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
  type,
  rewards,
  tags,
  onInputChange,
  onTextareaChange,
  onTeamAmountChange,
  onStartDateChange,
  handleChangeTournamentType,
  handleChangeMaxTeamsOrPlayers,
  handleRewardChange,
  handleAddReward,
  handleDeleteReward,
  handleChangeDuration,
  onTagsChange,
  onSubmit,
  onClose,
}: IEditModalProps) => {
  const handleTagChange = (id: string, newValue: string) => {
    onTagsChange(
      tags?.map((tag) => (tag.id === id ? { ...tag, value: newValue } : tag)),
    );
  };

  const removeTag = (id: string) => {
    onTagsChange(tags?.filter((tag) => tag.id !== id));
  };

  const updateTagColor = (id: string, bgColor: string, textColor: string) => {
    onTagsChange(
      tags?.map((tag) =>
        tag.id === id ? { ...tag, bgColor, textColor } : tag,
      ),
    );
  };

  const addNewTag = () => {
    const randomColor =
      TAG_PALETTE[Math.floor(Math.random() * TAG_PALETTE.length)];
    onTagsChange([
      ...tags,
      {
        id: uuidv4(),
        value: "",
        bgColor: randomColor.bg,
        textColor: randomColor.text,
      },
    ]);
  };

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
          <label className="flex items-center gap-2 text-sm font-medium mb-1">
            <Tag className="w-4 h-4" />
            Теги
          </label>
          <ul className="mt-2 flex items-center gap-1 flex-wrap">
            {tags?.map((tag) => (
              <li key={tag.id}>
                <TagSelect
                  {...tag}
                  onChange={(val: string) => handleTagChange(tag.id, val)}
                  onDeleteClick={() => removeTag(tag.id)}
                  onColorChange={(bg: string, txt: string) =>
                    updateTagColor(tag.id, bg, txt)
                  }
                />
              </li>
            ))}
            <li>
              <button
                type="button"
                className="bg-primary/10 flex items-center gap-2 px-2 py-0.5 rounded-full text-[13px] cursor-pointer"
                onClick={addNewTag}
              >
                <Plus className="w-4 h-4" /> Тег
              </button>
            </li>
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <Tiptap value={description} onChange={onTextareaChange} />
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

        <div className="flex items-center gap-2">
          {type.value !== "bracket" && (
            <div className="w-full">
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
          )}

          {type.value === "team" && (
            <div className="w-full">
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
        </div>

        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Длительность
          </label>

          <DurationPicker valueMs={duration} onChange={handleChangeDuration} />
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
          <DarkDateTimePicker
            value={start_date}
            onChange={(value) => onStartDateChange(value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <CustomButton
            label="Отмена"
            buttonType={BUTTON_TYPES.CANCEL}
            onClick={onClose}
          />
          <CustomButton
            label="Сохранить"
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
          />
        </div>
      </form>
    </>
  );
};

export default EditModal;
