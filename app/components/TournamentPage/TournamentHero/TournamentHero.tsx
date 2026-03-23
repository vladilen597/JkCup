import { updateTournamentStatus } from "@/app/utils/store/tournamentsSlice";
import CustomButton from "../../Shared/CustomButton/CustomButton";
import {
  Album,
  Archive,
  Clock,
  Edit,
  Gamepad2,
  Trash2,
  Trophy,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden max-w-5xl mx-auto rounded-2xl mb-8`}
    >
      <div className="absolute inset-0 -top-8 h-60 bg-linear-to-b from-primary/15 to-transparent rounded-3xl pointer-events-none" />
      <div className="flex px-8 py-4 flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between border-b">
        <div>
          {canEditTournament && (
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
          )}
        </div>
        {canEditTournament && (
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
        )}
      </div>

      <div className="block px-8 relative mt-6">
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

        <div className="flex items-stretch gap-2 mt-2">
          <StatCard
            label="Игра"
            icon={<Gamepad2 className="w-4 h-4" />}
            content={
              <div className="flex items-center gap-2">
                {tournament.game?.image_url ? (
                  <Image
                    className="object-cover rounded h-8 w-8"
                    src={tournament.game?.image_url}
                    width={32}
                    height={32}
                    alt="Game image"
                  />
                ) : (
                  <Gamepad2 />
                )}
                <span className="font-bold">{tournament.game?.name}</span>
              </div>
            }
          />
          <StatCard
            label="Длительность"
            icon={<Clock className="w-4 h-4" />}
            content={
              <TournamentDurationDisplay
                duration={tournament.duration}
                startedAt={tournament.started_at}
                status={tournament.status}
                plain
              />
            }
          />
        </div>

        <div className="mt-4 whitespace-pre-wrap">
          <CleanHtml html={tournament.description} />
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentHero;
