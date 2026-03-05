import { ITournament } from "@/app/utils/store/tournamentsSlice";
import { Calendar, Hash, Trophy, User, Users } from "lucide-react";
import { statuses } from "@/app/(app)/tournaments/[id]/page";
import StatCard from "../../Shared/StatCard/StatCard";
import { motion } from "motion/react";
import { format } from "date-fns";

interface ITournamentStatBlocksProps {
  tournament: ITournament;
}

const trophyIndexes = {
  1: <Trophy className="h-6 w-6 text-[#EFBF04]" />,
  2: <Trophy className="h-6 w-6 text-[#C4C4C4]" />,
  3: <Trophy className="h-6 w-6 text-[#CE8946]" />,
};

const TournamentStatBlocks = ({ tournament }: ITournamentStatBlocksProps) => {
  const isTeamMode = tournament.type.value === "team";

  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.usersIds?.length || 0;

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl p-4 bg-card border border-border/50 hover:border-primary/20 transition-colors mt-2 max-w-5xl mx-auto"
      >
        <span className="text-xs text-muted-foreground font-medium">
          Награды
        </span>
        {!!tournament.rewards?.length && (
          <ul className="mt-2">
            {tournament.rewards?.map((reward, index) => (
              <div className="flex items-center gap-2" key={reward.id}>
                <span className="text-xs w-6 text-center">
                  {trophyIndexes[(index + 1) as keyof typeof trophyIndexes] ||
                    index + 1}
                </span>
                <span className="text-lg font-bold font-mono text-foreground">
                  {reward.value}
                </span>
              </div>
            ))}
          </ul>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 mb-8 max-w-5xl mx-auto"
      >
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Формат"
          value={
            isTeamMode
              ? `${tournament.players_per_team}v${tournament.players_per_team}`
              : "1v1"
          }
        />
        <StatCard
          icon={<Hash className="h-4 w-4" />}
          label={isTeamMode ? "Команд" : "Игроков"}
          value={`${filledSlots} / ${isTeamMode ? tournament.max_teams : tournament.max_players}`}
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          label="Начало"
          value={
            tournament.start_date
              ? format(new Date(tournament.start_date), "dd/MM/yyyy HH:mm")
              : "Скоро"
          }
        />
        <StatCard
          icon={<User className="h-4 w-4" />}
          label="Статус"
          value={statuses[tournament.status as keyof typeof statuses] || "—"}
          highlight
        />
      </motion.div>
    </section>
  );
};

export default TournamentStatBlocks;
