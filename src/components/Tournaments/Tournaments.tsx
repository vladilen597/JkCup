import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import Tournament from "./Tournament/Tournament";

const mockTournaments = [
  {
    id: "1",
    name: "CYBER CUP 2026",
    description: "Главный турнир сезона по Counter-Strike 2",
    team_amount: 5,
    max_players: 16,
    currentPlayers: 12,
  },
  {
    id: "2",
    name: "NEON CLASH",
    description: "Быстрый турнир 1v1 для настоящих дуэлянтов",
    team_amount: 1,
    max_players: 32,
    currentPlayers: 8,
  },
  {
    id: "3",
    name: "FROST LEAGUE",
    description: "Зимний командный турнир с крупным призовым фондом",
    team_amount: 3,
    max_players: 24,
    currentPlayers: 24,
  },
];

const Tournaments = () => {
  const tournaments = mockTournaments;

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

      {tournaments.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Турниров пока нет.
        </p>
      ) : (
        <ul className="space-y-3">
          {tournaments.map((t, i) => {
            const isTeam = t.team_amount > 1;
            const fillPercent = Math.round(
              (t.currentPlayers / t.max_players) * 100,
            );
            const isFull = t.currentPlayers >= t.max_players;

            return (
              <Tournament
                key={t.id}
                i={i}
                currentPlayers={t.currentPlayers}
                {...t}
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

export default Tournaments;
