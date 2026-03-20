"use client";
import { useEffect, useState } from "react";
import Title from "@/app/components/Title/Title";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Plus, Trash2, Clock, Users } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import CreatePollModal from "@/app/components/CreatePollModal/CreatePollModal";
import { useAppSelector } from "@/app/utils/store/hooks";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";

const PollsPage = () => {
  const [pollData, setPollData] = useState<any>(null);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAppSelector((user) => user.user);

  const canCreatePoll = currentUser.role === "superadmin";

  const fetchData = async () => {
    try {
      const [pollRes, gamesRes] = await Promise.all([
        axios.get("/api/polls/active"),
        axios.get("/api/games"),
      ]);
      setPollData(pollRes.data);
      setAllGames(gamesRes.data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePoll = async () => {
    if (!pollData?.poll?.id || !confirm("Удалить это голосование?")) return;
    try {
      await axios.delete(`/api/admin/polls/${pollData.poll.id}`);
      setPollData(null);
      toast.success("Голосование удалено");
    } catch (error) {
      toast.error("Ошибка при удалении");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Vote className="h-8 w-8 text-primary" />
              <Title title="Голосования" />
            </div>

            {canCreatePoll && (
              <CustomButton
                icon={<Plus className="h-5 w-5" />}
                label="Создать голосование"
                onClick={() => setIsCreateModalOpen(true)}
              />
            )}
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Следите за голосованиями за игры на турнирах
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="text-center py-20 text-zinc-500">
            Загрузка данных...
          </div>
        ) : pollData?.poll ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] text-primary uppercase font-black tracking-widest">
                      Live Poll
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold">{pollData.poll.title}</h2>
                </div>
                <button
                  onClick={handleDeletePoll}
                  className="p-3 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-2xl transition-all"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap gap-6 mb-10 text-zinc-400 text-sm">
                <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-primary" />
                  До: {new Date(pollData.poll.ends_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                  Всего голосов: {pollData.totalVotes}
                </div>
              </div>

              <div className="space-y-6">
                {pollData.poll.options?.map((opt: any) => {
                  const votes = pollData.stats[opt.game.id] || 0;
                  const percent =
                    pollData.totalVotes > 0
                      ? (votes / pollData.totalVotes) * 100
                      : 0;

                  return (
                    <div key={opt.id} className="relative">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <div className="flex items-center gap-3">
                          <img
                            src={opt.game.image_url}
                            className="w-8 h-8 rounded-lg object-cover"
                            alt=""
                          />
                          <span className="font-semibold text-zinc-200">
                            {opt.game.name}
                          </span>
                        </div>
                        <span className="font-mono text-sm text-zinc-400">
                          {Math.round(percent)}% ({votes})
                        </span>
                      </div>
                      <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-zinc-900/20 border-2 border-dashed border-zinc-800/50 p-4 rounded-lg">
            <Vote className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">
              Активных голосований не найдено
            </p>
            {canCreatePoll && (
              <p className="text-zinc-600 text-sm mt-1">
                Нажмите «Создать опрос», чтобы запустить новое голосование
              </p>
            )}
          </div>
        )}
      </AnimatePresence>

      <CustomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <CreatePollModal
          allGames={allGames}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={(newPoll: any) => {
            setPollData({ poll: newPoll, stats: {}, totalVotes: 0 });
          }}
        />
      </CustomModal>
    </div>
  );
};

export default PollsPage;
