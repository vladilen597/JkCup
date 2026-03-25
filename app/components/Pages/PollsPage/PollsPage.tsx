"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  Plus,
  Trash2,
  Clock,
  Users,
  ChartBarDecreasing,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import CreatePollModal from "@/app/components/CreatePollModal/CreatePollModal";
import { useAppSelector } from "@/app/utils/store/hooks";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import PageHero from "@/app/components/Shared/PageHero/PageHero";
import Poll from "./Poll/Poll";
import { IGame, IGlobalPoll } from "@/app/lib/types";

const PollsPage = () => {
  const [polls, setPolls] = useState<IGlobalPoll[]>([]);
  const [activePoll, setActivePoll] = useState<IGlobalPoll>(null);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAppSelector((user) => user.user);

  const canCreatePoll = currentUser?.role === "superadmin";

  const handleClosePoll = async (id: string) => {
    try {
      const { data } = await axios.patch(`/api/admin/polls/${id}/close`);
      const closedActivePoll = { ...activePoll };
      closedActivePoll.is_active = false;
      setPolls((prevState) => [closedActivePoll, ...prevState]);
      setActivePoll(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error);
    }
  };

  const handleClickDelete = (id: string) => {
    setPolls((prevState) => prevState.filter((poll) => poll.id !== id));
  };

  const fetchData = async () => {
    try {
      const { data: games } = await axios.get<IGame[]>("/api/games");
      const { data } = await axios.get<IGlobalPoll[]>("/api/polls");
      setActivePoll(data.find((poll) => poll.is_active));
      setPolls(data.filter((poll) => !poll.is_active));
      setAllGames(games);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 pb-20">
      <PageHero
        title="Голосования"
        description="Следите за голосованиями за игры на турнирах"
        icon={<Vote className="h-8 w-8 text-primary" />}
        controls={
          canCreatePoll && (
            <CustomButton
              icon={<Plus className="h-5 w-5" />}
              label="Создать голосование"
              onClick={() => setIsCreateModalOpen(true)}
            />
          )
        }
      />

      {activePoll ? (
        <div className="">
          <h4 className="text-sm font-mono! font-bold text-primary w-fit bg-primary/10 px-2 py-0.5 rounded-full">
            Активное голосование
          </h4>
          <div className="mt-2">
            <Poll {...activePoll} onCloseClick={handleClosePoll} />
          </div>
        </div>
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
      <AnimatePresence mode="wait">
        {polls.length && (
          <section className="">
            <h4 className="mt-4 text-sm font-mono! w-fit font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              История голосований
            </h4>
            <ul className="mt-2 space-y-2">
              {polls.map((poll) => (
                <Poll
                  key={poll.id}
                  {...poll}
                  onDelete={() => handleClickDelete(poll.id)}
                />
              ))}
            </ul>
          </section>
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
            setActivePoll(newPoll);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default PollsPage;
