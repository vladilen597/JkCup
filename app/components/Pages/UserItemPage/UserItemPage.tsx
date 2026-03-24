"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  clearUserInfo,
  setUserInfo,
  updateUserInfoField,
} from "@/app/utils/store/userSlice";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import { IUser } from "@/app/lib/types";
import ProfileTabs from "@/app/components/ProfileTabs/ProfileTabs";
import ProfileHeader from "@/app/components/Profile/ProfileHeader/ProfileHeader";

export const roles = {
  user: "Участник",
  admin: "Админ",
  superadmin: "Гл.Админ",
  guest: "Гость",
};

export const roleColors = {
  guest: "text-neutral-500",
  user: "text-neutral-100",
  admin: "text-primary",
  superadmin: "text-yellow-400",
};

const UserItemPage = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAppSelector((state) => state.user);
  const params = useParams();
  const dispatch = useAppDispatch();

  const handleLoadUser = async () => {
    try {
      const { data } = await axios.get<IUser>("/api/users/" + params.id);

      if (data) {
        dispatch(setUserInfo(data));
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

  const handleChangeImage = (file: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой");
      return;
    }

    dispatch(updateUserInfoField({ name: "imageFile", value: file }));
  };

  useEffect(() => {
    if (!window.location.hash) {
      handleLoadUser();
    }
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

export default UserItemPage;
