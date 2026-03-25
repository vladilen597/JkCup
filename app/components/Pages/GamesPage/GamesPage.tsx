"use client";

import DeleteGameModalContent from "@/app/components/DeleteGameModalContent/DeleteGameModalContent";
import AddNewGameModal from "@/app/components/AddNewGameModal/AddNewGameModal";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import UserShimmer from "@/app/components/UserShimmer/UserShimmer";
import GameLine from "@/app/components/Shared/GameLine/GameLine";
import { setGames } from "@/app/utils/store/gamesSlice";
import Title from "@/app/components/Title/Title";
import { Gamepad2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import CustomSkeleton from "@/app/components/Shared/CustomSkeleton/CustomSkeleton";
import PageHero from "@/app/components/Shared/PageHero/PageHero";

const GamesPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState("");
  const dispatch = useAppDispatch();
  const { games } = useAppSelector((state) => state.games);
  const { currentUser } = useAppSelector((state) => state.user);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setGameId("");
  };

  const handleOpenDeleteModal = (gameId: string) => {
    setGameId(gameId);
  };

  const handleLoadGames = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/games");
      dispatch(setGames(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ошибка загрузки игр");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, []);

  if (error) {
    return <div className="text-center py-12 text-destructive">{error}</div>;
  }

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-12">
      <PageHero
        title="Игры"
        description="Все зарегистрированные на сайте игры"
        icon={<Gamepad2 className="h-8 w-8 text-primary" />}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-mono ">Список игр</span>
            <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {games.length}
            </span>
          </h2>
          {(currentUser?.role === "admin" ||
            currentUser?.role === "superadmin") && (
            <CustomButton
              icon={<Plus />}
              label="Добавить"
              onClick={handleOpenModal}
            />
          )}
        </div>

        {loading ? (
          <ul className="leading-0 mt-6 grid grid-cols-4 gap-2">
            <CustomSkeleton height={134} />
            <CustomSkeleton height={134} />
            <CustomSkeleton height={134} />
            <CustomSkeleton height={134} />
          </ul>
        ) : (
          <ul className="mt-6 grid grid-cols-4 gap-2">
            {games.map((game) => (
              <GameLine
                key={game.id}
                {...game}
                onDeleteClick={() => handleOpenDeleteModal(game.id)}
              />
            ))}
          </ul>
        )}
      </motion.section>

      <CustomModal
        contentClassName="max-w-xl"
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      >
        <AddNewGameModal onClose={handleCloseModal} />
      </CustomModal>

      <CustomModal isOpen={!!gameId} onClose={handleCloseDeleteModal}>
        <DeleteGameModalContent
          gameId={gameId}
          onClose={handleCloseDeleteModal}
        />
      </CustomModal>
    </main>
  );
};

export default GamesPage;
