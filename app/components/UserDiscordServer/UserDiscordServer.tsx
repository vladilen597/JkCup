import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Cross, FileQuestion, X } from "lucide-react";
import CustomSkeleton from "../Shared/CustomSkeleton/CustomSkeleton";
import { motion } from "motion/react";

interface UserServerData {
  isOnServer: boolean | null;
  message: string;
  serverIcon?: string;
  serverName?: string;
}

const UserDiscordServer = ({ user_id }: { user_id: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserServerData>({
    isOnServer: null,
    message: "Загрузка...",
  });

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/admin/users/${user_id}/discord/check`);
      setData(res.data);
    } catch (error) {
      setData({ isOnServer: false, message: "Ошибка проверки" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user_id]);

  const isSuccess = data.isOnServer;
  const isNotLinked = data.message === "Юзер не подключил дискорд";

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-background p-4 transition-all hover:bg-background-500/50 shadow-lg">
      <div className="flex items-center gap-4">
        <Image
          src={"/logo.svg"}
          width={48}
          height={48}
          alt="Server"
          className="w-12 h-12 object-cover rounded-xl"
        />

        <div className="flex flex-col gap-1 leading-0">
          {isLoading ? (
            <CustomSkeleton height={20} width={70} />
          ) : (
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              JkCup
              {isSuccess ? (
                <Check className="text-green-400 w-4 h-4" />
              ) : isNotLinked ? (
                <X className="text-neutral-400 w-4 h-4" />
              ) : (
                <X className="text-red-400 w-4 h-4" />
              )}
            </h4>
          )}
          {isLoading ? (
            <CustomSkeleton height={20} width={220} />
          ) : (
            <div className="text-neutral-400 text-xs font-mono">
              {isSuccess
                ? "Пользователь состоит на сервере"
                : isNotLinked
                  ? "Пользователь не подключил Discord"
                  : "Пользователь не состоит на сервере"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDiscordServer;
