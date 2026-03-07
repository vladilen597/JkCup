import {
  ITournament,
  updateTournamentStatus,
} from "@/app/utils/store/tournamentsSlice";
import CustomButton from "../../Shared/CustomButton/CustomButton";
import { Album, Archive, Edit, Gamepad2, Trash2, Trophy } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { format } from "date-fns";
import { statuses } from "@/app/(app)/tournaments/[id]/page";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { useRouter } from "next/navigation";
import Tag from "../../Shared/Tag/Tag";
import Title from "../../Title/Title";
import TournamentDurationDisplay from "../../Shared/TournamentDurationDisplay/TournamentDurationDisplay";
import CleanHtml from "../../Shared/CleanHtml/CleanHtml";
import Badge from "../../Shared/Badge/Badge";

interface ITournamentHeroProps {
  tournament: ITournament;
  onDeleteClick: () => void;
  handleClickDeleteWinner: () => void;
  handleClickEdit: () => void;
}

const TournamentHero = ({
  tournament,
  onDeleteClick,
  handleClickDeleteWinner,
  handleClickEdit,
}: ITournamentHeroProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const isTeamMode = tournament.type.value === "team";
  const dispatch = useAppDispatch();
  const router = useRouter();

  const canEditTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const handleCloseRegistration = async () => {
    try {
      if (tournament) {
        const tournamentRef = doc(db, "tournaments", tournament.id);
        updateDoc(tournamentRef, {
          status: "about_to_start",
        });
        dispatch(
          updateTournamentStatus({
            tournamentId: tournament.id,
            status: "about_to_start",
          }),
        );
      }
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    }
  };

  const handleStartTournament = async () => {
    try {
      if (tournament) {
        const tournamentRef = doc(db, "tournaments", tournament.id);
        updateDoc(tournamentRef, {
          status: "in_progress",
          startedAt: new Date().toString(),
        });
        dispatch(
          updateTournamentStatus({
            tournamentId: tournament.id,
            status: "in_progress",
            startedAt: new Date().toString(),
          }),
        );
      }
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    }
  };

  const handleArhiveTournament = async () => {
    try {
      const tournamentDoc = doc(db, "tournaments", tournament.id);
      await addDoc(collection(db, "archivedTournaments"), tournament);
      await deleteDoc(tournamentDoc);

      router.replace("/tournaments");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden max-w-5xl mx-auto rounded-2xl neon-border p-4 md:p-12 mb-8  ${canEditTournament && "pt-4!"}`}
      style={{
        background:
          "linear-gradient(135deg, hsl(220 18% 14%) 0%, hsl(220 20% 8%) 100%)",
      }}
    >
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between">
        <div>
          {canEditTournament && (
            <div className="flex items-center gap-4">
              {tournament.creator && (
                <div className="">
                  <span className="text-sm">Создатель</span>
                  <div className="mt-1 flex gap-2 items-center">
                    <Image
                      width={32}
                      height={32}
                      className="w-6 h-6 rounded-full"
                      src={tournament?.creator?.photoUrl || ""}
                      alt="User photo"
                    />
                    <div>
                      <span className="text-xs font-bold">
                        {tournament?.creator?.displayName}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {tournament?.createdAt && (
                <div className="">
                  <span className="text-sm">Время создания</span>
                  <div className="mt-1 flex gap-2 items-center">
                    {format(tournament?.createdAt, "dd.MM.yyyy HH:mm")}
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
                onClick={handleCloseRegistration}
              />
            )}
            {tournament.status === "about_to_start" && (
              <CustomButton
                icon={<Trophy className="h-4 w-4" />}
                label="Начать турнир"
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
            {tournament.status !== "finished" && (
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

      <div className="block relative mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge
              className="bg-primary/10 text-primary font-bold tracking-wider"
              text={statuses[tournament.status as keyof typeof statuses]}
            />
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
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

        <div className="mt-2 flex items-center gap-2">
          {tournament.game?.image ? (
            <Image
              className="object-cover rounded"
              src={tournament.game?.image}
              width={32}
              height={32}
              alt="Game image"
            />
          ) : (
            <Gamepad2 />
          )}
          <span className="font-bold">{tournament.game?.name}</span>
        </div>

        <TournamentDurationDisplay
          duration={tournament.duration}
          startedAt={tournament.startedAt}
          status={tournament.status}
        />

        <div className="mt-4 whitespace-pre-wrap">
          <CleanHtml html={tournament.description} />
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentHero;
