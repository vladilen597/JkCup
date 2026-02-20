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
  Trophy,
  Clock,
  Album,
  Archive,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { db } from "@/app/utils/firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  addParticipant,
  ITournament,
  removeParticipant,
  removeUserFromSingleTournament,
  setTournaments,
  updateTournament,
  updateTournamentStatus,
} from "@/app/utils/store/tournamentsSlice";
import TeamList from "@/app/components/TeamsList/TeamsList";
import EditModal from "@/app/components/EditModal/EditModal";
import StatCard from "@/app/components/Shared/StatCard/StatCard";
import DeleteTournamentModal from "@/app/components/DeleteTournamentModal/DeleteTournamentModal";
import CreateTeamModal from "@/app/components/CreateTeamModal/CreateTeamModal";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { ISelectOption } from "@/app/components/Shared/CustomSelect/CustomSelect";
import JoinTournamentButton from "@/app/components/JoinTournamentButton/JoinTournamentButton";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import TournamentDurationDisplay from "@/app/components/Shared/TournamentDurationDisplay/TournamentDurationDisplay";
import AddJudgeBlock from "@/app/components/Shared/AddJudgeBlock/AddJudgeBlock";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import Title from "@/app/components/Title/Title";
import SelectWinnerTeamModal from "@/app/components/SelectWinnerTeamModal/SelectWinnerTeamModal";
import SelectWinnerUserModal from "@/app/components/SelectWinnerUserModal/SelectWinnerUserModal";
import Discord from "@/app/components/Icons/Discord";

export const statuses = {
  open: "Открыт",
  closed: "Закрыт",
  about_to_start: "Регистрация закрыта",
  in_progress: "LIVE",
  finished: "Окончен",
};

export interface IEditTournament {
  name: string;
  description: string;
  game: string;
  max_teams: number;
  max_players: number;
  players_per_team: number;
  start_date: string;
  type: ISelectOption;
  duration: number;
  rewards: { id: string; value: string }[];
}

const trophyIndexes = {
  1: <Trophy className="h-4 w-4 text-[#EFBF04]" />,
  2: <Trophy className="h-4 w-4 text-[#C4C4C4]" />,
  3: <Trophy className="h-4 w-4 text-[#CE8946]" />,
};

const TournamentPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { tournaments } = useAppSelector((state) => state.tournaments);

  const [realtimeTournament, setRealtimeTournament] =
    useState<ITournament | null>(null);
  const [isTournamentLoading, setIsTournamentLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  const tournamentId = params.id as string;
  const router = useRouter();

  // Get the tournament to display (realtime if available, otherwise from Redux)
  const displayTournament =
    realtimeTournament || tournaments.find((t) => t.id === tournamentId);

  const [editForm, setEditForm] = useState<IEditTournament>({
    name: displayTournament?.name || "",
    description: displayTournament?.description || "",
    game: displayTournament?.game || "",
    max_players: displayTournament?.max_players || 6,
    max_teams: displayTournament?.max_teams || 6,
    players_per_team: displayTournament?.players_per_team || 2,
    start_date: displayTournament?.start_date
      ? new Date(displayTournament.start_date).toISOString().slice(0, 16)
      : "",
    type: displayTournament?.type || {
      id: 1,
      value: "team",
      label: "Командный",
    },
    rewards: displayTournament?.rewards || [],
    duration: displayTournament?.duration || 0,
  });

  // Update edit form when displayTournament changes
  useEffect(() => {
    if (displayTournament) {
      setEditForm({
        name: displayTournament.name || "",
        description: displayTournament.description || "",
        game: displayTournament.game || "",
        max_players: displayTournament.max_players || 6,
        max_teams: displayTournament.max_teams || 6,
        players_per_team: displayTournament.players_per_team || 2,
        start_date: displayTournament.start_date
          ? new Date(displayTournament.start_date).toISOString().slice(0, 16)
          : "",
        type: displayTournament.type || {
          id: 1,
          value: "team",
          label: "Командный",
        },
        rewards: displayTournament.rewards || [],
        duration: displayTournament.duration || 0,
      });
    }
  }, [displayTournament]);

  // REAL-TIME LISTENER for this specific tournament
  useEffect(() => {
    if (!tournamentId) return;

    const tournamentRef = doc(db, "tournaments", tournamentId);

    const unsubscribe = onSnapshot(
      tournamentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedTournament = {
            ...docSnapshot.data(),
            id: docSnapshot.id,
          } as ITournament;

          setRealtimeTournament(updatedTournament);

          // Also update Redux store for consistency
          if (tournaments.some((t) => t.id === tournamentId)) {
            dispatch(updateTournament(updatedTournament));
          } else {
            dispatch(setTournaments([updatedTournament]));
          }
        }
      },
      (error) => {
        console.error("Error in tournament real-time listener:", error);
        setErrorMsg("Ошибка при загрузке обновлений турнира");
      },
    );

    return () => unsubscribe();
  }, [tournamentId, dispatch, tournaments]);

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleUpdateEditField = (event: ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value });
  };

  const handleUpdateTextField = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, description: event?.target.value });
  };

  const handleUpdateTeamAmount = (value: number) => {
    setEditForm({ ...editForm, players_per_team: value });
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

  const canEdit =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";

  const isJoined =
    displayTournament?.users?.some((u) => u.uid === currentUser?.uid) ?? false;

  const handleJoinLeave = async () => {
    if (!currentUser?.uid) {
      setErrorMsg("Войдите в аккаунт");
      return;
    }

    if (!displayTournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    const tournamentRef = doc(db, "tournaments", displayTournament.id);

    try {
      if (isJoined) {
        // Remove user
        await updateDoc(tournamentRef, {
          users: displayTournament.users.filter(
            (user) => user.uid !== currentUser.uid,
          ),
        });
        // No need to dispatch - real-time update will handle it
      } else {
        // Add user
        await updateDoc(tournamentRef, {
          users: arrayUnion(currentUser),
        });
        // No need to dispatch - real-time update will handle it
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
    if (!canEdit || !displayTournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    const tournamentRef = doc(db, "tournaments", displayTournament.id);

    try {
      await updateDoc(tournamentRef, {
        name: editForm.name,
        description: editForm.description,
        game: editForm.game,
        max_players: editForm.max_players,
        max_teams: editForm.max_teams,
        players_per_team: editForm.players_per_team,
        start_date: editForm.start_date
          ? new Date(editForm.start_date).toString()
          : null,
        rewards: editForm.rewards,
        duration: editForm.duration,
      });

      // No need to manually update Redux - real-time listener will handle it
      setShowEditModal(false);
    } catch (error: any) {
      console.log(error);
      setErrorMsg("Не удалось обновить турнир");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseRegistration = async () => {
    try {
      if (displayTournament) {
        const tournamentRef = doc(db, "tournaments", displayTournament.id);
        await updateDoc(tournamentRef, {
          status: "about_to_start",
        });
        // Real-time listener will update UI
      }
    } catch (err) {
      console.error("Failed to update tournament:", err);
    }
  };

  const handleStartTournament = async () => {
    try {
      if (displayTournament) {
        const tournamentRef = doc(db, "tournaments", displayTournament.id);
        await updateDoc(tournamentRef, {
          status: "in_progress",
          startedAt: new Date().toString(),
        });
        // Real-time listener will update UI
      }
    } catch (err) {
      console.error("Failed to start tournament:", err);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  const handleChangeMaxTeamsOrPlayers = (value: number) => {
    if (editForm.type.value === "team") {
      setEditForm((prevState) => ({
        ...prevState,
        max_teams: value,
      }));
    } else {
      setEditForm((prevState) => ({
        ...prevState,
        max_players: value,
      }));
    }
  };

  const handleChangeDuration = (value: number) => {
    setEditForm((prevState) => ({
      ...prevState,
      duration: value,
    }));
  };

  const handleUpdateTournamentType = (value: ISelectOption) => {
    setEditForm((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  const handleLoadTournament = async () => {
    setIsTournamentLoading(true);
    const tournamentRef = doc(db, "tournaments", params.id as string);
    try {
      const tournamentDoc = await getDoc(tournamentRef);
      const tournamentData = {
        ...tournamentDoc.data(),
        id: tournamentDoc.id,
      };

      if (tournamentData) {
        if (tournaments.some((tournament) => tournament.id === tournamentId)) {
          dispatch(updateTournament(tournamentData as ITournament));
        } else {
          dispatch(setTournaments([tournamentData as ITournament]));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTournamentLoading(false);
    }
  };

  const handleRemoveUserFromTournament = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const user = (await getDoc(userRef)).data();
      const tournamentRef = doc(db, "tournaments", tournamentId);
      await updateDoc(tournamentRef, {
        users: arrayRemove(user),
      });
      // Real-time listener will update UI
    } catch (error) {
      console.log(error);
    }
  };

  const handleArchiveTournament = async () => {
    try {
      const tournamentDoc = doc(db, "tournaments", tournamentId);
      await addDoc(collection(db, "archivedTournaments"), displayTournament);
      await deleteDoc(tournamentDoc);
      router.replace("/tournaments");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleLoadTournament();
  }, []);

  const handleRewardChange = (index: number, value: string) => {
    setEditForm((prevState) => ({
      ...prevState,
      rewards: prevState.rewards.map((reward, i) =>
        i === index ? { ...reward, value } : reward,
      ),
    }));
  };

  const handleAddReward = () => {
    setEditForm((prevState) => ({
      ...prevState,
      rewards: [...prevState.rewards, { id: uuidv4(), value: "" }],
    }));
  };

  const handleDeleteReward = (id: string) => {
    setEditForm((prevState) => ({
      ...prevState,
      rewards: prevState.rewards.filter((reward) => reward.id !== id),
    }));
  };

  const handleDelete = async () => {
    if (!canEdit || !displayTournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      await deleteDoc(doc(db, "tournaments", displayTournament.id));
      router.replace("/tournaments");
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

  const handleOpenSelectWinnerModal = () => {
    setIsWinnerModalOpen(true);
  };

  const handleCloseSelectWinnerModal = () => {
    setIsWinnerModalOpen(false);
  };

  if (isTournamentLoading && !displayTournament) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        Загрузка турнира...
      </div>
    );
  }

  if (!displayTournament) {
    return <div className="p-8 text-center">Турнир не найден</div>;
  }

  const isTeamMode = displayTournament.type.value === "team";
  const filledSlots = isTeamMode
    ? displayTournament.teams?.length || 0
    : displayTournament.users?.length || 0;

  const isFull = isTeamMode
    ? displayTournament.teams?.length === displayTournament.max_teams
    : displayTournament.users?.length === displayTournament.max_players;

  const isCurrentUserJudge =
    displayTournament.judges?.some((judge) => judge.uid === currentUser?.uid) ||
    false;

  const isUserHasTeam =
    displayTournament.teams?.some((team) =>
      team.users?.some((user) => user.uid === currentUser?.uid),
    ) || false;

  const isUserCanCreateTeam = !isCurrentUserJudge && !isUserHasTeam;

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-8  ${canEditTournament && "pt-4!"}`}
        style={{
          background:
            "linear-gradient(135deg, hsl(220 18% 14%) 0%, hsl(220 20% 8%) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            {canEditTournament && (
              <div className="flex items-center gap-4">
                {displayTournament.creator && (
                  <div className="">
                    <span className="text-sm">Создатель</span>
                    <div className="mt-1 flex gap-2 items-center">
                      <Image
                        width={32}
                        height={32}
                        className="w-6 h-6 rounded-full"
                        src={displayTournament?.creator?.photoUrl || ""}
                        alt="User photo"
                      />
                      <div>
                        <span className="text-xs font-bold">
                          {displayTournament?.creator?.displayName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {displayTournament?.createdAt && (
                  <div className="">
                    <span className="text-sm">Время создания</span>
                    <div className="mt-1 flex gap-2 items-center">
                      {format(displayTournament?.createdAt, "dd.MM.yyyy HH:mm")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {canEditTournament && (
            <div className="flex gap-3">
              {displayTournament.status === "open" && (
                <CustomButton
                  icon={<Album className="h-4 w-4" />}
                  label="Закрыть регистрацию"
                  onClick={handleCloseRegistration}
                />
              )}
              {displayTournament.status === "about_to_start" && (
                <CustomButton
                  icon={<Trophy className="h-4 w-4" />}
                  label="Начать турнир"
                  onClick={handleStartTournament}
                />
              )}
              {displayTournament.status === "in_progress" && (
                <CustomButton
                  icon={<Trophy className="h-4 w-4" />}
                  label="Закончить и выбрать победителя"
                  onClick={handleOpenSelectWinnerModal}
                />
              )}
              {displayTournament.status === "finished" && (
                <CustomButton
                  icon={<Archive className="h-4 w-4" />}
                  label="Архивировать"
                  onClick={handleArchiveTournament}
                />
              )}
              {displayTournament.status !== "finished" && (
                <CustomButton
                  icon={<Edit className="h-4 w-4 text-amber-600" />}
                  className="py-1.5 px-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-white border border-amber-600!"
                  onClick={handleOpenEditModal}
                />
              )}
              <CustomButton
                icon={<Trash2 className="h-4 w-4 text-red-600" />}
                className="py-1.5 px-2.5 bg-red-600/20 hover:bg-red-600/40 text-white border border-red-600!"
                onClick={() => setShowDeleteConfirm(true)}
              />
            </div>
          )}
        </div>

        <div className="relative mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider">
                {statuses[displayTournament.status as keyof typeof statuses]}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {isTeamMode ? "Командный" : "Одиночный"}
              </span>
            </div>
          </div>

          <Title title={displayTournament.name} className="mt-2" />
          <TournamentDurationDisplay
            duration={displayTournament.duration}
            startedAt={displayTournament.startedAt}
            status={displayTournament.status}
          />
          <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
            {displayTournament.description}
          </p>

          <div className="mt-2">
            <span className="block font-bold">Награды</span>
            {!!displayTournament.rewards?.length && (
              <ul className="mt-2">
                {displayTournament.rewards?.map((reward, index) => (
                  <div className="flex items-center gap-1" key={reward.id}>
                    <span className="text-xs gap-2 w-4 text-center">
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
        </div>
      </motion.div>

      {displayTournament.status === "finished" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-gray-800/50 border-2 p-4 border-amber-300! rounded-lg overflow-hidden"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-300" />
            {isTeamMode ? "Команда победителей" : "Победитель"}
          </h3>

          {isTeamMode ? (
            <div className="mt-8">
              <span className="text-xl font-bold flex items-center gap-2">
                {displayTournament.winner_team?.name}
              </span>
              <ul className="mt-2">
                {displayTournament.winner_team?.users.map((user) => (
                  <li key={user.uid} className="flex items-center gap-2">
                    <Image
                      className="w-10 h-10 rounded-full"
                      src={user.photoUrl}
                      width={40}
                      height={40}
                      alt="User image"
                    />
                    <div>
                      <span className="font-semibold text-foreground truncate leading-5 text-sm">
                        {user.displayName}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                        <Discord className="h-4 w-4" />
                        {user.discord}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-8">
              <div
                key={displayTournament.winner_user?.uid}
                className="flex items-center gap-2"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={displayTournament.winner_user?.photoUrl || ""}
                  width={40}
                  height={40}
                  alt="User image"
                />
                <div>
                  <span className="font-semibold text-foreground truncate leading-5 text-sm">
                    {displayTournament.winner_user?.displayName}
                  </span>
                  {displayTournament.winner_user?.discord && (
                    <span className="flex items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                      <Discord className="h-4 w-4" />
                      {displayTournament.winner_user?.discord}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-8"
      >
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Формат"
          value={
            isTeamMode
              ? `${displayTournament.players_per_team}v${displayTournament.players_per_team}`
              : "1v1"
          }
        />
        <StatCard
          icon={<Hash className="h-4 w-4" />}
          label={isTeamMode ? "Команд" : "Игроков"}
          value={`${filledSlots} / ${isTeamMode ? displayTournament.max_teams : displayTournament.max_players}`}
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          label="Начало"
          value={
            displayTournament.start_date
              ? format(
                  new Date(displayTournament.start_date),
                  "dd/MM/yyyy HH:mm",
                )
              : "Скоро"
          }
        />
        <StatCard
          icon={<User className="h-4 w-4" />}
          label="Статус"
          value={
            statuses[displayTournament.status as keyof typeof statuses] || "—"
          }
          highlight
        />
      </motion.div>

      {(displayTournament.status === "open" ||
        displayTournament.status === "about_to_start") && (
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
                isTeamMode
                  ? (displayTournament.teams?.length /
                      displayTournament.max_teams) *
                      100
                  : (displayTournament.users?.length /
                      displayTournament.max_players) *
                      100,
              )}
              %
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{
                width: `${((filledSlots || 0) / (displayTournament.max_players || 1)) * 100}%`,
              }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <AddJudgeBlock
          tournamentStatus={displayTournament.status}
          judges={displayTournament.judges || []}
          isTeamTournament={displayTournament.type.value === "team"}
          teams={displayTournament.teams || []}
          users={displayTournament.users || []}
        />
      </motion.section>

      <motion.section
        className="mt-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {isTeamMode ? "Команды" : "Участники"} ({filledSlots} /{" "}
            {isTeamMode
              ? displayTournament.max_teams
              : displayTournament.max_players}
            )
          </h2>

          {displayTournament.status === "open" && (
            <JoinTournamentButton
              isFull={isFull}
              handleOpenCreateTeamModal={handleOpenCreateTeamModal}
              handleJoinLeave={handleJoinLeave}
              isTeamMode={isTeamMode}
              isLoading={isLoading}
              canCreateTeam={isUserCanCreateTeam}
              isJoinedSingleTournament={
                !isTeamMode
                  ? displayTournament.users?.some(
                      (user) => user.uid === currentUser?.uid,
                    )
                  : undefined
              }
            />
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
            teams={displayTournament.teams || []}
            judges={displayTournament.judges || []}
            tournamentId={displayTournament.id}
            maxPlayersPerTeam={displayTournament.players_per_team}
            isLoading={isLoading}
            tournament_status={displayTournament.status}
          />
        ) : (
          <UserList
            users={displayTournament.users || []}
            handleClickDelete={handleRemoveUserFromTournament}
          />
        )}
      </motion.section>

      <CustomModal isOpen={showEditModal} onClose={handleCloseEditModal}>
        <EditModal
          {...editForm}
          isLoading={isLoading}
          onInputChange={handleUpdateEditField}
          onTextareaChange={handleUpdateTextField}
          onTeamAmountChange={handleUpdateTeamAmount}
          onStartDateChange={handleUpdateStartDate}
          onClose={handleCloseEditModal}
          handleChangeMaxTeamsOrPlayers={handleChangeMaxTeamsOrPlayers}
          handleChangeTournamentType={handleUpdateTournamentType}
          handleRewardChange={handleRewardChange}
          handleAddReward={handleAddReward}
          handleDeleteReward={handleDeleteReward}
          handleChangeDuration={handleChangeDuration}
          onSubmit={handleEdit}
        />
      </CustomModal>

      <CustomModal isOpen={showDeleteConfirm} onClose={handleCloseDeleteModal}>
        <DeleteTournamentModal
          isLoading={isLoading}
          onClose={handleCloseDeleteModal}
          onSubmit={handleDelete}
        />
      </CustomModal>

      <CustomModal
        isOpen={isCreateTeamModalOpen}
        onClose={handleCloseCreateTeamModal}
      >
        <CreateTeamModal
          tournamentId={displayTournament.id}
          onClose={handleCloseCreateTeamModal}
        />
      </CustomModal>

      <CustomModal
        isOpen={isWinnerModalOpen}
        onClose={handleCloseSelectWinnerModal}
      >
        {isTeamMode ? (
          <SelectWinnerTeamModal
            teams={displayTournament.teams || []}
            onClose={handleCloseSelectWinnerModal}
          />
        ) : (
          <SelectWinnerUserModal
            users={displayTournament.users || []}
            onClose={handleCloseSelectWinnerModal}
          />
        )}
      </CustomModal>
    </main>
  );
};

export default TournamentPage;
