import { motion } from "framer-motion";
import { User, Users, Calendar, Hash } from "lucide-react";
import UserList from "../Shared/UserList/UserList";

// Mock data for demo
const mockTournament = {
  name: "CYBER CUP 2026",
  description:
    "Главный турнир сезона по Counter-Strike 2. Соревнуйтесь с лучшими командами и докажите своё мастерство на арене!",
  team_amount: 5,
  max_players: 16,
};

const mockParticipants = [
  {
    id: "1",
    displayName: "ShadowStrike",
    photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow",
    status: "registered",
  },
  {
    id: "2",
    displayName: "NeonBlade",
    photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Neon",
    status: "registered",
  },
  {
    id: "3",
    displayName: "FrostByte",
    photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Frost",
    status: "captain",
  },
  { id: "4", displayName: "ThunderVolt", photoURL: null, status: "registered" },
  {
    id: "5",
    displayName: "CyberWolf",
    photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Wolf",
    status: "registered",
  },
];

const TournamentPage = () => {
  const tournament = mockTournament;
  const participants = mockParticipants;
  const isTeam = tournament.team_amount > 1;
  const filledSlots = participants.length;

  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-8"
        style={{
          background:
            "linear-gradient(135deg, hsl(220 18% 14%) 0%, hsl(220 20% 8%) 100%)",
        }}
      >
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider">
              Live
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {isTeam ? "Командный" : "Одиночный"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
            {tournament.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {tournament.description}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Формат"
          value={
            isTeam
              ? `${tournament.team_amount}v${tournament.team_amount}`
              : "1v1"
          }
        />
        <StatCard
          icon={<Hash className="h-4 w-4" />}
          label={isTeam ? "Команд" : "Игроков"}
          value={`${filledSlots} / ${tournament.max_players}`}
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          label="Начало"
          value="Скоро"
        />
        <StatCard
          icon={<User className="h-4 w-4" />}
          label="Статус"
          value="Открыт"
          highlight
        />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Заполнено слотов
          </span>
          <span className="text-xs font-mono text-primary">
            {Math.round((filledSlots / tournament.max_players) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-primary to-primary/60"
            initial={{ width: 0 }}
            animate={{
              width: `${(filledSlots / tournament.max_players) * 100}%`,
            }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Participants */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Участники
        </h2>
        <UserList users={participants} />
      </motion.section>
    </main>
  );
};

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl p-4 bg-card border border-border/50 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <span
        className={`text-lg font-bold font-mono ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default TournamentPage;
