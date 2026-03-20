"use client";

import Discord from "@/app/components/Icons/Discord";
import ConnectDiscord from "@/app/components/Integrations/Discord/ConnectDiscord/ConnectDiscord";
import CustomButton, {
  BUTTON_STYLES,
} from "@/app/components/Shared/CustomButton/CustomButton";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { setCurrentUser } from "@/app/utils/store/userSlice";
import { supabase } from "@/app/utils/supabase";
import axios from "axios";
import { Check, ExternalLink, MessageCircle, Unlink } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { userInfo, currentUser } = useAppSelector((state) => state.user);
  const [isUnlinkLoading, setIsUnlinkLoading] = useState(false);
  const dispatch = useAppDispatch();

  const isConnected = !!userInfo.discord_full_name && !!userInfo.discord_id;

  console.log(isConnected, "isConnected");
  const isOwnProfile = currentUser.id === userInfo.id;

  const handleUnlink = async () => {
    setIsUnlinkLoading(true);

    try {
      const { data: updatedProfile } = await axios.post(
        `/api/users/${userInfo.id}/discord/unlink`,
      );

      dispatch(setCurrentUser(updatedProfile));

      toast.success("Discord успешно отвязан");
    } catch (error) {
      console.error("Ошибка отвязки:", error);
      toast.error("Не удалось отвязать аккаунт");
    } finally {
      setIsUnlinkLoading(true);
    }
  };

  useEffect(() => {
    const syncDiscordData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const discordData = user?.identities?.find(
        (id) => id.provider === "discord",
      );

      if (discordData) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const discordId = user?.user_metadata.provider_id;
        const discordGlobalName = user?.user_metadata.custom_claims.global_name;
        const discordAvatar = user?.user_metadata.avatar_url;
        const discordName = user?.user_metadata.full_name;

        try {
          await axios.patch(`/api/users/${user.id}/discord`, {
            discord_global_name: discordGlobalName,
            discord_full_name: discordName,
            discord_id: discordId,
            discord_avatar: discordAvatar,
          });
        } catch (e) {
          console.error("Ошибка синхронизации", e);
        }
      }
    };

    syncDiscordData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="rounded-t-xl bg-[#6266ec] px-5 py-4 flex items-center gap-3">
        <Discord className="w-6 h-6" fill="white" />
        <h2 className="text-white font-semibold text-base tracking-tight">
          Интеграция Discord
        </h2>
      </div>

      <div className="rounded-b-xl border border-t-0 border-border bg-card p-5">
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {isOwnProfile
            ? isConnected
              ? "Discord подключён к вашему аккаунту"
              : "Подключите Discord, чтобы напарники легко могли вас найти"
            : "Профиль Discord пользователя"}
        </p>

        {isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 rounded-lg bg-[#131316]/60 p-4">
              <Image
                src={userInfo.discord_avatar}
                className="h-12 w-12 rounded-full"
                width={48}
                height={48}
                alt="Discord image"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground truncate">
                    {userInfo.discord_global_name}
                  </span>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <span className="text-sm text-muted-foreground truncate block">
                  {userInfo.discord_full_name}
                </span>
              </div>

              <a
                href={`https://discord.com/users/${userInfo.discord_id}`}
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
                  className="flex items-center w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 p-2 rounded-lg justify-center transition-colors"
                  disabled={isUnlinkLoading}
                  onClick={handleUnlink}
                >
                  <Unlink className="w-4 h-4" />
                  {isUnlinkLoading ? "Отвязка…" : "Отвязать Discord"}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div>
            {isOwnProfile ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <ConnectDiscord user_id={currentUser.id} />
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground py-3">
                <MessageCircle className="w-5 h-5 opacity-50" />
                <span className="text-sm">
                  Пользователь ещё не подключил Discord
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default page;
