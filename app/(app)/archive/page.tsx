"use client";

import ArchiveTournament from "@/app/components/ArchiveTournament/ArchiveTournament";
import { ITournament } from "@/app/utils/store/tournamentsSlice";
import { collection, getDocs, query } from "firebase/firestore";
import Title from "@/app/components/Title/Title";
import { Archive, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/app/utils/firebase";
import { motion } from "framer-motion";

const page = () => {
  const [tournaments, setTournaments] = useState<ITournament[]>([]);

  const handleLoadTournaments = async () => {
    try {
      const tournamentsQuery = query(collection(db, "archivedTournaments"));
      const tournamentsSnap = await getDocs(tournamentsQuery);

      const enrichedTournaments = await Promise.all(
        tournamentsSnap.docs.map(async (tournamentDoc) => {
          const tournamentData = {
            ...(tournamentDoc.data() as ITournament),
            id: tournamentDoc.id,
          };
          return tournamentData;
        }),
      );
      setTournaments(enrichedTournaments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleLoadTournaments();
  }, []);

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
              <Archive className="h-8 w-8 text-primary" />
              <Title title="Архив" />
            </div>
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Здесь хранятся прошедшие турниры
          </p>
        </div>
      </motion.div>

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

          return (
            <ArchiveTournament
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
    </main>
  );
};

export default page;
