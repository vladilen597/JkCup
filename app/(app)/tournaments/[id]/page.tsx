"use client";

import UserList from "@/app/components/UserList/UserList";
import { useAppSelector, useAppDispatch } from "@/app/utils/store/hooks";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Hash,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { db } from "@/app/utils/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {
  addParticipant,
  removeParticipant,
} from "@/app/utils/store/tournamentsSlice";

const statuses = {
  open: "Открыт",
};

const TournamentPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { tournaments } = useAppSelector((state) => state.tournaments);

  const tournament = tournaments.find((t) => t.id === params.id);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isJoined =
    tournament?.users?.some((u) => u.uid === currentUser?.uid) ?? false;

  const handleJoinLeave = async () => {
    if (!currentUser?.uid) {
      setErrorMsg("Войдите в аккаунт");
      return;
    }

    if (!tournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    const tournamentRef = doc(db, "tournaments", tournament.id);

    try {
      if (isJoined) {
        await updateDoc(tournamentRef, {
          users: arrayRemove(currentUser),
        });
        dispatch(
          removeParticipant({
            tournamentId: tournament.id,
            userId: currentUser.uid,
          }),
        );
      } else {
        await updateDoc(tournamentRef, {
          users: arrayUnion(currentUser),
        });
        dispatch(
          addParticipant({
            tournamentId: tournament.id,
            participant: currentUser,
          }),
        );
      }
    } catch (err: any) {
      console.error("Error:", err);
      setErrorMsg("Не получилось обновить. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tournament) {
    return <div className="p-8 text-center">Турнир не найден</div>;
  }

  const filledSlots = tournament.users?.length || 0;
  const isTeam = (tournament.team_amount || 1) > 1;

  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-8">
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
          value={`${filledSlots} / ${tournament.max_players || "∞"}`}
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
            {Math.round(
              ((filledSlots || 0) / (tournament.max_players || 1)) * 100,
            )}
            %
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
            initial={{ width: 0 }}
            animate={{
              width: `${((filledSlots || 0) / (tournament.max_players || 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Participants + button */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Участники ({filledSlots} / {tournament.max_players || "∞"})
          </h2>

          {currentUser?.uid ? (
            <button
              onClick={handleJoinLeave}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors
                ${isJoined ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isJoined ? "Покинуть" : "Вступить"}
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-muted text-muted-foreground cursor-not-allowed"
            >
              Войдите, чтобы участвовать
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

        <UserList users={tournament.users || []} />
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
        className={`capitalize text-lg font-bold font-mono ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default TournamentPage;
