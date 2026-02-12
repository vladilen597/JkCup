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
    console.log(data);
    dispatch(setTournaments(data));
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
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Турниры
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Следите и участвуйте в турнирах
          </p>
        </div>
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
