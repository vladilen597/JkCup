import { Crown, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import WinnerTeam from "../WinnerTeam/WinnerTeam";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import { ITeam, ITournamentRegistration, IUser } from "@/app/lib/types";

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

const WinnerBlock = ({
  winner_user,
  winner_team,
}: {
  winner_user: IUser;
  winner_team: ITeam;
}) => {
  console.log(winner_user);
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

      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-linear-to-br from-gold/20 to-gold-dark/10 border border-gold/20!">
            <Trophy className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {winner_team ? "Команда победителей" : "Победитель турнира"}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              {winner_team ? winner_team.name : winner_user.full_name}
            </h3>
          </div>
        </div>

        {winner_team ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {winner_team.members.map((member) => (
              <div
                className="flex items-center gap-2 p-3 bg-card/60 backdrop-blur-sm border border-gold/10! rounded-lg"
                key={member.id}
              >
                <UserInfoBlock {...member.profile} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-card/60 backdrop-blur-sm border border-gold/10! rounded-lg">
            <UserInfoBlock {...winner_user} />
          </div>
        )}
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
