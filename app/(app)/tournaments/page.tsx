"use client";

import CreateTournamentModal from "@/app/components/CreateTournamentModal/CreateTournamentModal";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { setTournaments } from "@/app/utils/store/tournamentsSlice";
import Tournament from "@/app/utils/Tournament";
import axios from "axios";
import { motion } from "framer-motion";
import { Trophy, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const page = () => {
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    max_players: 16,
    team_amount: 1,
    start_date: "",
  });

  const canCreateTournament =
    user?.role === "admin" || user?.role === "superadmin";

  const handleLoadTournaments = async () => {
    try {
      const { data } = await axios.get("/api/tournaments");
      dispatch(setTournaments(data));
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    }
  };

  useEffect(() => {
    handleLoadTournaments();
  }, []);

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateTournament) return;

    try {
      const newTournament = {
        ...formData,
        status: "open",
        users: [],
        users_amount: 0,
        teams: [],
        teams_amount: 0,
        createdAt: new Date().toISOString(),
        start_date: "",
      };

      const res = await axios.post("/api/tournaments", newTournament);

      dispatch(
        setTournaments([...tournaments, { id: res.data.id, ...newTournament }]),
      );

      setFormData(newTournament);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании");
    }
  };

  const handleCloseCreateTournamentModal = () => {
    setShowForm(false);
  };

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Турниры
              </h1>
            </div>

            {canCreateTournament && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                <Plus className="h-5 w-5" />
                Создать турнир
              </button>
            )}
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Следите и участвуйте в турнирах
          </p>
        </div>
      </motion.div>

      {canCreateTournament && showForm && (
        <CreateTournamentModal
          formData={formData}
          handleChange={setFormData}
          onClose={handleCloseCreateTournamentModal}
          onSubmit={handleCreateTournament}
        />
      )}

      {tournaments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Турниров пока нет.
        </p>
      ) : (
        <ul className="space-y-3">
          {tournaments?.map((tournament, index) => {
            const isTeam = tournament.team_amount > 1;
            const usersAmount = tournament.users?.length || 0;
            const fillPercent = Math.round(
              (usersAmount / tournament.max_players) * 100,
            );
            const isFull = usersAmount >= tournament.max_players;

            return (
              <Tournament
                key={tournament.id}
                index={index}
                {...tournament}
                description={tournament.description}
                currentPlayers={usersAmount}
                isTeam={isTeam}
                isFull={isFull}
                fillPercent={fillPercent}
              />
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default page;
