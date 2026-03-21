"use client";

import CustomInput from "@/app/components/Shared/CustomInput/CustomInput";
import MultipleGameSelect from "@/app/components/MultipleGameSelect/MultipleGameSelect";
import { toast } from "react-toastify";
import { ChangeEvent, useEffect, useState } from "react";
import { IGame, IUser } from "@/app/lib/types";
import { motion } from "motion/react";
import Image from "next/image";
import CustomSkeleton from "@/app/components/Shared/CustomSkeleton/CustomSkeleton";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  setCurrentUser,
  setUserInfo,
  updateUserInfo,
} from "@/app/utils/store/userSlice";

const page = () => {
  const { userInfo } = useAppSelector((state) => state.user);
  const { currentUser } = useAppSelector((state) => state.user);
  const params = useParams();
  const [steamLinkError, setSteamLinkError] = useState("");
  const isCurrentUser = params.id === currentUser?.id;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdateInput = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateUserInfo({ name: event.target.name, value: event.target.value }),
    );
  };

  const handleRemoveGame = (id: string) => {
    dispatch(
      updateUserInfo({
        name: "games",
        value: (userInfo?.games || []).filter((game) => game.id !== id),
      }),
    );
  };

  const handleAddGame = (value: IGame) => {
    dispatch(
      updateUserInfo({
        name: "games",
        value: [...(userInfo?.games || []), value],
      }),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", userInfo.id);
      formData.append("full_name", userInfo.full_name);
      formData.append("image", userInfo.imageFile || "");
      const gameIds = userInfo.games?.map((game) => game.id) || [];

      formData.append("gameIds", JSON.stringify(gameIds));

      const { data } = await axios.post("/api/users/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setCurrentUser(data.user));
      toast.success("Профиль успешно обновлен");
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadUser = async () => {
    try {
      const { data } = await axios.get<IUser>("/api/users/" + params.id);

      if (data) {
        setUserInfo(data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Ошибка загрузки профиля:",
          error.response?.data || error.message,
        );
      }
    }
  };

  useEffect(() => {
    handleLoadUser();
  }, []);

  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Профиль сайта
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-neutral-400"
      >
        Здесь можно посмотреть информацию о пользователе
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 flex flex-col w-full md:w-[50%] gap-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 w-full">
          <CustomInput
            label="Имя пользователя на сайте"
            name="full_name"
            value={userInfo.full_name}
            onChange={handleUpdateInput}
            disabled={!currentUser}
            isLoading={!userInfo.id}
            placeholder="JohnDoe"
          />
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium block">
              Предпочитаемые игры
            </span>
            {isCurrentUser ? (
              <MultipleGameSelect
                containerClassName="mt-1!"
                value={userInfo.games}
                isLoading={!userInfo.id}
                onChange={handleAddGame}
                handleDelete={handleRemoveGame}
              />
            ) : (
              <>
                {!userInfo.id ? (
                  <CustomSkeleton height={46} />
                ) : (
                  <div className="mt-1 flex items-center flex-wrap gap-2 p-1 border relative bg-muted rounded-lg">
                    {userInfo?.games?.length ? (
                      userInfo?.games.map((game) => (
                        <div
                          key={game.id}
                          className="flex bg-background/50 p-1.5 rounded-lg items-center gap-2"
                        >
                          {game?.image_url && (
                            <Image
                              className="rounded object-cover h-4 w-4"
                              src={game.image_url}
                              width={16}
                              height={16}
                              alt="Game image"
                            />
                          )}
                          <span className="text-sm">{game?.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-1.5 text-white/40">
                        Нет предпочитаемых игр
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {(currentUser?.role === "superadmin" ||
            currentUser?.role === "admin") && (
            <CustomInput
              label="Приглашен"
              isLoading={!userInfo.id}
              value={
                userInfo.who_invited === "none" ? "Никем" : userInfo.who_invited
              }
              disabled
            />
          )}
        </div>

        {isCurrentUser && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex w-full justify-center md:justify-start md:w-fit items-center gap-2 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-60 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Обновить
          </motion.button>
        )}
      </motion.form>
    </>
  );
};

export default page;
