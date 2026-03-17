"use client";

import CreateTournamentModal from "@/app/components/CreateTournamentModal/CreateTournamentModal";
import TournamentStats from "@/app/components/TournamentStats/TournamentStats";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  addTournament,
  setTournaments,
} from "@/app/utils/store/tournamentsSlice";
import Title from "@/app/components/Title/Title";
import Tournament from "@/app/utils/Tournament";
import { ITournament } from "@/app/lib/types";
import { Trophy, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";

const page = () => {
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);

  const canCreateTournament =
    user?.role === "admin" || user?.role === "superadmin";

  const handleLoadTournaments = async () => {
    try {
      const { data } = await axios.get("/api/tournaments");
      dispatch(setTournaments(data));
    } catch (error) {
      toast.error("Ошибка загрузки турниров");
    }
  };

  const handleCreateTournament = (data: ITournament) => {
    dispatch(addTournament(data));
  };

  useEffect(() => {
    handleLoadTournaments();
  }, []);

  const handleCloseCreateTournamentModal = () => {
    setIsCreateTournamentModalOpen(false);
  };

  const filteredTournaments = tournaments?.filter((tournament: ITournament) => {
    if (!tournament.hidden) return true;

    return user.role !== "user";
  });

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <Title title="Турниры" />
            </div>

            {canCreateTournament && (
              <CustomButton
                icon={<Plus className="h-5 w-5" />}
                label="Создать турнир"
                onClick={() => setIsCreateTournamentModalOpen(true)}
              />
            )}
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Следите и участвуйте в турнирах
          </p>
        </div>
        <div className="mt-8">
          <TournamentStats />
        </div>
      </motion.div>
      <ul className="space-y-3">
        {filteredTournaments?.map((tournament, index) => {
          const isTeam = tournament.type === "team";
          const usersAmount = isTeam
            ? tournament?.teams?.length
            : tournament?.registrations?.length || 0;
          const teamsAmount = tournament?.teams?.length || 0;
          const fillPercent = isTeam
            ? Math.round((teamsAmount / tournament.max_teams) * 100)
            : Math.round((usersAmount / tournament.max_players) * 100);
          const isFull = isTeam
            ? teamsAmount >= tournament.max_teams
            : usersAmount >= tournament.max_players;
          const maxPlayers = isTeam
            ? tournament.max_teams
            : tournament.max_players;

          return (
            <Tournament
              key={tournament.id}
              index={index}
              {...tournament}
              currentPlayers={usersAmount}
              maxPlayers={maxPlayers}
              isTeam={isTeam}
              isFull={isFull}
              fillPercent={fillPercent}
            />
          );
        })}
      </ul>
      {canCreateTournament && (
        <CustomModal
          isOpen={isCreateTournamentModalOpen}
          onClose={handleCloseCreateTournamentModal}
        >
          <CreateTournamentModal
            onClose={handleCloseCreateTournamentModal}
            onSubmit={handleCreateTournament}
          />
        </CustomModal>
      )}
    </main>
  );
};

export default page;
