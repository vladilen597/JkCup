"use client";

import CustomSkeleton from "@/app/components/Shared/CustomSkeleton/CustomSkeleton";
import { useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const declOfNum = (n, titles) => {
  n = Math.abs(n) % 100;
  var n1 = n % 10;

  if (n > 10 && n < 20) {
    return titles[2];
  }
  if (n1 > 1 && n1 < 5) {
    return titles[1];
  }
  if (n1 == 1) {
    return titles[0];
  }

  return titles[2];
};

const getMembershipTime = (
  createdAt: string | number | Date | undefined,
): string => {
  if (!createdAt) return "С нами недавно";

  const diffInMs = Date.now() - new Date(createdAt).getTime();

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const plural = (n: number, forms: [string, string, string]) => {
    const pr = new Intl.PluralRules("ru-RU");
    const rule = pr.select(n);
    if (rule === "one") return forms[0];
    if (rule === "few") return forms[1];
    return forms[2];
  };

  if (days > 0) {
    return `${days} ${plural(days, ["день", "дня", "дней"])}`;
  }
  if (hours > 0) {
    return `${hours} ${plural(hours, ["час", "часа", "часов"])}`;
  }
  if (minutes > 0) {
    return `${minutes} ${plural(minutes, ["минуту", "минуты", "минут"])}`;
  }

  return "меньше минуты";
};

const page = () => {
  const { userInfo } = useAppSelector((state) => state.user);
  const [stats, setStats] = useState<{
    registrations: number;
    team_membership: number;
    judged_tournaments: number;
  }>();
  const { id } = useParams();

  const handleLoadUserStats = async () => {
    try {
      const { data } = await axios.get(`/api/users/${id}/stats`);
      console.log(stats);
      setStats(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Ошибка загрузки статистики пользователя",
      );
    }
  };

  useEffect(() => {
    handleLoadUserStats();
  }, []);

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Обзор
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-neutral-400"
      >
        Вся информация о пользователе
      </motion.p>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span></span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {userInfo.id ? (
            <div className="flex flex-col justify-between bg-card p-3 h-24 rounded-lg">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-mono tracking-widest text-muted-foreground"
              >
                Зарегистрирован на сайте
              </motion.span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-mono"
              >
                С нами уже {getMembershipTime(userInfo?.created_at)}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-mono tracking-widest text-muted-foreground"
              >
                {format(userInfo?.created_at, "dd.MM.yyyy HH:mm")}
              </motion.p>
            </div>
          ) : (
            <div className="leading-0 block h-24">
              <CustomSkeleton className="h-full" />
            </div>
          )}
          <div>
            {userInfo.id ? (
              <div className="flex flex-col justify-between bg-card p-3 h-24 rounded-lg">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs font-mono tracking-widest text-muted-foreground"
                >
                  Был судьёй на
                </motion.span>
                <span className="">{stats?.judged_tournaments}</span>
                <span className="text-xs font-mono tracking-widest text-muted-foreground">
                  {declOfNum(stats?.judged_tournaments, [
                    "турнире",
                    "турнирах",
                    "турнирах",
                  ])}
                </span>
              </div>
            ) : (
              <div className="leading-0 block h-24">
                <CustomSkeleton className="h-full" />
              </div>
            )}
          </div>
          <div>
            {userInfo.id ? (
              <div className="flex flex-col justify-between bg-card p-3 h-24 rounded-lg">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs font-mono tracking-widest text-muted-foreground"
                >
                  Участвовал в
                </motion.span>
                <span className="">{stats?.registrations}</span>
                <span className="text-xs font-mono tracking-widest text-muted-foreground">
                  {declOfNum(stats?.judged_tournaments, [
                    "турнире",
                    "турнирах",
                    "турнирах",
                  ])}
                </span>
              </div>
            ) : (
              <div className="leading-0 block h-24">
                <CustomSkeleton className="h-full" />
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </section>
  );
};

export default page;
