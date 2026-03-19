"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, X, Users } from "lucide-react";
import axios from "axios";
import { supabase } from "@/app/utils/supabase";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PollWidget = ({ currentUser }: { currentUser: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pollData, setPollData] = useState<any>(null);
  const [userVoted, setUserVoted] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null); // Храним ID выбранной игры

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/polls/active?t=${Date.now()}`);
      setPollData(data);

      if (currentUser && data?.poll) {
        const { data: vote, error } = await supabase
          .from("global_votes")
          .select("game_id")
          .eq("poll_id", data.poll.id)
          .eq("profile_id", currentUser.id)
          .maybeSingle();

        if (error) console.error("Ошибка проверки голоса:", error.message);

        if (vote) {
          setUserVoted(true);
          setSelectedGameId(vote.game_id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("poll-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "global_votes" }, // Слушаем все события для синхронизации
        () => fetchData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const handleVote = async (gameId: string) => {
    if (!currentUser) return alert("Войдите, чтобы проголосовать");
    if (userVoted) return;

    // Optimistic UI
    setUserVoted(true);
    setSelectedGameId(gameId);
    setPollData((prev: any) => ({
      ...prev,
      totalVotes: (prev?.totalVotes || 0) + 1,
      stats: {
        ...prev?.stats,
        [gameId]: (prev?.stats[gameId] || 0) + 1,
      },
    }));

    try {
      await axios.post(`/api/polls/active/vote`, {
        pollId: pollData.poll.id,
        gameId,
        userId: currentUser.id,
      });
      fetchData();
    } catch (e) {
      setUserVoted(false);
      setSelectedGameId(null);
      fetchData();
      console.error(e);
    }
  };

  if (!pollData?.poll) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/30">
              <div className="flex flex-col overflow-hidden">
                <h4 className="text-sm font-bold truncate pr-4">
                  {pollData.poll.title}
                </h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  {userVoted ? "Результаты" : "Ваш выбор"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-100 overflow-y-auto custom-scrollbar">
              {pollData.poll.options?.map((opt: any) => {
                const gameId = opt.game.id;
                const votes = Number(pollData.stats[opt.game.id] || 0);
                const total = Number(pollData.totalVotes || 0);
                const percent = total > 0 ? (votes / total) * 100 : 0;
                const isMyChoice = selectedGameId === gameId;

                return (
                  <div
                    key={opt.id}
                    onClick={() => !userVoted && handleVote(gameId)}
                    className={cn(
                      "relative group rounded-xl border p-2.5 transition-all overflow-hidden",
                      userVoted
                        ? "cursor-default border-zinc-800"
                        : "cursor-pointer border-zinc-800 hover:border-primary/50 bg-zinc-900/50 hover:bg-zinc-800/50",
                      isMyChoice && "border-primary/30",
                    )}
                  >
                    {userVoted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{
                          type: "spring",
                          stiffness: 50,
                          damping: 15,
                        }}
                        className={cn(
                          "absolute inset-0 z-0",
                          isMyChoice ? "bg-primary/20" : "bg-white/5",
                        )}
                      />
                    )}

                    <div className="relative z-10 flex justify-between items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Image
                          width={28}
                          height={28}
                          src={opt.game.image_url}
                          className="w-7 h-7 rounded-sm object-cover shadow-sm"
                          alt=""
                        />
                        <span className="text-sm font-medium truncate">
                          {opt.game.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <div className="flex items-center gap-1.5">
                          <Users
                            className={cn(
                              "w-3 h-3",
                              isMyChoice ? "text-primary/70" : "text-zinc-500",
                            )}
                          />
                          <span className="text-[11px] font-bold text-zinc-400">
                            {votes}
                          </span>
                        </div>
                        {userVoted && (
                          <span
                            className={cn(
                              "text-[11px] font-mono font-bold",
                              isMyChoice ? "text-primary" : "text-zinc-500",
                            )}
                          >
                            {Math.round(percent)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                Всего голосов:
              </span>
              <span className="text-xs font-mono font-bold text-zinc-300">
                {pollData.totalVotes}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group z-50"
      >
        <Vote className="w-7 h-7 text-black" />

        {!userVoted && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-zinc-950 items-center justify-center text-[10px] font-bold text-white">
              !
            </span>
          </span>
        )}
      </button>
    </div>
  );
};

export default PollWidget;
