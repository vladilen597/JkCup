import { motion } from "motion/react";
import { ChangeEvent, useState } from "react";
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
  Calendar,
} from "lucide-react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import DateTimePicker from "../Shared/DateTimePicker/DateTimePicker";
import DurationPicker from "../Shared/DurationPicker/DurationPicker";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import { ITag, ITournament } from "@/app/lib/types";
import TagSelect, { TAG_PALETTE } from "../Shared/TagEdit/TagEdit";
import CustomCheckbox from "../Shared/CustomCheckbox/CustomCheckbox";
import GameSelect from "../Shared/GameSelect/GameSelect";
import axios from "axios";
import { useAppSelector } from "@/app/utils/store/hooks";
import { toast } from "react-toastify";
import CustomInput from "../Shared/CustomInput/CustomInput";

export const selectTypeOptions = [
  { id: 1, value: "team", label: "Командный" },
  { id: 2, value: "single", label: "Одиночный" },
];

interface ICreateTournamentModalProps {
  onClose: () => void;
  onSubmit: (tournaments: ITournament) => void;
}

const Tiptap = dynamic(
  () => import("@/app/components/Shared/RichEditor/RichEditor"),
  {
    ssr: false,
    loading: () => <div className="h-50 bg-muted animate-pulse rounded-lg" />,
  },
);

const CreateTournamentModal = ({
  onClose,
  onSubmit,
}: ICreateTournamentModalProps) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    game: null,
    type: {
      id: 2,
      value: "single",
      label: "Одиночный",
    },
    description: "",
    max_players: 6,
    max_teams: 6,
    players_per_team: 2,
    start_date: "",
    tags: [],
    rewards: [],
    status: "open",
    duration: 0,
    is_bracket: false,
    hidden: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);

  const canCreateTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const handleAddReward = () => {
    setFormData((prevState: any) => ({
      ...prevState,
      rewards: [...(formData.rewards || []), { id: uuidv4(), value: "" }],
    }));
  };

  const handleUpdateTournamentType = (value: ISelectOption) => {
    setFormData((prevState: any) => ({
      ...prevState,
      type: value,
    }));
  };

  const handleTagChange = (id: string, newValue: string) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: (prev.tags || []).map((tag: ITag) =>
        tag.id === id ? { ...tag, value: newValue } : tag,
      ),
    }));
  };

  const removeTag = (id: string) => {
    setFormData((prevState: any) => ({
      ...prevState,
      tags: (prevState.tags || []).filter((tag: any) => tag.id !== id),
    }));
  };

  const addNewTag = () => {
    const randomColor =
      TAG_PALETTE[Math.floor(Math.random() * TAG_PALETTE.length)];

    setFormData((prev: any) => ({
      ...prev,
      tags: [
        ...(prev.tags || []),
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
    setFormData((prev: any) => ({
      ...prev,
      tags: (prev.tags || []).map((tag: ITag) =>
        tag.id === id ? { ...tag, bgColor, textColor } : tag,
      ),
    }));
  };

  const canAddMoreRewards =
    formData.type.value === "team"
      ? formData.max_teams > formData.rewards.length
      : formData.max_players > formData.rewards.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateTournament) return;

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        type: formData.type.value,
        game_id: formData.game?.id || null,
        max_players:
          formData.type.value === "single"
            ? Number(formData.max_players)
            : null,
        max_teams:
          formData.type.value === "team" ? Number(formData.max_teams) : null,
        players_per_team: Number(formData.players_per_team) || 1,
        description: formData.description || "",
        is_bracket: formData.is_bracket,
        creator_id: currentUser.id,
        duration: formData.duration,
        status: "open",
        rules: "",
        stream_link: "",
        tags: formData.tags,
        rewards: formData.rewards || [],
        hidden: formData.hidden,
        start_date: formData.start_date,
      };

      const { data } = await axios.post("/api/tournaments", payload);

      toast.success(`Турнир ${payload.name} успешно создан`);

      if (onSubmit) onSubmit(data);

      onClose();
    } catch (err: any) {
      console.error("Create Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Ошибка при создании турнира");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-bold mb-4">Новый турнир</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CustomInput
            label="Название"
            name="name"
            value={formData.value}
            onChange={handleChangeInput}
          />

          <div className="w-full">
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Gamepad2 className="w-4 h-4" />
              Игра
            </label>
            <GameSelect
              value={formData.game}
              onChange={(value) => setFormData({ ...formData, game: value })}
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
              setFormData((prevState: any) => ({
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
              onChange={handleUpdateTournamentType}
            />
          </div>
        </div>

        <CustomCheckbox
          name="is_bracket"
          label="Использовать сетку"
          checked={formData.is_bracket}
          onChange={() =>
            setFormData((prevState) => ({
              ...prevState,
              is_bracket: !prevState.is_bracket,
            }))
          }
        />

        <div className="flex items-center gap-2">
          <CustomInput
            label={`Макс. ${formData.type.value === "team" ? "команд" : "игроков"}`}
            name={formData.type.value === "team" ? "max_teams" : "max_players"}
            value={
              formData.type.value === "team"
                ? formData.max_teams
                : formData.max_players
            }
            onChange={handleChangeInput}
          />
          {formData.type.value === "team" && (
            <CustomInput
              label="Игроков в команде"
              name="players_per_team"
              value={formData.players_per_team}
              onChange={handleChangeInput}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full">
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Calendar className="w-4 h-4" /> Дата начала
            </label>
            <DateTimePicker
              value={formData.start_date}
              onChange={(value) =>
                setFormData({ ...formData, start_date: value })
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
                setFormData((prevState: any) => {
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
            <p className="text-sm text-muted-foreground">
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
                        setFormData((prevState: any) => ({
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
                        setFormData((prevState: any) => ({
                          ...prevState,
                          rewards: prevState.rewards.filter(
                            (r: { id: string; value: string }) =>
                              r.id !== reward.id,
                          ),
                        }))
                      }
                    >
                      <X className="w-4 h-4" />
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
            setFormData((prevState) => ({
              ...prevState,
              hidden: !prevState.hidden,
            }))
          }
        />
      </div>

      <div className="mt-6 flex gap-2">
        <CustomButton type="submit" label="Создать" isLoading={isLoading} />
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
