"use client";

import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import axios from "axios";
import { Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "@/app/utils/supabase";
import CustomPasswordInput from "@/app/components/Shared/CustomPasswordInput/CustomPasswordInput";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";

const SecurityPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isUpdating = searchParams.get("update-password") === "true";
  const isModalOpen = searchParams.get("reset-modal") === "open";

  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleRequestReset = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/users/${id}/reset-password`);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Ошибка сервера");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) return toast.error("Минимум 6 символов");
    setIsLoading(true);

    try {
      await axios.patch("/api/users/password/update", {
        password: newPassword,
      });
      toast.success("Пароль изменен!");
      // Закрываем модалку, очищая URL
      router.push(window.location.pathname);
    } catch (err: any) {
      toast.error("Ошибка сессии. Запросите ссылку снова.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      // 1. Проверяем, есть ли живая сессия (она могла установиться автоматически)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Сессия активна, можно менять пароль");
        return;
      }

      // 2. Если сессии нет, но есть код — пробуем обменять один раз
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          // Если и тут ошибка, значит ссылка реально «битая»
          toast.error("Ссылка невалидна или истекла");
          router.replace(window.location.pathname);
        }
      }
    };

    if (isUpdating) {
      checkSession();
    }
  }, [isUpdating, searchParams]);

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Безопасность
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-neutral-400"
      >
        Настройки безопасности пользователя
      </motion.p>

      <section>
        {/* Кнопка просто шлет письмо */}
        <CustomButton onClick={handleRequestReset} label="Сбросить пароль" />

        {/* Модалка откроется ТОЛЬКО после перехода из письма */}
        <CustomModal
          isOpen={isModalOpen}
          onClose={() => router.push(window.location.pathname)}
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Установка нового пароля</h3>
            <input
              type="password"
              placeholder="Новый пароль"
              className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <CustomButton
              onClick={handleUpdatePassword}
              isLoading={isLoading}
              label="Сохранить"
            />
          </div>
        </CustomModal>
      </section>
    </section>
  );
};

export default SecurityPage;
