"use client";

import CreateTournamentModal from "@/app/components/CreateTournamentModal/CreateTournamentModal";
import ArchivedTournament from "@/app/components/ArchivedTournament/ArchivedTournament";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { IArchivedTournament, ITournament } from "@/app/lib/types";
import Title from "@/app/components/Title/Title";
import {
  addTournament,
  setTournaments,
} from "@/app/utils/store/tournamentsSlice";
import { useEffect, useState } from "react";
import { Archive } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";
import PageHero from "@/app/components/Shared/PageHero/PageHero";

const page = () => {
  const [archivedTournaments, setArchivedTournaments] = useState<
    IArchivedTournament[]
  >([]);
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);

  const canCreateTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const handleLoadArchive = async () => {
    try {
      const { data } = await axios.get("/api/tournaments/archive");
      setArchivedTournaments(data);
    } catch (error) {
      toast.error("Ошибка загрузки архива");
    }
  };

  const handleCreateTournament = (data: ITournament) => {
    dispatch(addTournament(data));
  };

  useEffect(() => {
    handleLoadArchive();
  }, []);

  const handleCloseCreateTournamentModal = () => {
    setIsCreateTournamentModalOpen(false);
  };

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <PageHero
        title="Архив"
        description="Просматривайте турниры, победителей и участников прошедших ранее турниров!"
        icon={<Archive className="h-8 w-8 text-primary" />}
      />
      <ul className="space-y-3">
        {archivedTournaments?.map((tournament, index) => {
          const isTeam = tournament.type === "team";
          const usersAmount = tournament.registrations?.length || 0;
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
            <ArchivedTournament
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
