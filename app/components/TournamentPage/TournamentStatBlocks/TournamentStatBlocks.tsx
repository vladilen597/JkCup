import RulesExpandableBlock from "../../RulesExpandableBlock/RulesExpandableBlock";
import { ITournament } from "@/app/lib/types";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ITournamentStatBlocksProps {
  tournament: ITournament;
}

const trophyStyles = {
  0: {
    icon: "text-gold",
    container: "from-gold/20 to-gold-dark/10 border-gold/20!",
  },
  1: {
    icon: "text-silver",
    container: "from-silver/20 to-silver-dark/10 border-silver/20!",
  },
  2: {
    icon: "text-bronze",
    container: "from-bronze/20 to-bronze-dark/10 border-bronze/20!",
  },
};

const TournamentStatBlocks = ({ tournament }: ITournamentStatBlocksProps) => {
  const isTeamMode = tournament.type === "team";

  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.registrations?.length || 0;

  return (
    <section>
      {!!tournament.rewards?.length && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl p-4 bg-card hover:border-primary/20 transition-colors mt-2 max-w-5xl mx-auto "
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono tracking-widest">
            <Trophy className="h-4 w-4 " />
            Награды
          </div>
          <ul className="mt-1.5 space-y-2">
            {tournament.rewards?.map((reward, index) => (
              <div className="flex items-center gap-2" key={reward.id}>
                {index < 3 ? (
                  <div
                    className={cn(
                      "flex p-2 items-center justify-center rounded-xl bg-linear-to-br border",
                      trophyStyles[index].container,
                    )}
                  >
                    <Trophy
                      className={cn("w-6 h-6", trophyStyles[index].icon)}
                    />
                  </div>
                ) : (
                  <div className="flex p-2 items-center justify-center border rounded-xl">
                    <Trophy className="w-6 h-6 text-neutral-600" />
                  </div>
                )}
                <div>
                  <span className="block font-mono text-neutral-400 text-xs">
                    {index + 1}-е место
                  </span>
                  <p className="leading-5 block text-lg font-bold font-mono text-foreground">
                    {reward.value}
                  </p>
                </div>
              </div>
            ))}
          </ul>
        </motion.div>
      )}
      {!!tournament.rules && tournament?.rules !== "<p></p>" && (
        <div className="mt-2 max-w-5xl mx-auto">
          <RulesExpandableBlock html={tournament.rules} />
        </div>
      )}
    </section>
  );
};

export default TournamentStatBlocks;
