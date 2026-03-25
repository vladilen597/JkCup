"use client";

import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import { useAppSelector } from "@/app/utils/store/hooks";
import Title from "@/app/components/Title/Title";
import { SubmitEvent, useState } from "react";
import { ChevronDown, MessageCircle, NotebookPen } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import FeedbackList from "@/app/components/FeedbackList/FeedbackList";
import axios from "axios";
import PageHero from "@/app/components/Shared/PageHero/PageHero";

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [text, setText] = useState("");

  const { currentUser } = useAppSelector((state) => state.user);

  const handleSendForm = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/feedback", {
        text,
      });
      setIsFeedbackSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <PageHero
        title="Обратная связь"
        description="Оставьте ваш отзыв о турнире, найденной ошибке на сайте или просто поделитель эмоциями"
        icon={<NotebookPen className="h-8 w-8 text-primary" />}
      />

      <div className="flex items-start gap-4 bg-card border border-border p-4 rounded-lg">
        <div className="w-full">
          {isFeedbackSent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto text-center"
            >
              <h2 className="text-xl">Ваша форма успешно отправлена!</h2>
              <p className="mt-2 text-neutral-400">Спасибо за обращение</p>
              <Link href="/tournaments" className="mt-2 text-xs underline">
                Вернуться на главную
              </Link>
            </motion.div>
          ) : currentUser?.id ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              onSubmit={handleSendForm}
            >
              <label>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-background border border-border w-fit">
                    <NotebookPen />
                  </div>
                  Введите ваше обращение
                </div>
                <textarea
                  className="mt-1 p-2 w-full border border-border rounded-lg bg-background min-h-100 outline-0 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
              <CustomButton
                className="mt-1 w-full justify-center py-3 text-sm"
                type="submit"
                isLoading={isLoading}
                label="Отправить"
              />
            </motion.form>
          ) : (
            <div className="border-dashed border rounded-lg p-4">
              <p className="text-neutral-400 text-center">
                Вам нужно войти в ваш аккаунт чтобы оставить отзыв
              </p>
            </div>
          )}
        </div>
        {(currentUser?.role === "admin" ||
          currentUser?.role === "superadmin") && (
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-background border border-border w-fit">
                  <MessageCircle />
                </div>
                Отзывы пользователей
              </div>
              <div className="mt-1">
                <FeedbackList />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ContactPage;
