import { updateTournamentStatus } from "@/app/utils/store/tournamentsSlice";
import CustomButton from "../../Shared/CustomButton/CustomButton";
import {
  Album,
  Archive,
  Calendar,
  Clock,
  Edit,
  Gamepad2,
  Hash,
  Trash2,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { format } from "date-fns";
import { statuses } from "@/app/(app)/tournaments/[id]/page";
import { useParams, useRouter } from "next/navigation";
import Tag from "../../Shared/Tag/Tag";
import Title from "../../Title/Title";
import TournamentDurationDisplay from "../../Shared/TournamentDurationDisplay/TournamentDurationDisplay";
import CleanHtml from "../../Shared/CleanHtml/CleanHtml";
import Badge from "../../Shared/Badge/Badge";
import { ITournament } from "@/app/lib/types";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import GameLine from "../../Shared/GameLine/GameLine";
import StatCard from "../../Shared/StatCard/StatCard";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ITournamentHeroProps {
  tournament: ITournament;
  onDeleteClick: () => void;
  handleClickDeleteWinner: () => void;
  handleClickEdit?: () => void;
}

const TournamentHero = ({
  tournament,
  onDeleteClick,
  handleClickDeleteWinner,
  handleClickEdit,
}: ITournamentHeroProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const isTeamMode = tournament.type === "team";
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const canEditTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const handleCloseRegistration = async () => {
    setIsLoading(true);
    try {
      await axios.put(`/api/tournaments/${tournament.id}/status`, {
        status: "about_to_start",
        started_at: null,
      });
      dispatch(
        updateTournamentStatus({ tournamentId: id, status: "about_to_start" }),
      );
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTournament = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        `/api/tournaments/${tournament.id}/status`,
        {
          status: "in_progress",
          started_at: new Date().toISOString(),
        },
      );

      dispatch(
        updateTournamentStatus({
          tournamentId: id,
          status: "in_progress",
          started_at: data.data.started_at,
        }),
      );
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArhiveTournament = async () => {
    const isConfirmed = confirm(
      "Вы уверены? Турнир будет перенесен в архив и удален из текущего списка. Это действие необратимо.",
    );

    if (!isConfirmed) return;

    try {
      await axios.post(`/api/tournaments/${tournament.id}/archive`);

      toast.success("Турнир успешно архивирован!");

      router.push("/tournaments");
      router.refresh();
    } catch (error: any) {
      console.error("Ошибка архивации:", error);
      const errorMessage =
        error.response?.data?.error || "Не удалось архивировать турнир";
      toast.error(errorMessage);
    }
  };

  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.registrations?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden max-w-5xl mx-auto rounded-2xl mb-8`}
    >
      <div className="absolute inset-0 -top-8 h-60 bg-linear-to-b from-primary/15 to-transparent rounded-3xl pointer-events-none" />
      {canEditTournament && (
        <div className="flex px-8 py-4 flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between border-b">
          <div>
            <div className="flex items-center gap-4">
              {tournament.creator && (
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-mono">Создатель</span>
                  <Link
                    href={`/users/${tournament.creator_id}`}
                    className="cursor-pointer group"
                  >
                    <div className="mt-1 flex gap-2 items-center">
                      <Image
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-full"
                        src={tournament?.creator?.image_url || ""}
                        alt="User photo"
                      />
                      <span className="text-xs font-mono font-bold group-hover:underline">
                        {tournament?.creator?.full_name}
                      </span>
                    </div>
                  </Link>
                </div>
              )}
              {tournament?.created_at && (
                <div className="flex flex-col justify-between border-l border-border px-4 text-xs font-mono">
                  <span>Время создания</span>
                  <div className="mt-1 flex gap-2 items-center">
                    {format(tournament?.created_at, "dd.MM.yyyy HH:mm")}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {tournament.status === "open" && (
              <CustomButton
                icon={<Album className="h-4 w-4" />}
                label="Закрыть регистрацию"
                isLoading={isLoading}
                onClick={handleCloseRegistration}
              />
            )}
            {tournament.status === "about_to_start" && (
              <CustomButton
                icon={<Trophy className="h-4 w-4" />}
                label="Начать турнир"
                isLoading={isLoading}
                onClick={handleStartTournament}
              />
            )}
            {tournament.status === "in_progress" && (
              <CustomButton
                icon={<Trophy className="h-4 w-4" />}
                label="Закончить и выбрать победителя"
                onClick={handleClickDeleteWinner}
              />
            )}
            {tournament.status === "finished" && (
              <CustomButton
                icon={<Archive className="h-4 w-4" />}
                label="Архивировать"
                onClick={handleArhiveTournament}
              />
            )}
            {tournament.status !== "finished" && handleClickEdit && (
              <CustomButton
                icon={<Edit className="h-4 w-4 text-amber-600" />}
                className="py-1.5 px-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-white border border-amber-600!"
                onClick={handleClickEdit}
              />
            )}
            <CustomButton
              icon={<Trash2 className="h-4 w-4 text-red-600" />}
              className="py-1.5 px-2.5 bg-red-600/20 hover:bg-red-600/40 text-white border border-red-600!"
              onClick={onDeleteClick}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "block px-8 relative mt-6",
          !canEditTournament && "pt-8!",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge
              className="bg-primary/10 text-primary font-bold tracking-wider"
              text={statuses[tournament.status as keyof typeof statuses]}
            />
            <span className="px-3 py-1 font-mono rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {isTeamMode ? "Командный" : "Одиночный"}
            </span>

            {tournament.hidden && (
              <Badge
                text="Скрыт"
                className="bg-amber-400 text-black border border-destructive/20"
              />
            )}
            {tournament.tags?.map((tag) => (
              <Tag key={tag.id} {...tag} />
            ))}
          </div>
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
              src={tournament.game?.image_url}
              width={24}
              height={24}
              className="w-6 h-6 object-cover rounded-xs"
              alt="Game image"
            />
            <div className="text-xs text-foreground/75 font-mono">
              {tournament?.game?.name}
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
              <TournamentDurationDisplay
                duration={tournament.duration}
                status={tournament.status}
                plain
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-foreground/75 font-mono text-xs">
            <Calendar className="h-4 w-4" />
            {tournament.start_date
              ? format(new Date(tournament.start_date), "dd MMMM yyyy HH:mm", {
                  locale: ru,
                })
              : "Скоро"}
          </div>
        </motion.div>

        <div className="mt-2 whitespace-pre-wrap">
          <CleanHtml html={tournament.description} />
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentHero;
