import { ChevronRight, Gamepad2, Trophy, User, Users } from "lucide-react";
import Badge from "../components/Shared/Badge/Badge";
import { motion } from "motion/react";
import Link from "next/link";
import { statuses } from "../(app)/tournaments/[id]/page";
import CleanHtml from "../components/Shared/CleanHtml/CleanHtml";
import { IGame, ITag, ITournament } from "../lib/types";
import Tag from "../components/Shared/Tag/Tag";
import Image from "next/image";
import { useAppSelector } from "./store/hooks";

interface ITournamentProps extends ITournament {
  id: string;
  name: string;
  isTeam: boolean;
  fillPercent: number;
  index: number;
  currentPlayers: number;
  isFull: boolean;
  tags: ITag[];
  maxPlayers: number;
}

const trophyIndexes = {
  1: <Trophy className="h-3 w-3 text-[#EFBF04]" />,
  2: <Trophy className="h-3 w-3 text-[#C4C4C4]" />,
  3: <Trophy className="h-3 w-3 text-[#CE8946]" />,
};

const Tournament = ({
  id,
  name,
  isTeam,
  fillPercent,
  players_per_team,
  status,
  currentPlayers,
  index,
  game,
  maxPlayers,
  isFull,
  hidden,
  rewards,
  tags,
  description,
}: ITournamentProps) => {
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Link href={"/tournaments/" + id}>
        <div className="group relative rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-(--neon-shadow) transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground truncate">
                  {name}
                </h3>
                <Badge
                  text={
                    isTeam ? `${players_per_team}v${players_per_team}` : "1v1"
                  }
                  className="bg-primary/10 text-primary border border-primary/20"
                />
                <Badge
                  text={statuses[status as keyof typeof statuses]}
                  className="bg-primary/10 text-primary border border-primary/20"
                />
                {isFull && (
                  <Badge
                    text="Full"
                    className="bg-destructive/10 text-destructive border border-destructive/20"
                  />
                )}
                {hidden && (
                  <Badge
                    text="Скрыт"
                    className="bg-amber-400 text-black border border-destructive/20"
                  />
                )}
                {tags?.map((tag) => (
                  <Tag key={tag?.id} {...tag} />
                ))}
              </div>
              <div className="flex gap-2 items-center text-sm text-neutral-300 line-clamp-1">
                {game?.image_url ? (
                  <Image
                    className="rounded h-4 w-4 object-cover"
                    src={game?.image_url}
                    width={16}
                    height={16}
                    alt="Game image"
                  />
                ) : (
                  <Gamepad2 />
                )}
                <span className="font-bold">{game?.name}</span>
              </div>
              {currentUser &&
                currentUser.games?.some(
                  (userGame) => userGame.id === game?.id,
                ) && (
                  <span className="text-xs text-primary">
                    Турнир по одной из ваших игр
                  </span>
                )}
              <div className="mt-2 text-sm text-muted-foreground line-clamp-1">
                <CleanHtml html={description} />
              </div>
              {!!rewards?.length && (
                <ul className="mt-2">
                  {rewards?.map((reward, index) => (
                    <div className="flex items-center gap-1" key={reward.id}>
                      <span className="text-xs gap-2 w-3 text-center">
                        {trophyIndexes[
                          (index + 1) as keyof typeof trophyIndexes
                        ] || index + 1}
                      </span>
                      <span className="text-sm text-neutral-400">
                        {reward.value}
                      </span>
                    </div>
                  ))}
                </ul>
              )}
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
                {currentPlayers}/{maxPlayers}
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
};

export default Tournament;
