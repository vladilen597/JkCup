"use client";

import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import { useAppSelector } from "@/app/utils/store/hooks";
import Title from "@/app/components/Title/Title";
import { SubmitEvent, useState } from "react";
import { ChevronDown, NotebookPen } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import FeedbackList from "@/app/components/FeedbackList/FeedbackList";
import axios from "axios";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isFeedbacksExpanded, setIsFeedbacksExpanded] = useState(false);
  const [text, setText] = useState("");

  const { currentUser } = useAppSelector((state) => state.user);

  const handleToggleExpanded = () => {
    setIsFeedbacksExpanded((prevState) => !prevState);
  };

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <NotebookPen className="h-8 w-8 text-primary" />
            <Title title="Обратная связь" />
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Здесь вы можете оставить вашу обратную связь о турнирах,
            предложения, баг-репорты на сайте и т.д.
          </p>
        </div>
      </motion.div>

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
      ) : (
        <motion.form
          className="mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          onSubmit={handleSendForm}
        >
          <label>
            <span>Введите ваше обращение</span>
            <textarea
              className="mt-1 p-2 w-full border border-border rounded-lg bg-muted min-h-100 outline-0 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
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
      )}
      {(currentUser.role === "admin" || currentUser.role === "superadmin") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 w-full overflow-hidden bg-muted border border-border rounded-lg"
        >
          <button
            className="w-full flex items-center justify-between p-3"
            onClick={handleToggleExpanded}
          >
            <span>Показать обращения</span>
            <motion.div
              animate={{ rotate: isFeedbacksExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown />
            </motion.div>
          </button>
          {isFeedbacksExpanded && <FeedbackList />}
        </motion.div>
      )}
    </main>
  );
};

export default page;
