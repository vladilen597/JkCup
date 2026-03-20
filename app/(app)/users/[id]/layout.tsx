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
import ProfileHeader from "@/app/components/Profile/ProfileHeader/ProfileHeader";

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
      <ProfileHeader
        user={userInfo}
        isCurrentUser={true}
        isAdmin={true}
        isSuperAdmin={false}
        onImageChange={handleChangeImage}
      />
      <div className="mt-4">
        <ProfileTabs />
      </div>

      <div className="mt-4">{children}</div>
    </main>
  );
};

export default page;
