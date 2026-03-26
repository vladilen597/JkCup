"use client";

import { motion } from "framer-motion";
import Steam from "../Icons/Steam";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import Image from "next/image";
import { Check, ExternalLink, MousePointer2, Unlink } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { setCurrentUser, setUserInfo } from "@/app/utils/store/userSlice";
import { toast } from "react-toastify";
import CustomButton, {
  BUTTON_STYLES,
} from "../Shared/CustomButton/CustomButton";
import CustomSkeleton from "../Shared/CustomSkeleton/CustomSkeleton";

const SteamIntegrationWidget = () => {
  const { currentUser, userInfo } = useAppSelector((state) => state.user);
  const [isUnlinkLoading, setIsUnlinkLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLinkSteam = () => {
    window.location.href = `/api/users/${currentUser?.id}/steam`;
  };

  const handleUnlinkSteam = async () => {
    setIsUnlinkLoading(true);

    try {
      const { data: updatedProfile } = await axios.post(
        `/api/users/${userInfo?.id}/steam/unlink`,
      );

      dispatch(setCurrentUser(updatedProfile));
      dispatch(setUserInfo(updatedProfile));

      toast.success("Steam успешно отвязан");
    } catch (error) {
      console.error("Ошибка отвязки Steam:", error);
      toast.error("Не удалось отвязать Steam");
    } finally {
      setIsUnlinkLoading(false);
    }
  };

  useEffect(() => {
    if (window) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("status") === "steam_success") {
        const updateLocalData = async () => {
          const { data: freshUser } = await axios.get(
            `/api/users/${userInfo.id}`,
          );

          dispatch(setCurrentUser(freshUser));
          dispatch(setUserInfo(freshUser));

          window.history.replaceState({}, "", window.location.pathname);
          toast.success("Steam синхронизирован!");
        };

        updateLocalData();
      }
    }
  }, [window.location.search]);

  const isConnected = !!userInfo.steam_id && !!userInfo.steam_name;
  const isOwnProfile = currentUser?.id === userInfo.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full"
    >
      <div className="rounded-t-xl bg-[#171a21] px-5 py-4 flex items-center gap-3 border border-border border-b-0">
        <Steam className="w-6 h-6 text-[#66c0f4]" />
        <h2 className="text-white font-semibold text-base tracking-tight">
          Steam
        </h2>
      </div>

      {!userInfo.id ? (
        <div className="leading-0 h-full overflow-hidden rounded-b-xl">
          <CustomSkeleton className="h-full" borderRadius={0} height={220} />
        </div>
      ) : (
        <div className="rounded-b-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            {isOwnProfile
              ? isConnected
                ? "Steam привязан к вашему профилю"
                : "Привяжите Steam, чтобы отображать свой игровой профиль"
              : "Игровой профиль пользователя в Steam"}
          </p>

          {isConnected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <div className="flex items-center gap-4 rounded-lg bg-[#131316]/60 p-4">
                <Image
                  src={userInfo.steam_avatar}
                  className="h-12 w-12 rounded-sm"
                  width={48}
                  height={48}
                  alt="Discord image"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate">
                      {userInfo.steam_name}
                    </span>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-sm text-muted-foreground truncate block">
                    ID: {userInfo.steam_id}
                  </span>
                </div>

                <a
                  href={userInfo.steam_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-[#1c1c20] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {isOwnProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-4"
                >
                  <button
                    className="flex items-center w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 p-2 rounded-lg justify-center transition-colors cursor-pointer"
                    disabled={isUnlinkLoading}
                    onClick={handleUnlinkSteam}
                  >
                    <Unlink className="w-4 h-4" />
                    {isUnlinkLoading ? "Отвязка…" : "Отвязать Steam"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-20 items-center gap-3 text-muted-foreground bg-zinc-900/30 p-4 rounded-xl border border-dashed border-zinc-800"
              >
                <MousePointer2 className="w-5 h-5 opacity-30" />
                <span className="text-sm">Профиль Steam не подключен</span>
              </motion.div>
              {isOwnProfile && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <CustomButton
                    className="w-full justify-center border-white! hover:bg-neutral-500/5 bg-transparent text-white"
                    label="Привязать аккаунт Steam"
                    buttonStyle={BUTTON_STYLES.OUTLINE}
                    icon={<Steam className="h-5 w-5 text-white" />}
                    onClick={handleLinkSteam}
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SteamIntegrationWidget;
