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

const GamesPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState("");
  const dispatch = useAppDispatch();
  const { games } = useAppSelector((state) => state.games);
  const { user: currentUser } = useAppSelector((state) => state.user);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <Title title="Игры" />
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Все зарегистрированные на сайте игры
          </p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Gamepad2 className="h-6 w-6 text-primary" />
            Список игр ({games.length})
          </h2>
          {(currentUser.role === "admin" ||
            currentUser.role === "superadmin") && (
            <CustomButton
              icon={<Plus />}
              label="Добавить"
              onClick={handleOpenModal}
            />
          )}
        </div>

        <ul className="mt-6 grid grid-cols-4 gap-2">
          {loading ? (
            <CustomSkeleton count={4} />
          ) : (
            games.map((game) => (
              <GameLine
                key={game.id}
                {...game}
                onDeleteClick={() => handleOpenDeleteModal(game.id)}
              />
            ))
          )}
        </ul>
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
