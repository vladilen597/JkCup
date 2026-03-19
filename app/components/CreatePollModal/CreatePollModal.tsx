"use client";

import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IGame } from "@/app/lib/types";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { cn } from "@/lib/utils";
import DarkDateTimePicker from "../Shared/DateTimePicker/DateTimePicker";
import CustomInput from "../Shared/CustomInput/CustomInput";

const CreatePollModal = ({ onClose, onCreated }: any) => {
  const [title, setTitle] = useState("Следующая игра на турнире");
  const [endsAt, setEndsAt] = useState("");
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<IGame[]>([]);

  const handleLoadGames = async () => {
    try {
      const { data } = await axios.get("/api/games");
      setGames(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const toggleGame = (id: string) => {
    setSelectedGameIds((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id],
    );
  };

  console.log(endsAt);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !endsAt || selectedGameIds.length < 2) {
      return toast.error("Заполните заголовок, дату и выберите минимум 2 игры");
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/admin/polls", {
        title,
        game_ids: selectedGameIds,
        ends_at: new Date(endsAt).toISOString(),
      });

      toast.success("Голосование запущено!");
      onCreated(data);
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Ошибка создания голосования",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, []);

  return (
    <form className="flex flex-col gap-6 p-2" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <CustomInput
          label="Заголовок"
          value={title}
          onChange={handleChangeTitle}
          required
        />

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">
            Дата окончания
          </label>

          <DarkDateTimePicker
            value={endsAt}
            onChange={(value) => setEndsAt(value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">
            Выберите игры ({selectedGameIds.length})
          </label>
          <div className="flex flex-wrap gap-2 overflow-y-auto p-1 custom-scrollbar">
            {games.map((game: IGame) => {
              const isSelected = selectedGameIds.includes(game.id);
              return (
                <div
                  key={game.id}
                  onClick={() => toggleGame(game.id)}
                  className={cn(
                    "relative max-w-40 max-h-40 h-full w-full aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                    isSelected
                      ? "border-primary!"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={game.image_url}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-[10px] font-bold truncate">
                      {game.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          label="Запустить голосование"
          disabled={isLoading}
          type="submit"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default CreatePollModal;
