"use client";

import CreateTournamentModal from "@/app/components/CreateTournamentModal/CreateTournamentModal";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { ISelectOption } from "@/app/components/Shared/CustomSelect/CustomSelect";
import Title from "@/app/components/Title/Title";
import TournamentStats from "@/app/components/TournamentStats/TournamentStats";
import { db } from "@/app/utils/firebase";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  ITournament,
  setTournaments,
  updateTournamentStatus,
} from "@/app/utils/store/tournamentsSlice";
import Tournament from "@/app/utils/Tournament";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trophy, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const page = () => {
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    game: "",
    type: {
      id: 2,
      value: "single",
      label: "Одиночный",
    },
    description: "",
    max_players: 6,
    max_teams: 6,
    players_per_team: 2,
    start_date: "",
    rewards: [{ id: uuidv4(), value: "" }],
    status: "open",
    duration: 0,
  });

  const canCreateTournament =
    user?.role === "admin" || user?.role === "superadmin";

  const handleLoadTournaments = async () => {
    try {
      const { data } = await axios.get("/api/tournaments");
      data.forEach((tournament: ITournament) => {
        if (
          tournament.start_date &&
          new Date(tournament.start_date) < new Date()
        ) {
          const tournamentRef = doc(db, "tournaments", tournament.id);
          updateDoc(tournamentRef, {
            status: "about_to_start",
          });
          dispatch(
            updateTournamentStatus({
              tournamentId: tournament.id,
              status: "about_to_start",
            }),
          );
        }
      });
      dispatch(setTournaments(data));
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    }
  };

  const handleAddReward = () => {
    setFormData((prevState: any) => ({
      ...prevState,
      rewards: [...formData.rewards, { id: uuidv4(), value: "" }],
    }));
  };

  const handleUpdateTournamentType = (value: ISelectOption) => {
    setFormData((prevState: any) => ({
      ...prevState,
      type: value,
    }));
  };

  useEffect(() => {
    handleLoadTournaments();
  }, []);

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateTournament) return;

    try {
      const isBracket = formData.type.value === "bracket";

      const newTournamentBase = {
        ...formData,
        creator: user,
        status: "open",
        users: [],
        teams: [],
        judges: [],
        createdAt: new Date().toString(),

        bracket: isBracket
          ? {
              currentRound: 0,
              participants: [],
              rounds: [
                {
                  id: "round-0",
                  matches: [
                    {
                      id: `match-${uuidv4()}`,
                      player1: null,
                      player2: null,
                      winner: null,
                      score: "",
                    },
                  ],
                },
              ],
            }
          : null,
      };

      const res = await axios.post("/api/tournaments", {
        ...formData,
        creator: user,
        bracket: newTournamentBase.bracket,
      });

      dispatch(
        setTournaments([
          ...tournaments,
          { ...newTournamentBase, id: res.data.id },
        ]),
      );

      setIsCreateTournamentModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании");
    }
  };

  const handleCloseCreateTournamentModal = () => {
    setIsCreateTournamentModalOpen(false);
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

      {tournaments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Турниров пока нет.
        </p>
      ) : (
        <ul className="space-y-3">
          {tournaments?.map((tournament, index) => {
            const isTeam = tournament.type.value === "team";
            const usersAmount = isTeam
              ? tournament.teams.length
              : tournament.users?.length || 0;
            const teamsAmount = tournament.teams.length || 0;
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
                description={tournament.description}
                currentPlayers={usersAmount}
                maxPlayers={maxPlayers}
                isTeam={isTeam}
                isFull={isFull}
                fillPercent={fillPercent}
              />
            );
          })}
        </ul>
      )}
      {canCreateTournament && (
        <CustomModal
          isOpen={isCreateTournamentModalOpen}
          onClose={handleCloseCreateTournamentModal}
        >
          <CreateTournamentModal
            formData={formData}
            handleChange={setFormData}
            handleChangeTournamentType={handleUpdateTournamentType}
            onClose={handleCloseCreateTournamentModal}
            onSubmit={handleCreateTournament}
            handleAddReward={handleAddReward}
          />
        </CustomModal>
      )}
    </main>
  );
};

export default page;
