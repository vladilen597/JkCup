import { Crown, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import { IUser, ITeam, ITournamentWinner } from "@/app/lib/types";

interface IWinnerBlockProps {
  winner_team?: ITeam | null;
  winner_users: (ITournamentWinner & { team_name?: string })[];
}

const Sparkle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2 + 1,
    }}
  >
    <Star className="w-3 h-3 text-gold-light fill-gold-light" />
  </motion.div>
);

const sparkles = [
  { delay: 0, x: "10%", y: "15%" },
  { delay: 0.5, x: "85%", y: "10%" },
  { delay: 1.2, x: "70%", y: "80%" },
  { delay: 0.8, x: "20%", y: "75%" },
  { delay: 1.5, x: "50%", y: "5%" },
  { delay: 0.3, x: "90%", y: "50%" },
];

const WinnerBlock = ({ winner_users = [], winner_team }: IWinnerBlockProps) => {
  if (!winner_users.length) return null;

  const isTeamTournament = winner_users.some((w) => !!w.team_name);

  const placesStructure: {
    [rewardId: string]: {
      reward_value: string;
      teams: { [teamName: string]: IUser[] };
      soloPlayers: IUser[];
    };
  } = {};

  winner_users.forEach((w) => {
    if (!placesStructure[w.reward_id]) {
      placesStructure[w.reward_id] = {
        reward_value: w.reward_value,
        teams: {},
        soloPlayers: [],
      };
    }

    if (w.team_name) {
      if (!placesStructure[w.reward_id].teams[w.team_name]) {
        placesStructure[w.reward_id].teams[w.team_name] = [];
      }
      placesStructure[w.reward_id].teams[w.team_name].push(w.user);
    } else {
      placesStructure[w.reward_id].soloPlayers.push(w.user);
    }
  });

  const sortedPlaces = Object.values(placesStructure);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="relative max-w-5xl mx-auto flex items-center justify-between border-2 p-6 border-gold! rounded-lg overflow-hidden bg-[#09090b]"
    >
      {sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      <div className="w-full md:max-w-[75%] flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-linear-to-br from-gold/20 to-gold-dark/10 border border-gold/20!">
            <Trophy className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {isTeamTournament ? "Команды" : "Одиночки"}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Победители
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {sortedPlaces.map((place, index) => (
            <div
              key={index}
              className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  {index + 1} место
                </span>
                <span className="text-sm font-bold text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-md">
                  {place.reward_value}
                </span>
              </div>

              {isTeamTournament &&
                Object.entries(place.teams).map(([teamName, members]) => (
                  <div key={teamName} className="flex flex-col gap-2">
                    <h4 className="text-md font-bold text-amber-400 flex items-center gap-2">
                      {teamName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                      {members.map((user) => (
                        <div
                          className="flex items-center gap-2 p-2 bg-card/40 border border-zinc-800/60 rounded-lg"
                          key={user.id}
                        >
                          <UserInfoBlock {...user} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {!isTeamTournament && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {place.soloPlayers.map((user) => (
                    <div
                      className="flex items-center gap-2 p-3 bg-card/40 border border-zinc-800/60 rounded-lg"
                      key={user.id}
                    >
                      <UserInfoBlock {...user} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="hidden md:block relative z-10 shrink-0"
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.6,
          type: "spring",
          stiffness: 120,
        }}
      >
        <div className="animate-float">
          <div className="relative">
            <Crown
              className="text-gold drop-shadow-[0_0_20px_hsl(45,100%,50%,0.4)]"
              width={100}
              height={100}
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 blur-2xl bg-gold/20 rounded-full -z-10 scale-150" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinnerBlock;
