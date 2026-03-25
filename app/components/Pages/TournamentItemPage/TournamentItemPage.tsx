"use client";

import TournamentStatBlocks from "@/app/components/TournamentPage/TournamentStatBlocks/TournamentStatBlocks";
import {
  removeTournament,
  updateTournament,
} from "@/app/utils/store/tournamentsSlice";
import DeleteTournamentModal from "@/app/components/DeleteTournamentModal/DeleteTournamentModal";
import SelectWinnerTeamModal from "@/app/components/SelectWinnerTeamModal/SelectWinnerTeamModal";
import SelectWinnerUserModal from "@/app/components/SelectWinnerUserModal/SelectWinnerUserModal";
import JoinTournamentButton from "@/app/components/JoinTournamentButton/JoinTournamentButton";
import TournamentHero from "@/app/components/TournamentPage/TournamentHero/TournamentHero";
import EditTournamentModal from "@/app/components/EditTournamentModal/EditTournamentModal";
import AddJudgeBlock from "@/app/components/Shared/AddJudgeBlock/AddJudgeBlock";
import CreateTeamModal from "@/app/components/CreateTeamModal/CreateTeamModal";
import TwitchPlayer from "@/app/components/Shared/StreamFrame/StreamFrame";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { useAppSelector, useAppDispatch } from "@/app/utils/store/hooks";
import WinnerBlock from "@/app/components/WinnerBlock/WinnerBlock";
import TeamList from "@/app/components/TeamsList/TeamsList";
import { Users, Loader2, AlertCircle } from "lucide-react";
import UserList from "@/app/components/UserList/UserList";
import { useParams, useRouter } from "next/navigation";
import { ITournament } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import Script from "next/script";
import Link from "next/link";
import axios from "axios";

export const statuses = {
  open: "Открыт",
  closed: "Закрыт",
  about_to_start: "Регистрация закрыта",
  in_progress: "LIVE",
  finished: "Окончен",
  archived: "В архиве",
};

const TournamentItemPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const [isTournamentLoading, setIsTournamentLoading] = useState(true);
  const tournamentId = params.id as string;
  const { tournaments } = useAppSelector((state) => state.tournaments);

  const tournament = tournaments.find(
    (tournament) => tournament.id === tournamentId,
  );

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
    if (!currentUser?.id || !tournament?.id) {
      setErrorMsg("Войдите в аккаунт");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const url = `/api/tournaments/${tournament.id}/single`;

      if (isJoined) {
        await axios.delete(url, {
          data: { userId: currentUser?.id },
        });

        const updatedTournament = {
          ...tournament,
          registrations:
            tournament.registrations?.filter(
              (reg) => reg.profile_id !== currentUser?.id,
            ) || [],
        };

        dispatch(updateTournament(updatedTournament));
      } else {
        const { data: newRegistration } = await axios.post(url, {
          userId: currentUser?.id,
        });

        const updatedTournament = {
          ...tournament,
          registrations: [...(tournament.registrations || []), newRegistration],
        };

        dispatch(updateTournament(updatedTournament));
      }
    } catch (err: any) {
      console.error("Axios Error:", err.response?.data || err.message);
      setErrorMsg(err.response?.data?.error || "Не удалось обновить участие");
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

  const handleUpdateTournament = (data: ITournament) => {
    dispatch(updateTournament(data));
  };

  const handleLoadTournament = async () => {
    setIsTournamentLoading(true);
    try {
      const { data } = await axios.get(`/api/tournaments/${tournamentId}`);
      handleUpdateTournament(data);
    } catch (error) {
      toast.error("Ошибка загрузки турнира " + tournamentId);
      console.log(error);
    } finally {
      setIsTournamentLoading(false);
    }
  };

  useEffect(() => {
    handleLoadTournament();
  }, []);

  const handleDelete = async () => {
    if (!canEdit || !tournament?.id) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      await axios.delete(`/api/tournaments/${tournament.id}`);

      toast.success("Турнир удален");
      dispatch(removeTournament({ tournamentId: tournament.id }));
      router.replace("/tournaments");
    } catch (err: any) {
      console.error("Delete error:", err.response?.data || err.message);
      const errorText =
        err.response?.data?.error || "Не удалось удалить турнир";
      toast.error(errorText);
      setErrorMsg(errorText);
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

  const isTeamMode = tournament.type === "team";
  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.registrations?.length || 0;

  const isFull =
    tournament.type === "team"
      ? tournament.teams.length === tournament.max_teams
      : tournament.registrations?.length === tournament.max_players;

  const isCurrentUserJudge = tournament.judges?.some(
    (judge) => judge.profile_id === currentUser?.id,
  );
  const isUserHasTeam = tournament.teams?.some((team) =>
    team.members?.some((member) => member.profile_id === currentUser?.id),
  );

  const isUserCanCreateTeam =
    !isCurrentUserJudge && !isUserHasTeam && currentUser?.role !== "guest";
  const isBracketMode = tournament?.is_bracket === true;

  const canEdit =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";
  const isJoined =
    tournament?.registrations?.some(
      (registration) => registration.profile_id === currentUser?.id,
    ) ?? false;

  return (
    <main className="w-full px-4 py-8">
      <TournamentHero
        tournament={tournament}
        onDeleteClick={handleOpenDeleteModal}
        handleClickDeleteWinner={handleOpenSelectWinnerModal}
        handleClickEdit={handleOpenEditModal}
      />

      {tournament.status === "finished" && (
        <WinnerBlock
          winner_team={tournament.winner_team}
          winner_user={tournament.winner_user}
        />
      )}

      <TournamentStatBlocks tournament={tournament} />

      {tournament.status === "finished" && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-2 max-w-5xl mx-auto bg-card p-3 rounded-lg font-mono text-xs"
        >
          <p>
            По желанию, оставьте ваш отзыв о проведенном турнире на{" "}
            <Link href="/contact" className="underline">
              странице обратной связи
            </Link>
          </p>
        </motion.section>
      )}

      {tournament.status === "in_progress" && tournament.stream_link?.[0] && (
        <div className="mx-auto max-w-7xl mb-12 border border-border">
          <Script
            src="https://embed.twitch.tv/embed/v1.js"
            strategy="lazyOnload"
          />

          <TwitchPlayer link={tournament?.stream_link} />
        </div>
      )}

      {/* {isBracketMode && tournament.status !== "open" && (
        <div className="mt-6 bg-muted/20 rounded-2xl p-6 border border-border/50 backdrop-blur-md max-w-480 mx-auto w-fit">
          <BracketTournamentView tournament={tournament} />
        </div>
      )} */}

      {(tournament.status === "open" ||
        tournament.status === "about_to_start") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-8 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Заполнено слотов
            </span>
            <span className="text-xs font-mono text-primary">
              {Math.round(
                isTeamMode
                  ? (tournament.teams.length / tournament.max_teams) * 100
                  : (tournament.registrations.length / tournament.max_players) *
                      100,
              )}
              %
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{
                width: `${((filledSlots || 0) / (tournament.type === "team" ? tournament.max_teams : tournament.max_players || 1)) * 100}%`,
              }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
      <motion.section
        className="mt-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <AddJudgeBlock
          tournamentStatus={tournament.status}
          judges={tournament.judges}
          isTeamTournament={tournament.type === "team"}
          teams={tournament.teams}
          registrations={tournament.registrations}
        />
      </motion.section>

      <motion.section
        className="mt-4 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          {tournament.type !== "bracket" && (
            <>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-mono ">
                  {isTeamMode ? "Команды" : "Участники"}
                </span>
                <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {filledSlots} /{" "}
                  {isTeamMode ? tournament.max_teams : tournament.max_players}
                </span>
              </div>

              {tournament.status === "open" && (
                <JoinTournamentButton
                  isFull={isFull}
                  handleOpenCreateTeamModal={handleOpenCreateTeamModal}
                  handleJoinLeave={handleJoinLeave}
                  isTeamMode={isTeamMode}
                  isLoading={isLoading}
                  canCreateTeam={isUserCanCreateTeam}
                  canJoinSingleTournament={
                    !tournament.judges?.some(
                      (judge) => currentUser?.id === judge.profile_id,
                    )
                  }
                  isJoinedSingleTournament={
                    !isTeamMode
                      ? tournament.registrations.some(
                          (registration) =>
                            registration.profile_id === currentUser?.id,
                        )
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
            judges={tournament.judges}
            maxPlayersPerTeam={tournament.players_per_team}
            isLoading={isLoading}
            tournament_status={tournament.status}
          />
        ) : (
          <UserList registrations={tournament.registrations} />
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
            registrations={tournament.registrations}
            onClose={handleCloseSelectWinnerModal}
          />
        )}
      </CustomModal>
    </main>
  );
};

export default TournamentItemPage;
