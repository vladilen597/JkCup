"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { setTournaments } from "@/app/utils/store/tournamentsSlice";
import Tournament from "@/app/utils/Tournament";
import axios from "axios";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const page = () => {
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const dispatch = useAppDispatch();

  const handleLoadTournaments = async () => {
    const { data } = await axios.get("/api/tournaments");
    dispatch(setTournaments(data));
  };

  useEffect(() => {
    handleLoadTournaments();
  }, []);

  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
          <Trophy className="h-7 w-7 text-primary" />
          Турниры
        </h1>
        <p className="text-muted-foreground mt-2">
          Выберите турнир и покажите своё мастерство
        </p>
      </motion.div>

      {tournaments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Турниров пока нет.
        </p>
      ) : (
        <ul className="space-y-3">
          {tournaments?.map((tournament, index) => {
            const isTeam = tournament.team_amount > 1;
            const usersAmount = tournament.users.length;
            const fillPercent = Math.round(
              (tournament.users.length / tournament.max_players) * 100,
            );
            const isFull = tournament.users.length >= tournament.max_players;

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
