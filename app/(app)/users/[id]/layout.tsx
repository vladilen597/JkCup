"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  clearUserInfo,
  setUserInfo,
  updateUserInfo,
} from "@/app/utils/store/userSlice";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import axios from "axios";
import { IGame, IUser } from "@/app/lib/types";
import { toast } from "react-toastify";
import RoleSelect from "@/app/components/Shared/RoleSelect/RoleSelect";
import { roleSelectOptions } from "@/app/components/UserList/UserLine/UserLine";
import CustomSkeleton from "@/app/components/Shared/CustomSkeleton/CustomSkeleton";
import ProfileTabs from "@/app/components/ProfileTabs/ProfileTabs";

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

const page = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userInfo } = useAppSelector((state) => state.user);
  const params = useParams();
  const isCurrentUser = params.id === currentUser.id;
  const [userRole, setUserRole] = useState<{
    id: number;
    value: string;
    label: string;
  }>({
    id: 1,
    value: "guest",
    label: "Гость",
  });
  const dispatch = useAppDispatch();

  const handleLoadUser = async () => {
    try {
      const { data } = await axios.get<IUser>("/api/users/" + params.id);

      if (data) {
        dispatch(setUserInfo(data));
        setUserRole(
          roleSelectOptions.find((option) => option.value === data.role),
        );
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

  const handleUpdateRole = async (value: {
    id: number;
    value: string;
    label: string;
  }) => {
    const oldRole = userRole;
    setUserRole(value);
    try {
      await axios.post("/api/users/user/update/role", {
        userId: userInfo.id,
        newRole: value.value,
      });
    } catch (error) {
      console.log(error);
      setUserRole(oldRole);
    }
  };

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой");
      return;
    }

    dispatch(updateUserInfo({ name: "imageFile", value: file }));
  };

  useEffect(() => {
    handleLoadUser();
    return () => {
      dispatch(clearUserInfo());
    };
  }, []);

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative  rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 ">
          {!userInfo.id ? (
            <CustomSkeleton
              className="rounded-full"
              width={128}
              height={128}
              borderRadius="100%"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative ring-2 ring-primary/30 shadow-xl rounded-full overflow-hidden"
            >
              <>
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
                {userInfo.imageFile ? (
                  <Image
                    width={128}
                    height={128}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover"
                    src={URL.createObjectURL(userInfo.imageFile)}
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
              </>
            </motion.div>
          )}

          <div className="relative space-y-2">
            {!userInfo.id ? (
              <CustomSkeleton
                baseColor="#1a1c23"
                highlightColor="#363d49"
                count={1}
                width={300}
                height={40}
              ></CustomSkeleton>
            ) : (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-black tracking-tight"
              >
                {userInfo.full_name}
              </motion.h1>
            )}

            {(currentUser.role === "admin" ||
              currentUser.role === "superadmin") && (
              <>
                {!userInfo.id ? (
                  <CustomSkeleton width={300} height={24} />
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-muted-foreground"
                  >
                    {userInfo.email}
                  </motion.p>
                )}
              </>
            )}

            {!userInfo.id ? (
              <CustomSkeleton width={300} height={32} />
            ) : (
              <>
                {currentUser.role === "superadmin" &&
                currentUser.id !== userInfo.id ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`text-sm font-mono`}
                  >
                    <RoleSelect
                      containerClassName="w-fit"
                      triggerClassName="justify-start"
                      value={userRole}
                      onChange={handleUpdateRole}
                      options={roleSelectOptions}
                    />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`text-sm font-mono ${roleColors[userInfo.role]}`}
                  >
                    {roles[userInfo.role]}
                  </motion.span>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
      <ProfileTabs />

      <div className="mt-4">{children}</div>
    </main>
  );
};

export default page;
