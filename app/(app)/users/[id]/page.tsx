"use client";

import Discord from "@/app/components/Icons/Discord";
import { db } from "@/app/utils/firebase";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { setUser } from "@/app/utils/store/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import Steam from "@/app/components/Icons/Steam";
import Link from "next/link";
import CustomInput from "@/app/components/Shared/CustomInput/CustomInput";
import MultipleGameSelect from "@/app/components/MultipleGameSelect/MultipleGameSelect";
import axios from "axios";
import { IGame, IUser } from "@/app/lib/types";
import { toast } from "react-toastify";

export const roles = {
  user: "Участник",
  admin: "Админ",
  superadmin: "Суперадмин",
  guest: "Гость",
};

export const roleColors = {
  guest: "text-neutral-500",
  user: "text-neutral-100",
  admin: "text-primary",
  superadmin: "text-yellow-400",
};

const steamLinkRegex = /steamcommunity\.com\/(?:id|profiles)\/([a-zA-Z0-9_-]+)/;

const page = () => {
  const [userInfo, setUserInfo] = useState<IUser>({
    id: "",
    full_name: "",
    discord: "",
    image_url: "",
    email: "",
    role: "guest",
    steam_link: "",
    steam_display_name: "",
    games: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [steamLinkError, setSteamLinkError] = useState("");
  const { user: currentUser } = useAppSelector((state) => state.user);
  const params = useParams();
  const isCurrentUser = params.id === currentUser.id;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdateSteamAccount = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      !event.target.value.match(steamLinkRegex) &&
      event.target.value.length !== 0
    ) {
      setSteamLinkError(
        "Введите валидную ссылку формата https://steamcommunity.com/my/profile",
      );
    } else {
      setSteamLinkError("");
    }
    setUserInfo((prevState) => ({
      ...prevState,
      steam_link: event.target.value,
    }));
  };

  const handleUpdateInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRemoveGame = (id: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      games: (prevState?.games || []).filter((game) => game.id !== id),
    }));
  };

  console.log(userInfo);

  const handleAddGame = (value: IGame) => {
    setUserInfo((prevState) => ({
      ...prevState,
      games: [...(prevState?.games || []), value],
    }));
  };

  const handleLoadUser = async () => {
    try {
      const response = await axios.get<IUser>("/api/users/currentUser");

      const data = response.data;

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

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой");
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", userInfo.id);
      formData.append("full_name", userInfo.full_name);
      formData.append("discord", userInfo.discord || "");
      formData.append("steam_link", userInfo.steam_link || "");
      const gameIds = userInfo.games?.map((game) => game.id) || [];
      formData.append("gameIds", JSON.stringify(gameIds));

      if (imageFile) {
        formData.append("image", imageFile);
      }
      const { data } = await axios.post("/api/users/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setUser(data.user));
      toast.success("Профиль успешно обновлен");
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadUser();
    if (isCurrentUser) {
      setUserInfo(currentUser);
    }
  }, []);

  if (!userInfo.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <Loader2 className="h-8 w-8" />
        </motion.div>
        Загрузка пользователя...
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 ">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative ring-2 ring-primary/30 shadow-xl rounded-full overflow-hidden"
          >
            {isCurrentUser && (
              <div className="absolute flex items-center justify-center w-full h-full z-10 hover:opacity-100 opacity-0 bg-black/50 transition-all">
                <input
                  type="file"
                  className="absolute opacity-0 z-10 w-full h-full cursor-pointer"
                  onChange={handleChangeImage}
                />
                <Camera />
              </div>
            )}
            {imageFile ? (
              <Image
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 object-cover"
                src={URL.createObjectURL(imageFile)}
                alt="Profile picture"
              />
            ) : userInfo.image_url ? (
              <Image
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 object-cover"
                src={userInfo.image_url}
                alt="Profile picture"
              />
            ) : (
              <div className="w-32 h-32 bg-primary/10 flex items-center justify-center text-primary text-2xl">
                {userInfo.full_name?.[0] || "U"}
              </div>
            )}
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              {userInfo.full_name}
            </motion.h1>

            {(currentUser.role === "admin" ||
              currentUser.role === "superadmin") && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-muted-foreground"
              >
                {userInfo.email}
              </motion.p>
            )}

            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`text-sm font-mono ${roleColors[userInfo.role]}`}
            >
              {roles[userInfo.role]}
            </motion.span>
          </div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-2xl font-bold"
      >
        Информация о пользователе
      </motion.h2>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 w-full gap-4"
        onSubmit={handleSubmit}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4 w-full"
        >
          <CustomInput
            label="Имя пользователя на сайте"
            name="full_name"
            value={userInfo.full_name}
            onChange={handleUpdateInput}
            disabled={!currentUser}
            placeholder="JohnDoe"
          />

          <CustomInput
            label="Discord"
            name="discord"
            value={userInfo.discord}
            onChange={handleUpdateInput}
            disabled={!currentUser}
            icon={<Discord className="h-4 w-4" />}
            description={
              isCurrentUser ? (
                <span className="block text-xs leading-5 text-neutral-400 mt-1">
                  Скопируйте имя пользователя в Discord и вставьте сюда
                </span>
              ) : (
                ""
              )
            }
            placeholder="discord"
          />

          <CustomInput
            label="Ссылка на профиль Steam"
            name="steam_link"
            value={userInfo.steam_link}
            onChange={handleUpdateSteamAccount}
            placeholder={
              isCurrentUser
                ? "https://steamcommunity.com/id/username123"
                : "Не указана"
            }
            icon={<Steam className="h-4 w-4 text-white" />}
            description={
              isCurrentUser ? (
                <>
                  <span className="block text-xs leading-5 text-neutral-400 mt-1">
                    Найти ссылку на свой Steam-аккаунт можно{" "}
                    <Link
                      href="https://steamcommunity.com/my/profile"
                      className="underline"
                      target="_blank"
                    >
                      здесь
                    </Link>
                  </span>
                  <span className="block text-xs leading-5 text-red-400 mt-1">
                    {steamLinkError}
                  </span>
                </>
              ) : (
                ""
              )
            }
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <span className="text-sm font-medium mb-1 block">
              Предпочитаемые игры
            </span>
            {isCurrentUser ? (
              <MultipleGameSelect
                value={userInfo.games}
                onChange={handleAddGame}
                handleDelete={handleRemoveGame}
              />
            ) : (
              <div className="flex items-center flex-wrap gap-2 p-1 border relative bg-muted rounded-lg">
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
          </div>
        </motion.div>

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
    </main>
  );
};

export default page;
