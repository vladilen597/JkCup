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
  TrophyIcon,
  Crown,
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
} from "@/app/utils/store/tournamentsSlice";
import TeamList from "@/app/components/TeamsList/TeamsList";
import DeleteTournamentModal from "@/app/components/DeleteTournamentModal/DeleteTournamentModal";
import CreateTeamModal from "@/app/components/CreateTeamModal/CreateTeamModal";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import JoinTournamentButton from "@/app/components/JoinTournamentButton/JoinTournamentButton";
import AddJudgeBlock from "@/app/components/Shared/AddJudgeBlock/AddJudgeBlock";
import SelectWinnerTeamModal from "@/app/components/SelectWinnerTeamModal/SelectWinnerTeamModal";
import SelectWinnerUserModal from "@/app/components/SelectWinnerUserModal/SelectWinnerUserModal";
import UserInfoBlock from "@/app/components/Shared/UserInfoBlock/UserInfoBlock";
import BracketTournamentView from "@/app/components/BracketTournamentView/BracketTournamentView";
import WinnerTeam from "@/app/components/WinnerTeam/WinnerTeam";
import TournamentHero from "@/app/components/TournamentPage/TournamentHero/TournamentHero";
import TournamentStatBlocks from "@/app/components/TournamentPage/TournamentStatBlocks/TournamentStatBlocks";
import EditTournamentModal from "@/app/components/EditTournamentModal/EditTournamentModal";

export const statuses = {
  open: "Открыт",
  closed: "Закрыт",
  about_to_start: "Регистрация закрыта",
  in_progress: "LIVE",
  finished: "Окончен",
};

const TournamentPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const [isTournamentLoading, setIsTournamentLoading] = useState(true);
  const tournamentId = params.id as string;

  const tournament = tournaments.find((t) => t.id === params.id);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleOpenCreateTeamModal = () => {
    setIsCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setIsCreateTeamModalOpen(false);
  };

  const handleOpenSelectWinnerModal = () => {
    setIsWinnerModalOpen(true);
  };

  const handleCloseSelectWinnerModal = () => {
    setIsWinnerModalOpen(false);
  };

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
          usersIds: arrayRemove(currentUser.uid),
        });

        dispatch(
          removeParticipant({
            tournamentId: tournament.id,
            userId: currentUser.uid,
          }),
        );
      } else {
        await updateDoc(tournamentRef, {
          usersIds: arrayUnion(currentUser.uid),
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

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    setIsTournamentLoading(true);

    const tournamentRef = doc(db, "tournaments", params.id as string);

    const unsubscribe = onSnapshot(
      tournamentRef,
      (tournamentDoc) => {
        try {
          if (tournamentDoc.exists()) {
            const tournamentData = {
              ...(tournamentDoc.data() as ITournament),
              id: tournamentDoc.id,
            };

            if (tournaments.some((t) => t.id === tournamentDoc.id)) {
              dispatch(updateTournament(tournamentData));
            } else {
              dispatch(setTournaments([tournamentData]));
            }
          }
        } catch (error) {
          console.error("Ошибка при получении данных:", error);
        } finally {
          setIsTournamentLoading(false);
        }
      },
      (error) => {
        console.error("Ошибка Snapshot:", error);
        setIsTournamentLoading(false);
      },
    );

    return () => unsubscribe();
  }, [params.id, dispatch]);

  const handleRemoveUserFromTournament = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const user = (await getDoc(userRef)).data();
      const tournamentRef = doc(db, "tournaments", tournamentId);
      updateDoc(tournamentRef, {
        usersIds: arrayRemove(user),
      });
      dispatch(removeUserFromSingleTournament({ tournamentId, userId }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!canEdit || !tournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      await deleteDoc(doc(db, "tournaments", tournament.id));

      dispatch(
        setTournaments(tournaments.filter((t) => t.id !== tournament.id)),
      );
      router.replace("/tournaments");
    } catch (err: any) {
      console.error("Delete error:", err);
      setErrorMsg("Не удалось удалить турнир");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isTournamentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        Загрузка турнира...
      </div>
    );
  }

  if (!tournament && !isTournamentLoading) {
    return (
      <div className="flex flex-col font-mono! items-center justify-center min-h-[80vh]">
        <h2 className="text-[120px] font-bold! font-mono! text-primary">404</h2>
        <span className="text-[24px]">Турнир не найден</span>
      </div>
    );
  }

  const isTeamMode = tournament.type.value === "team";
  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.usersIds?.length || 0;

  const isFull =
    tournament.players_per_team > 1
      ? tournament.teams.length === tournament.max_teams
      : tournament.usersIds.length === tournament.max_players;

  const isCurrentUserJudge = tournament.judgesIds.includes(currentUser.uid);
  const isUserHasTeam = tournament.teams?.some((team) =>
    team.usersIds?.includes(currentUser.uid),
  );

  const isUserCanCreateTeam =
    !isCurrentUserJudge && !isUserHasTeam && currentUser.role !== "guest";
  const isBracketMode = tournament?.useBracket === true;

  const canEdit =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";
  const isJoined = tournament?.usersIds?.includes(currentUser?.uid) ?? false;

  return (
    <main className="w-full px-4 py-8">
      <TournamentHero
        tournament={tournament}
        onDeleteClick={handleOpenDeleteModal}
        handleClickDeleteWinner={handleOpenSelectWinnerModal}
        handleClickEdit={handleOpenEditModal}
      />

      {tournament.status === "finished" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-between border-2 p-4 border-amber-300! rounded-lg overflow-hidden bg-linear-120 from-40% from-black to-amber-300"
        >
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8 text-amber-300" />
              {isTeamMode ? "Команда победителей" : "Победитель"}
            </h3>

            {isTeamMode ? (
              <div className="mt-8">
                <span className="text-xl font-bold flex items-center gap-2">
                  {tournament.winner_team?.name}
                </span>
                <WinnerTeam usersIds={tournament.winner_team?.usersIds || []} />
              </div>
            ) : (
              <div className="mt-8">
                <div
                  key={tournament.winner_user?.uid}
                  className="flex items-center gap-2"
                >
                  <UserInfoBlock {...tournament.winner_user} />
                </div>
              </div>
            )}
          </div>
          <Crown className="text-black" width={120} height={120} />
        </motion.div>
      )}

      <TournamentStatBlocks tournament={tournament} />

      {isBracketMode && tournament.status !== "open" && (
        <div className="mt-6 bg-muted/20 rounded-2xl p-6 border border-border/50 backdrop-blur-md max-w-480 mx-auto w-fit">
          <BracketTournamentView tournament={tournament} />
        </div>
      )}

      {(tournament.status === "open" ||
        tournament.status === "about_to_start") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="my-8 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Заполнено слотов
            </span>
            <span className="text-xs font-mono text-primary">
              {Math.round(
                isTeamMode
                  ? (tournament.teams.length / tournament.max_teams) * 100
                  : (tournament.usersIds.length / tournament.max_players) * 100,
              )}
              %
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{
                width: `${((filledSlots || 0) / (tournament.type.value === "team" ? tournament.max_teams : tournament.max_players || 1)) * 100}%`,
              }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      <motion.section
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <AddJudgeBlock
          tournamentStatus={tournament.status}
          judgesIds={tournament.judgesIds}
          isTeamTournament={tournament.type.value === "team"}
          teams={tournament.teams}
          usersIds={tournament.usersIds}
        />
      </motion.section>

      <motion.section
        className="mt-4 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          {tournament.type.value !== "bracket" && (
            <>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {isTeamMode ? "Команды" : "Участники"} ({filledSlots} /{" "}
                {isTeamMode ? tournament.max_teams : tournament.max_players})
              </h2>

              {tournament.status === "open" && (
                <JoinTournamentButton
                  isFull={isFull}
                  handleOpenCreateTeamModal={handleOpenCreateTeamModal}
                  handleJoinLeave={handleJoinLeave}
                  isTeamMode={isTeamMode}
                  isLoading={isLoading}
                  canCreateTeam={isUserCanCreateTeam}
                  isJoinedSingleTournament={
                    !isTeamMode
                      ? tournament.usersIds.includes(currentUser.uid)
                      : undefined
                  }
                />
              )}
            </>
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
            judgesIds={tournament.judgesIds}
            maxPlayersPerTeam={tournament.players_per_team}
            isLoading={isLoading}
            tournament_status={tournament.status}
          />
        ) : (
          <UserList usersIds={tournament.usersIds} />
        )}
      </motion.section>

      <CustomModal isOpen={showEditModal} onClose={handleCloseEditModal}>
        <EditTournamentModal
          tournament={tournament}
          onClose={handleCloseEditModal}
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
          tournamentId={tournament.id}
          onClose={handleCloseCreateTeamModal}
        />
      </CustomModal>

      <CustomModal
        isOpen={isWinnerModalOpen}
        onClose={handleCloseSelectWinnerModal}
      >
        {isTeamMode ? (
          <SelectWinnerTeamModal
            teams={tournament.teams}
            onClose={handleCloseSelectWinnerModal}
          />
        ) : (
          <SelectWinnerUserModal
            usersIds={tournament.usersIds}
            onClose={handleCloseSelectWinnerModal}
          />
        )}
      </CustomModal>
    </main>
  );
};

export default TournamentPage;
