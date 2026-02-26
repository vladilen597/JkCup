"use client";

import Discord from "@/app/components/Icons/Discord";
import { db } from "@/app/utils/firebase";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { IUser, setUser } from "@/app/utils/store/userSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Steam from "@/app/components/Icons/Steam";
import Link from "next/link";

export const roles = {
  user: "Пользователь",
  admin: "Админ",
  superadmin: "Суперадмин",
};

export const roleColors = {
  user: "text-neutral-400",
  admin: "text-primary",
  superadmin: "text-yellow-400",
};

const steamLinkRegex = /steamcommunity\.com\/(?:id|profiles)\/([a-zA-Z0-9_-]+)/;

const page = () => {
  const [userInfo, setUserInfo] = useState<IUser>({
    uid: "",
    displayName: "",
    discord: "",
    photoUrl: "",
    email: "",
    role: "user",
    steamLink: "",
    steamDisplayName: "",
  });
  const [steamLinkError, setSteamLinkError] = useState("");
  const { user: currentUser } = useAppSelector((state) => state.user);
  const params = useParams();
  const isCurrentUser = params.id === currentUser.uid;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const userDocRef = doc(db, "users", params.id as string);

  const handleUpdateInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

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
      steamLink: event.target.value,
    }));
  };

  const handleLoadUser = async () => {
    const data = (await getDoc(userDocRef)).data();
    if (data) {
      setUserInfo(data as IUser);
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const steamDisplayNameString = userInfo.steamLink
      ? userInfo.steamLink.replace(/\/$/, "").split("/").pop()
      : "";
    try {
      await updateDoc(userDocRef, {
        discord: userInfo.discord,
        displayName: userInfo.displayName,
        steamLink: userInfo.steamLink,
        steamDisplayName: steamDisplayNameString,
      });
      dispatch(
        setUser({ ...userInfo, steamDisplayName: steamDisplayNameString }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCurrentUser) {
      setUserInfo(currentUser);
    } else {
      handleLoadUser();
    }
  }, [isCurrentUser, currentUser]);

  if (!userInfo.uid) {
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

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {userInfo.photoUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full ring-2 ring-primary/30 shadow-xl"
                src={userInfo.photoUrl}
                alt="Profile picture"
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              {userInfo.displayName}
            </motion.h1>

            {currentUser.role !== "user" && (
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

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 max-w-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl font-bold"
        >
          Информация о пользователе
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Имя пользователя на сайте
            </label>
            <input
              name="displayName"
              type="text"
              value={userInfo.displayName}
              onChange={handleUpdateInput}
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
              disabled={!isCurrentUser}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Discord className="h-4 w-4" />
              Discord
            </label>
            <input
              name="discord"
              type="text"
              value={userInfo.discord}
              onChange={handleUpdateInput}
              placeholder={isCurrentUser ? "discordUser" : "Не указан"}
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
              disabled={!isCurrentUser}
            />
            {isCurrentUser && (
              <span className="block text-xs leading-5 text-neutral-400 mt-1">
                Скопируйте имя пользователя в Discord и вставьте сюда
              </span>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Steam className="h-4 w-4 text-white" />
              Ссылка на профиль Steam
            </label>
            <input
              name="steamLink"
              type="text"
              value={userInfo.steamLink}
              onChange={handleUpdateSteamAccount}
              placeholder={
                isCurrentUser
                  ? "https://steamcommunity.com/id/username123"
                  : "Не указана"
              }
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
              disabled={!isCurrentUser}
            />
            {isCurrentUser && (
              <>
                <span className="block text-xs leading-5 text-neutral-400 mt-1">
                  Найти ссылку на свой Steam-аккаунт можно{" "}
                  <Link
                    href="https://steamcommunity.com/my/profile"
                    className="underline"
                  >
                    здесь
                  </Link>
                </span>
                <span className="block text-xs leading-5 text-red-400 mt-1">
                  {steamLinkError}
                </span>
              </>
            )}
          </div>

          {/* <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Clock className="h-4 w-4" />
              Зарегистрирован
            </label>
            <input
              name="discord"
              type="text"
              value={format(userInfo.createdAt, "dd.MM.yyyy HH:mm")}
              className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
              disabled
            />
          </div> */}
        </motion.div>

        {isCurrentUser && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center gap-2 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-60 cursor-pointer"
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
