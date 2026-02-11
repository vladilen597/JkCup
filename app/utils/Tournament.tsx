import { ChevronRight, User, Users } from "lucide-react";
import Badge from "../components/Shared/Badge/Badge";
import { motion } from "motion/react";
import Link from "next/link";

interface ITournamentProps {
  id: string;
  name: string;
  isTeam: boolean;
  fillPercent: number;
  max_players: number;
  team_amount: number;
  index: number;
  currentPlayers: number;
  isFull: boolean;
  description: string;
}

const Tournament = ({
  id,
  name,
  isTeam,
  fillPercent,
  max_players,
  team_amount,
  currentPlayers,
  index,
  isFull,
  description,
}: ITournamentProps) => (
  <motion.li
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.06 }}
  >
    <Link href={"/tournaments/" + id}>
      <div className="group relative rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-[var(--neon-shadow)] transition-all duration-300 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-bold text-foreground truncate">
                {name}
              </h3>
              <Badge
                text={isTeam ? `${team_amount}v${team_amount}` : "1v1"}
                className="bg-primary/10 text-primary border border-primary/20"
              />
              <Badge
                text="Open"
                className="bg-primary/10 text-primary border border-primary/20"
              />
              {isFull && (
                <Badge
                  text="Full"
                  className="bg-destructive/10 text-destructive border border-destructive/20"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {description}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isTeam ? (
              <Users className="h-3.5 w-3.5" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
            <span className="font-mono text-sm">
              {currentPlayers}/{max_players}
            </span>
          </div>

          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.06,
                ease: "easeOut",
              }}
            />
          </div>

          <span className="text-[14px] font-mono text-primary">
            {fillPercent}%
          </span>
        </div>
      </div>
    </Link>
  </motion.li>
);

export default Tournament;
