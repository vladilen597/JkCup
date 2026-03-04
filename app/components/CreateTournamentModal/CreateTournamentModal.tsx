import { motion } from "motion/react";
import { SubmitEvent } from "react";
import CustomSelect, {
  ISelectOption,
} from "../Shared/CustomSelect/CustomSelect";
import {
  X,
  Plus,
  Clock,
  Users,
  Trophy,
  Gamepad2,
  Tag,
  GitBranch,
} from "lucide-react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import DateTimePicker from "../Shared/DateTimePicker/DateTimePicker";
import DurationPicker from "../Shared/DurationPicker/DurationPicker";
import { v4 as uuidv4 } from "uuid";

export const selectTypeOptions = [
  { id: 1, value: "team", label: "Командный" },
  { id: 2, value: "single", label: "Одиночный" },
];

interface ICreateTournamentModalProps {
  formData: {
    name: string;
    game: null;
    type: ISelectOption;
    description: string;
    max_players: number;
    max_teams: number;
    players_per_team: number;
    start_date: string;
    tags: ITag[];
    duration: number;
    rewards: { id: string; value: string }[];
    useBracket?: boolean;
    hidden?: boolean;
  };
  handleChange: (value: any) => void;
  handleChangeTournamentType: (value: ISelectOption) => void;
  handleAddReward: () => void;
  onClose: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

import dynamic from "next/dynamic";
import { ITag } from "@/app/lib/types";
import TagSelect, { TAG_PALETTE } from "../Shared/TagEdit/TagEdit";
import CustomCheckbox from "../Shared/CustomCheckbox/CustomCheckbox";
import GameSelect from "../Shared/GameSelect/GameSelect";

const Tiptap = dynamic(
  () => import("@/app/components/Shared/RichEditor/RichEditor"),
  {
    ssr: false,
    loading: () => <div className="h-50 bg-muted animate-pulse rounded-lg" />,
  },
);

const CreateTournamentModal = ({
  formData,
  handleChange,
  handleChangeTournamentType,
  onClose,
  handleAddReward,
  onSubmit,
}: ICreateTournamentModalProps) => {
  const handleTagChange = (id: string, newValue: string) => {
    handleChange((prev: any) => ({
      ...prev,
      tags: prev.tags?.map((tag: ITag) =>
        tag.id === id ? { ...tag, value: newValue } : tag,
      ),
    }));
  };

  const removeTag = (id: string) => {
    handleChange((prevState: any) => ({
      ...prevState,
      tags: prevState.tags?.filter((tag: any) => tag.id !== id),
    }));
  };

  const addNewTag = () => {
    const randomColor =
      TAG_PALETTE[Math.floor(Math.random() * TAG_PALETTE.length)];

    handleChange((prev: any) => ({
      ...prev,
      tags: [
        ...prev.tags,
        {
          id: uuidv4(),
          value: "",
          bgColor: randomColor.bg,
          textColor: randomColor.text,
        },
      ],
    }));
  };

  const updateTagColor = (id: string, bgColor: string, textColor: string) => {
    handleChange((prev: any) => ({
      ...prev,
      tags: prev.tags?.map((tag: ITag) =>
        tag.id === id ? { ...tag, bgColor, textColor } : tag,
      ),
    }));
  };

  const canAddMoreRewards =
    formData.type.value === "team"
      ? formData.max_teams > formData.rewards.length
      : formData.max_players > formData.rewards.length;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Gamepad2 className="w-4 h-4" />
              Игра
            </label>
            <GameSelect
              value={formData.game}
              onChange={(value) => handleChange({ ...formData, game: value })}
            />
            {/* <input
              type="text"
              value={formData.game}
              onChange={(e) =>
                handleChange({ ...formData, game: e.target.value })
              }
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            /> */}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">
            <Tag className="w-4 h-4" />
            Теги
          </label>
          <ul className="mt-2 flex items-center gap-1 flex-wrap">
            {formData.tags?.map((tag) => (
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

          <Tiptap
            value={formData.description}
            onChange={(value) =>
              handleChange((prevState: any) => ({
                ...prevState,
                description: value,
              }))
            }
          />
        </div>

        <div className="col-span-2">
          <span className="text-sm font-medium">Тип турнира</span>
          <div className="mt-2">
            <CustomSelect
              options={selectTypeOptions}
              value={formData.type}
              onChange={handleChangeTournamentType}
            />
          </div>
        </div>

        <CustomCheckbox
          label="Использовать сетку"
          checked={formData.useBracket}
          onChange={() =>
            handleChange((prevState) => ({
              ...formData,
              useBracket: !prevState.useBracket,
            }))
          }
        />

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

        <div className="flex items-center gap-2">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              Дата начала
            </label>
            <DateTimePicker
              value={formData.start_date}
              onChange={(value) =>
                handleChange({ ...formData, start_date: value })
              }
            />
          </div>
          <div className="w-full">
            <label className="flex gap-2 items-center text-sm font-medium mb-1">
              <Clock className="w-4 h-4" /> Длительность
            </label>
            <DurationPicker
              valueMs={formData.duration}
              onChange={(value) => {
                handleChange((prevState: any) => {
                  return {
                    ...prevState,
                    duration: value,
                  };
                });
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Trophy className="w-4 h-4" /> Награды
            </label>
            {canAddMoreRewards && (
              <CustomButton
                label="Добавить награду"
                className="bg-primary/10 text-primary hover:bg-primary/20"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddReward}
              />
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

        <CustomCheckbox
          label="Скрытый турнир"
          checked={formData.hidden}
          onChange={() =>
            handleChange((prevState) => ({
              ...prevState,
              hidden: !prevState.hidden,
            }))
          }
        />
      </div>

      <div className="mt-6 flex gap-2">
        <CustomButton type="submit" label="Создать" />
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
      </div>
    </motion.form>
  );
};

export default CreateTournamentModal;
