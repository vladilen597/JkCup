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
  Trophy,
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
} from "firebase/firestore";
import {
  addParticipant,
  ITournament,
  removeParticipant,
  setTournaments,
  updateTournament,
} from "@/app/utils/store/tournamentsSlice";
import TeamList from "@/app/components/TeamsList/TeamsList";
import StatCard from "@/app/components/Shared/StatCard/StatCard";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { ISelectOption } from "@/app/components/Shared/CustomSelect/CustomSelect";
import Image from "next/image";
import TournamentDurationDisplay from "@/app/components/Shared/TournamentDurationDisplay/TournamentDurationDisplay";
import AddJudgeBlock from "@/app/components/Shared/AddJudgeBlock/AddJudgeBlock";
import Title from "@/app/components/Title/Title";
import SelectWinnerTeamModal from "@/app/components/SelectWinnerTeamModal/SelectWinnerTeamModal";
import SelectWinnerUserModal from "@/app/components/SelectWinnerUserModal/SelectWinnerUserModal";
import UserInfoBlock from "@/app/components/Shared/UserInfoBlock/UserInfoBlock";

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
  const [isTournamentLoading, setIsTournamentLoading] = useState(false);
  const tournamentId = params.id as string;
  const [tournament, setTournament] = useState<ITournament>({
    id: "",
    game: "",
    description: "",
    name: "",
    users: [],
    teams: [],
    max_players: 0,
    type: {
      id: 2,
      label: "Одиночный",
      value: "single",
    },
    max_teams: 1,
    players_per_team: 1,
    status: "finished",
    start_date: "",
    duration: 0,
    judges: [],
    winner_team: null,
    winner_user: null,
    rewards: [],
  });

  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const router = useRouter();

  const handleLoadTournament = async () => {
    setIsTournamentLoading(true);
    const tournamentRef = doc(db, "archivedTournaments", params.id as string);
    try {
      const tournamentDoc = await getDoc(tournamentRef);

      const tournamentData = {
        ...(tournamentDoc.data() as ITournament),
        id: tournamentDoc.id as string,
      };

      setTournament(tournamentData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTournamentLoading(false);
    }
  };

  useEffect(() => {
    handleLoadTournament();
  }, []);

  const canEditTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  if (isTournamentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        Загрузка турнира...
      </div>
    );
  }

  if (!tournament) {
    return <div className="p-8 text-center">Турнир не найден</div>;
  }

  const isTeamMode = tournament.type.value === "team";
  const filledSlots = isTeamMode
    ? tournament.teams?.length || 0
    : tournament.users?.length || 0;

  const isFull =
    tournament.players_per_team > 1
      ? tournament.teams.length === tournament.max_players
      : tournament.users.length === tournament.max_players;

  const isCurrentUserJudge = tournament.judges.some(
    (judge) => judge.uid === currentUser.uid,
  );
  const isUserHasTeam = tournament.teams?.some((team) =>
    team.users?.some((user) => user.uid === currentUser.uid),
  );

  const isUserCanCreateTeam = !isCurrentUserJudge && !isUserHasTeam;

  const handleOpenSelectWinnerModal = () => {
    setIsWinnerModalOpen(true);
  };

  const handleCloseSelectWinnerModal = () => {
    setIsWinnerModalOpen(false);
  };

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
        </div>

        <div className="relative mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider">
                {statuses[tournament.status as keyof typeof statuses]}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {isTeamMode ? "Командный" : "Одиночный"}
              </span>
            </div>
          </div>

          <Title title={tournament.name} className="mt-2" />
          <TournamentDurationDisplay
            duration={tournament.duration}
            startedAt={tournament.startedAt}
            status={tournament.status}
          />
          <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
            {tournament.description}
          </p>

          <div className="mt-2">
            <span className="block font-bold">Награды</span>
            {!!tournament.rewards?.length && (
              <ul className="mt-2">
                {tournament.rewards?.map((reward, index) => (
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

      {tournament.status === "finished" && (
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
                {tournament.winner_team?.name}
              </span>
              <ul className="mt-2">
                {tournament.winner_team?.users.map((user) => (
                  <li key={user.uid} className="flex items-center gap-2">
                    <UserInfoBlock {...user} />
                  </li>
                ))}
              </ul>
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
              ? `${tournament.players_per_team}v${tournament.players_per_team}`
              : "1v1"
          }
        />
        <StatCard
          icon={<Hash className="h-4 w-4" />}
          label={isTeamMode ? "Команд" : "Игроков"}
          value={`${filledSlots} / ${isTeamMode ? tournament.max_teams : tournament.max_players}`}
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

      {(tournament.status === "open" ||
        tournament.status === "about_to_start") && (
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
                  ? (tournament.teams.length / tournament.max_teams) * 100
                  : (tournament.users.length / tournament.max_players) * 100,
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
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <AddJudgeBlock
          tournamentStatus={tournament.status}
          judges={tournament.judges}
          isTeamTournament={tournament.type.value === "team"}
          teams={tournament.teams}
          users={tournament.users}
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
            {isTeamMode ? tournament.max_teams : tournament.max_players})
          </h2>
        </div>

        {isTeamMode ? (
          <TeamList
            teams={tournament.teams || []}
            judges={tournament.judges || []}
            tournamentId={tournament.id}
            maxPlayersPerTeam={tournament.players_per_team}
            isLoading={false}
            tournament_status={tournament.status}
          />
        ) : (
          <UserList hideDelete users={tournament.users || []} />
        )}
      </motion.section>

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
            users={tournament.users}
            onClose={handleCloseSelectWinnerModal}
          />
        )}
      </CustomModal>
    </main>
  );
};

export default TournamentPage;
