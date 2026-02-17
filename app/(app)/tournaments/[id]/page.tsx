"use client";

import UserList from "@/app/components/UserList/UserList";
import { useAppSelector, useAppDispatch } from "@/app/utils/store/hooks";
import { format } from "date-fns";
import { motion } from "motion/react";
import {
  Users,
  Calendar,
  Hash,
  Loader2,
  AlertCircle,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { db } from "@/app/utils/firebase";
import { doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import {
  addParticipant,
  removeParticipant,
  setTournaments,
} from "@/app/utils/store/tournamentsSlice";
import TeamList from "@/app/components/TeamsList/TeamsList";
import EditModal from "@/app/components/EditModal/EditModal";
import StatCard from "@/app/components/Shared/StatCard/StatCard";
import DeleteTournamentModal from "@/app/components/DeleteTournamentModal/DeleteTournamentModal";
import CreateTeamModal from "@/app/components/CreateTeamModal/CreateTeamModal";

const statuses = {
  open: "Открыт",
};

export interface IEditTournament {
  name: string;
  description: string;
  game: string;
  max_players: number;
  team_amount: number;
  start_date: string;
  status: string;
}

const TournamentPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { tournaments } = useAppSelector((state) => state.tournaments);

  const tournament = tournaments.find((t) => t.id === params.id);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<IEditTournament>({
    name: tournament?.name || "",
    description: tournament?.description || "",
    game: tournament?.game || "",
    max_players: tournament?.max_players || 16,
    team_amount: tournament?.team_amount || 1,
    start_date: tournament?.start_date
      ? new Date(tournament.start_date).toISOString().slice(0, 16)
      : "",
    status: tournament?.status || statuses.open,
  });

  const handleUpdateEditField = (event: ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value });
  };

  const handleUpdateTextField = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, description: event?.target.value });
  };

  const handleUpdateMaxPlayers = (value: number) => {
    setEditForm({ ...editForm, max_players: value });
  };

  const handleUpdateTeamAmount = (value: number) => {
    setEditForm({ ...editForm, team_amount: value });
  };

  const handleUpdateStatus = (value: string) => {
    setEditForm({ ...editForm, status: value });
  };

  const handleUpdateStartDate = (value: string) => {
    setEditForm({ ...editForm, start_date: value });
  };

  const handleOpenCreateTeamModal = () => {
    setIsCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setIsCreateTeamModalOpen(false);
  };

  const isSuperAdmin = currentUser?.role === "superadmin";
  const isTeamTournaments = (tournament?.team_amount || 1) > 1;
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
          ...tournament,
          users: tournament.users.filter(
            (user) => user.uid !== currentUser.uid,
          ),
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
      setErrorMsg("Не получилось обновить участие");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !tournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    const tournamentRef = doc(db, "tournaments", tournament.id);

    try {
      await updateDoc(tournamentRef, {
        name: editForm.name,
        description: editForm.description,
        game: editForm.game,
        max_players: editForm.max_players,
        team_amount: editForm.team_amount,
        start_date: editForm.start_date
          ? new Date(editForm.start_date).toISOString()
          : null,
        status: editForm.status,
      });

      const updatedTournaments = tournaments.map((t) =>
        t.id === tournament.id ? { ...t, ...editForm } : t,
      );
      dispatch(setTournaments(updatedTournaments));

      setShowEditModal(false);
    } catch (error: any) {
      setErrorMsg("Не удалось обновить турнир");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    if (!isSuperAdmin || !tournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      await deleteDoc(doc(db, "tournaments", tournament.id));

      dispatch(
        setTournaments(tournaments.filter((t) => t.id !== tournament.id)),
      );

      window.location.href = "/tournaments";
    } catch (err: any) {
      console.error("Delete error:", err);
      setErrorMsg("Не удалось удалить турнир");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };
  const canEditTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  if (!tournament) {
    return <div className="p-8 text-center">Турнир не найден</div>;
  }

  const isTeamMode = (tournament.team_amount || 1) > 1;
  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.users?.length || 0;

  const isFull =
    tournament.team_amount > 1
      ? tournament.teams.length === tournament.max_players
      : tournament.users.length === tournament.max_players;

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider">
                {isFull ? "Full" : "Live"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {isTeamMode ? "Командный" : "Одиночный"}
              </span>
            </div>

            {canEditTournament && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
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
            isTeamMode
              ? `${tournament.team_amount}v${tournament.team_amount}`
              : "1v1"
          }
        />
        <StatCard
          icon={<Hash className="h-4 w-4" />}
          label={isTeamMode ? "Команд" : "Игроков"}
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
            className="h-full rounded-full bg-linear-to-r from-primary to-primary/60"
            initial={{ width: 0 }}
            animate={{
              width: `${((filledSlots || 0) / (tournament.max_players || 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {isTeamMode ? "Команды" : "Участники"} ({filledSlots} /{" "}
            {tournament.max_players || "∞"})
          </h2>

          {currentUser?.uid ? (
            <button
              onClick={
                isTeamTournaments ? handleOpenCreateTeamModal : handleJoinLeave
              }
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors
                ${isJoined ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isJoined
                ? "Покинуть"
                : isTeamMode
                  ? "Создать команду"
                  : "Вступить"}
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

        {isTeamMode ? (
          <TeamList
            teams={tournament.teams || []}
            tournamentId={tournament.id}
            maxPlayersPerTeam={tournament.team_amount}
            isLoading={isLoading}
          />
        ) : (
          <UserList users={tournament.users || []} />
        )}
      </motion.section>

      {showEditModal && (
        <EditModal
          {...editForm}
          isLoading={isLoading}
          onInputChange={handleUpdateEditField}
          onTextareaChange={handleUpdateTextField}
          onMaxPlayersChange={handleUpdateMaxPlayers}
          onTeamAmountChange={handleUpdateTeamAmount}
          onStartDateChange={handleUpdateStartDate}
          handleUpdateStatus={handleUpdateStatus}
          onClose={handleCloseEditModal}
          onSubmit={handleEdit}
        />
      )}

      {showDeleteConfirm && (
        <DeleteTournamentModal
          isLoading={isLoading}
          onClose={handleCloseDeleteModal}
          onSubmit={handleDelete}
        />
      )}
      {isCreateTeamModalOpen && (
        <CreateTeamModal
          tournamentId={tournament.id}
          onClose={handleCloseCreateTeamModal}
        />
      )}
    </main>
  );
};

export default TournamentPage;
