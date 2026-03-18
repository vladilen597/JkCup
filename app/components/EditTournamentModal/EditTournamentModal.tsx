"use client";

import { motion } from "framer-motion";
import { X, Plus, Clock, Tag, GitBranch, Calendar } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
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
import { IGame, ITag, ITournament } from "@/app/lib/types";
import { v4 as uuidv4 } from "uuid";
import TagSelect, { TAG_PALETTE } from "../Shared/TagEdit/TagEdit";
import GameSelect from "../Shared/GameSelect/GameSelect";
import CustomInput from "../Shared/CustomInput/CustomInput";
import CustomCheckbox from "../Shared/CustomCheckbox/CustomCheckbox";
import { updateTournament } from "@/app/utils/store/tournamentsSlice";
import { useAppDispatch } from "@/app/utils/store/hooks";
import axios from "axios";
import { toast } from "react-toastify";

const Tiptap = dynamic(
  () => import("@/app/components/Shared/RichEditor/RichEditor"),
  {
    ssr: false,
    loading: () => <div className="h-50 bg-muted animate-pulse rounded-lg" />,
  },
);

interface IEditTournamentModalProps {
  tournament: ITournament;
  onClose: () => void;
}

type TournamentFormData = Omit<ITournament, "type"> & {
  type: ISelectOption;
};

const EditTournamentModal = ({
  tournament,
  onClose,
}: IEditTournamentModalProps) => {
  const [tournamentData, setTournamentData] = useState<TournamentFormData>({
    ...tournament,
    type:
      typeof tournament.type === "string"
        ? selectTypeOptions.find((opt) => opt.value === tournament.type) ||
          selectTypeOptions[0]
        : tournament.type,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleTagChange = (id: string, newValue: string) => {
    setTournamentData((prev: any) => ({
      ...prev,
      tags: (prev.tags || []).map((tag: ITag) =>
        tag.id === id ? { ...tag, value: newValue } : tag,
      ),
    }));
  };

  const removeTag = (id: string) => {
    setTournamentData((prevState: any) => ({
      ...prevState,
      tags: (prevState.tags || []).filter((tag: any) => tag.id !== id),
    }));
  };

  const addNewTag = () => {
    const randomColor =
      TAG_PALETTE[Math.floor(Math.random() * TAG_PALETTE.length)];

    setTournamentData((prev: any) => ({
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
    setTournamentData((prev: any) => ({
      ...prev,
      tags: (prev.tags || []).map((tag: ITag) =>
        tag.id === id ? { ...tag, bgColor, textColor } : tag,
      ),
    }));
  };

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "text") {
      setTournamentData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    } else {
      setTournamentData((prevState) => ({
        ...prevState,
        [e.target.name]: !prevState[e.target.name],
      }));
    }
  }, []);

  const handleChangeDescription = (value: string) => {
    setTournamentData((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  const handleChangeRules = (value: string) => {
    setTournamentData((prevState) => ({
      ...prevState,
      rules: value,
    }));
  };

  const handleRewardChange = (index: number, value: string) => {
    setTournamentData((prevState) => ({
      ...prevState,
      rewards: prevState.rewards.map((reward, i) =>
        i === index ? { ...reward, value } : reward,
      ),
    }));
  };

  const handleAddReward = () => {
    setTournamentData((prevState) => ({
      ...prevState,
      rewards: [...(prevState.rewards || []), { id: uuidv4(), value: "" }],
    }));
  };

  const handleDeleteReward = (id: string) => {
    setTournamentData((prevState) => ({
      ...prevState,
      rewards: prevState.rewards.filter((reward) => reward.id !== id),
    }));
  };

  const handleChangeGame = (game: IGame) => {
    setTournamentData((prevState) => ({
      ...prevState,
      game: game,
    }));
  };

  const handleChangeSelect = (name: string, value: any) => {
    setTournamentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament?.id) return;

    setIsLoading(true);

    try {
      const payload = {
        ...tournamentData,
        type: (tournamentData.type as any).value || tournamentData.type,
        game_id: tournamentData.game?.id || null,
        max_players: Number(tournamentData.max_players),
        max_teams: Number(tournamentData.max_teams),
        players_per_team: Number(tournamentData.players_per_team),
      };

      const { data } = await axios.put(`/api/tournaments`, payload, {
        params: {
          id: tournament.id,
        },
      });

      toast.success(`Турнир ${tournamentData.name} успешно обновлен`);
      dispatch(updateTournament(data));
      onClose();
    } catch (error: any) {
      console.error("Update Error:", error);
      toast.error(error.message || "Произошла ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-bold">Редактировать турнир</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <CustomInput
            name="name"
            type="text"
            label="Название"
            value={tournamentData.name}
            onChange={handleInputChange}
          />
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Игра</label>
            <GameSelect
              value={tournamentData.game}
              onChange={handleChangeGame}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">
            <Tag className="w-4 h-4" />
            Теги
          </label>
          <ul className="mt-2 flex items-center gap-1 flex-wrap">
            {tournamentData.tags?.map((tag) => (
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
            value={tournamentData.description}
            onChange={handleChangeDescription}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Правила</label>
          <Tiptap value={tournamentData.rules} onChange={handleChangeRules} />
        </div>

        <div className="col-span-2">
          <span className="text-sm font-medium">Тип турнира</span>
          <CustomSelect
            containerClassName="mt-1 border-2 border-border text-lg rounded-lg bg-muted"
            triggerClassName="pl-2 justify-start text-sm! text-left py-2"
            options={selectTypeOptions}
            value={tournamentData.type}
            onChange={(value) => handleChangeSelect("type", value)}
          />
        </div>

        <CustomCheckbox
          name="is_bracket"
          label="Использовать сетку"
          checked={tournamentData.is_bracket}
          onChange={handleInputChange}
        />

        <div className="flex items-center gap-2">
          <CustomInput
            name={
              tournamentData.type.value === "team" ? "max_teams" : "max_players"
            }
            label={`Макс. ${tournamentData.type.value === "team" ? "команд" : "игроков"}`}
            value={
              tournamentData.type.value === "team"
                ? String(tournamentData.max_teams)
                : String(tournamentData.max_players)
            }
            onChange={handleInputChange}
          />

          {tournamentData.type.value === "team" && (
            <CustomInput
              name="players_per_team"
              label="Игроков в команде"
              value={String(tournamentData.players_per_team)}
              onChange={handleInputChange}
              required
            />
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="w-full">
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Calendar className="w-4 h-4" /> Дата начала
            </label>
            <DarkDateTimePicker
              value={tournamentData.start_date}
              onChange={(value) => handleChangeSelect("start_date", value)}
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Длительность
            </label>

            <DurationPicker
              valueMs={tournamentData.duration}
              onChange={(value) => handleChangeSelect("duration", value)}
            />
          </div>
        </div>

        <CustomInput
          type="text"
          name="stream_link"
          label="Название канала"
          description="Название канала берется в ссылке стрима после https://twitch.tv/"
          value={tournamentData.stream_link}
          onChange={handleInputChange}
        />

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
          {tournamentData.rewards?.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Награды не добавлены
            </p>
          ) : (
            <div className="space-y-2 pr-1">
              {tournamentData.rewards?.map((reward, index) => (
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
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <CustomCheckbox
            name="hidden"
            label="Скрытый турнир"
            checked={tournamentData.hidden}
            onChange={handleInputChange}
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

export default EditTournamentModal;
