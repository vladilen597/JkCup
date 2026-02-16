"use client";

import Discord from "@/app/components/Icons/Discord";
import { db } from "@/app/utils/firebase";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { IUser, setUser } from "@/app/utils/store/userSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

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

const page = () => {
  const [userInfo, setUserInfo] = useState<IUser>({
    uid: "",
    displayName: "",
    discord: "",
    photoUrl: "",
    email: "",
    role: "user",
  });
  const { user: currentUser } = useAppSelector((state) => state.user);
  const params = useParams();
  const isCurrentUser = params.id === currentUser.uid;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const userDocRef = doc(db, "users", params.id as string);

  const handleUpdateInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleLoadUser = async () => {
    const data = (await getDoc(userDocRef)).data();
    setUserInfo(data as IUser);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(userDocRef, {
        discord: userInfo.discord,
        displayName: userInfo.displayName,
      });
      dispatch(setUser(userInfo));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadUser();
    if (isCurrentUser) {
      setUserInfo(currentUser);
    } else {
      handleLoadUser();
    }
  }, []);

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
      <div className="flex items-center gap-3">
        {userInfo.photoUrl && (
          <Image
            width={128}
            height={128}
            className="w-20 h-20 rounded-full"
            src={userInfo.photoUrl}
            alt="Profile picture"
          />
        )}
        <div>
          <span className="block">{userInfo.displayName}</span>
          <span className="block text-sm text-neutral-400">
            {userInfo.email}
          </span>
          <span className={`text-sm font-mono ${roleColors[userInfo.role]}`}>
            {roles[userInfo.role]}
          </span>
        </div>
      </div>
      <form className="mt-8 text-2xl max-w-100" onSubmit={handleSubmit}>
        <h2>Информация о пользователе</h2>
        <label className="block mt-4">
          <span className="flex items-center gap-2 text-sm font-medium ">
            Имя пользователя на сайте
          </span>
          <input
            name="displayName"
            type="text"
            value={userInfo.displayName}
            onChange={handleUpdateInput}
            className="mt-1 w-full p-2 rounded-lg bg-muted border border-border text-sm"
            disabled={!isCurrentUser}
          />
        </label>
        <label className="block mt-4">
          <span className="flex items-center gap-2 text-sm font-medium ">
            <Discord /> Discord
          </span>
          <input
            name="discord"
            type="text"
            value={userInfo.discord}
            onChange={handleUpdateInput}
            className="mt-1 w-full p-2 rounded-lg bg-muted border border-border text-sm"
            disabled={!isCurrentUser}
          />
          {isCurrentUser && (
            <span className="ml-2 block text-xs leading-5 text-neutral-400">
              Скопируйте имя пользователя в Discord и вставьте сюда
            </span>
          )}
        </label>
        {isCurrentUser && (
          <button
            type="submit"
            className="flex items-center gap-2 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            disabled={isLoading}
          >
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="text-accent"
              >
                <Loader2 color="black" className="h-4 w-4" />
              </motion.div>
            )}
            Обновить
          </button>
        )}
      </form>
    </main>
  );
};

export default page;
