"use client";

import TournamentStatBlocks from "@/app/components/TournamentPage/TournamentStatBlocks/TournamentStatBlocks";
import { removeTournament } from "@/app/utils/store/tournamentsSlice";
import DeleteTournamentModal from "@/app/components/DeleteTournamentModal/DeleteTournamentModal";
import SelectWinnerTeamModal from "@/app/components/SelectWinnerTeamModal/SelectWinnerTeamModal";
import SelectWinnerUserModal from "@/app/components/SelectWinnerUserModal/SelectWinnerUserModal";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { useAppSelector, useAppDispatch } from "@/app/utils/store/hooks";
import CleanHtml from "@/app/components/Shared/CleanHtml/CleanHtml";
import WinnerBlock from "@/app/components/WinnerBlock/WinnerBlock";
import TeamList from "@/app/components/TeamsList/TeamsList";
import {
  Users,
  Loader2,
  AlertCircle,
  Gamepad2,
  Trash2,
  Calendar,
  Hash,
  User,
  Trophy,
  Clock,
} from "lucide-react";
import UserList from "@/app/components/UserList/UserList";
import { useParams, useRouter } from "next/navigation";
import { IArchivedTournament } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import Image from "next/image";
import axios from "axios";
import Title from "@/app/components/Title/Title";
import Tag from "@/app/components/Shared/Tag/Tag";
import Badge from "@/app/components/Shared/Badge/Badge";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import { format } from "date-fns";
import StatCard from "@/app/components/Shared/StatCard/StatCard";
import JudgeList from "@/app/components/Shared/AddJudgeBlock/JudgeList/JudgeList";
import { cn } from "@/lib/utils";
import RulesExpandableBlock from "@/app/components/RulesExpandableBlock/RulesExpandableBlock";
import { ru } from "date-fns/locale";

export const statuses = {
  open: "Открыт",
  closed: "Закрыт",
  about_to_start: "Регистрация закрыта",
  in_progress: "LIVE",
  finished: "Окончен",
  archived: "В архиве",
};

const trophyStyles = {
  0: {
    icon: "text-gold",
    container: "from-gold/20 to-gold-dark/10 border-gold/20!",
  },
  1: {
    icon: "text-silver",
    container: "from-silver/20 to-silver-dark/10 border-silver/20!",
  },
  2: {
    icon: "text-bronze",
    container: "from-bronze/20 to-bronze-dark/10 border-bronze/20!",
  },
};

const ArchiveTournamentPage = () => {
  const [tournament, setTournament] = useState<IArchivedTournament>();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const [isTournamentLoading, setIsTournamentLoading] = useState(true);
  const tournamentId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenSelectWinnerModal = () => {
    setIsWinnerModalOpen(true);
  };

  const handleCloseSelectWinnerModal = () => {
    setIsWinnerModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  const handleLoadTournament = async () => {
    setIsTournamentLoading(true);
    try {
      const { data } = await axios.get(
        `/api/tournaments/archive/${tournamentId}`,
      );
      setTournament(data);
    } catch (error) {
      toast.error("Ошибка загрузки турнира из архива " + tournamentId);
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
      await axios.delete(`/api/tournaments/archive/${tournament.id}`);

      toast.success("Турнир удален из архива");
      dispatch(removeTournament({ tournamentId: tournament.id }));
      router.replace("/archive");
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
    ? tournament.teams.length || 0
    : tournament.registrations.length || 0;

  // const isBracketMode = tournament?.is_bracket === true;
  console.log(tournament);
  const canEdit =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";

  const winner = tournament.registrations.find(
    (participant) => participant.is_winner,
  );

  const canEditTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  return (
    <main className="w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden max-w-5xl mx-auto rounded-t-2xl p-4 md:p-12 mb-8  ${canEditTournament && "pt-4!"}`}
      >
        <div className="absolute inset-0 -top-8 h-60 bg-linear-to-b from-primary/15 to-transparent rounded-3xl pointer-events-none" />
        <div className="block relative mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge
                className="bg-primary/10 text-primary font-bold tracking-wider"
                text={statuses[tournament.status as keyof typeof statuses]}
              />
              <span className="px-3 py-1 font-mono rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {isTeamMode ? "Командный" : "Одиночный"}
              </span>
              {tournament.tags?.map((tag) => (
                <Tag key={tag.id} {...tag} />
              ))}
            </div>

            {canEditTournament && (
              <div className="flex gap-3">
                <CustomButton
                  icon={<Trash2 className="h-4 w-4 text-red-600" />}
                  className="py-1.5 px-2.5 bg-red-600/20 hover:bg-red-600/40 text-white border border-red-600!"
                  onClick={handleDelete}
                />
              </div>
            )}
          </div>

          <Title title={tournament.name} className="mt-2" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2 max-w-5xl mx-auto py-4 border-b border-border"
          >
            <div className="flex items-center gap-2">
              <Image
                src={tournament.game_snapshot?.image_url}
                width={24}
                height={24}
                className="w-6 h-6 object-cover rounded-xs"
                alt="Game image"
              />
              <div className="text-xs text-foreground/75 font-mono">
                {tournament?.game_snapshot?.name}
              </div>
            </div>
            <div className="flex items-center gap-2 text-foreground/75 font-mono text-xs">
              <Users className="h-4 w-4" />
              <div className="text-xs text-foreground/75 font-mono">
                {isTeamMode
                  ? `${tournament.players_per_team}v${tournament.players_per_team}`
                  : "1v1"}
              </div>
            </div>
            <div className="flex items-center gap-2 text-foreground/75 font-mono text-xs">
              <Hash className="h-4 w-4" />
              <div className="text-xs text-foreground/75 font-mono">
                {filledSlots} /{" "}
                {isTeamMode ? tournament.max_teams : tournament.max_players}
              </div>
            </div>
            {!!tournament.duration && (
              <div className="flex items-center gap-2 text-foreground/75 font-mono text-xs">
                <Clock className="h-4 w-4" />
                {tournament.duration}
              </div>
            )}
            <div className="flex items-center gap-2 text-foreground/75 font-mono text-xs">
              <Calendar className="h-4 w-4" />
              {tournament.start_date
                ? format(
                    new Date(tournament.start_date),
                    "dd MMMM yyyy HH:mm",
                    {
                      locale: ru,
                    },
                  )
                : "Скоро"}
            </div>
          </motion.div>

          <div className="mt-4">
            <CleanHtml html={tournament.description} />
          </div>
        </div>
      </motion.div>

      {tournament.status === "archived" && (
        <WinnerBlock
          winner_team={tournament.winner_team}
          winner_user={winner.profile}
        />
      )}

      <section>
        {!!tournament.rewards?.length && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl p-4 bg-card hover:border-primary/20 transition-colors mt-2 max-w-5xl mx-auto "
          >
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono tracking-widest">
              <Trophy className="h-4 w-4 " />
              Награды
            </div>
            <ul className="mt-1.5 space-y-2">
              {tournament.rewards?.map((reward, index) => (
                <div className="flex items-center gap-2" key={reward.id}>
                  {index < 2 ? (
                    <div
                      className={cn(
                        "flex p-2 items-center justify-center rounded-xl bg-linear-to-br border",
                        trophyStyles[index].container,
                      )}
                    >
                      <Trophy
                        className={cn("w-6 h-6", trophyStyles[index].icon)}
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                  <div>
                    <span className="block font-mono text-neutral-400 text-xs">
                      {index + 1}-е место
                    </span>
                    <p className="leading-5 block text-lg font-bold font-mono text-foreground">
                      {reward.value}
                    </p>
                  </div>
                </div>
              ))}
            </ul>
          </motion.div>
        )}
        {!!tournament.rules && tournament?.rules !== "<p></p>" && (
          <div className="mt-2 max-w-5xl mx-auto">
            <RulesExpandableBlock html={tournament.rules} />
          </div>
        )}
      </section>

      {/* {isBracketMode && (
        <div className="mt-6 bg-muted/20 rounded-2xl p-6 border border-border/50 backdrop-blur-md max-w-480 mx-auto w-fit">
          <BracketTournamentView tournament={tournament} />
        </div>
      )} */}

      <motion.section
        className="mt-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {tournament.judges.length > 0 && (
          <JudgeList judges={tournament.judges} hideDelete />
        )}
      </motion.section>

      <motion.section
        className="mt-4 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-mono ">
            {isTeamMode ? "Команды" : "Участники"}
          </span>
          <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            ({filledSlots} /{" "}
            {isTeamMode ? tournament.max_teams : tournament.max_players})
          </span>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

        <div className="mt-2">
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
        </div>
      </motion.section>

      <CustomModal isOpen={showDeleteConfirm} onClose={handleCloseDeleteModal}>
        <DeleteTournamentModal
          isLoading={isLoading}
          onClose={handleCloseDeleteModal}
          onSubmit={handleDelete}
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

export default ArchiveTournamentPage;
