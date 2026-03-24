"use client";

import CreateTournamentModal from "@/app/components/CreateTournamentModal/CreateTournamentModal";
import TournamentStats from "@/app/components/TournamentStats/TournamentStats";
import CustomButton, {
  BUTTON_STYLES,
} from "@/app/components/Shared/CustomButton/CustomButton";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  addTournament,
  setTournaments,
} from "@/app/utils/store/tournamentsSlice";
import Tournament from "@/app/utils/Tournament";
import { ITournament } from "@/app/lib/types";
import { Trophy, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PageHero from "@/app/components/Shared/PageHero/PageHero";
import EmptyListPlaceholder from "../../Shared/EmptyListPlaceholder/EmptyListPlaceholder";

const TournamentsPage = () => {
  const { tournaments } = useAppSelector((state) => state.tournaments);
  const { currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false);

  const canCreateTournament =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const handleLoadTournaments = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/tournaments");
      dispatch(setTournaments(data));
    } catch (error) {
      toast.error("Ошибка загрузки турниров");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTournament = (data: ITournament) => {
    dispatch(addTournament(data));
  };

  useEffect(() => {
    handleLoadTournaments();
  }, []);

  const handleCloseCreateTournamentModal = () => {
    setIsCreateTournamentModalOpen(false);
  };

  const filteredTournaments = tournaments?.filter((tournament: ITournament) => {
    if (!tournament.hidden) return true;

    return currentUser?.role !== "user";
  });

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <PageHero
        title="Турниры"
        description="Следите и участвуйте в турнирах"
        icon={<Trophy className="h-8 w-8 text-primary" />}
        controls={
          canCreateTournament && (
            <CustomButton
              label="Создать"
              className="p-2 px-3"
              icon={<Plus className="h-5 w-5" />}
              buttonStyle={BUTTON_STYLES.OUTLINE}
              onClick={() => setIsCreateTournamentModalOpen(true)}
            />
          )
        }
        bottomContent={<TournamentStats />}
      />
      {filteredTournaments.length ? (
        <ul className="space-y-3">
          {filteredTournaments?.map((tournament, index) => {
            const isTeam = tournament.type === "team";
            const usersAmount = isTeam
              ? tournament?.teams?.length
              : tournament?.registrations?.length || 0;
            const teamsAmount = tournament?.teams?.length || 0;
            const fillPercent = isTeam
              ? Math.round((teamsAmount / tournament.max_teams) * 100)
              : Math.round((usersAmount / tournament.max_players) * 100);
            const isFull = isTeam
              ? teamsAmount >= tournament.max_teams
              : usersAmount >= tournament.max_players;
            const maxPlayers = isTeam
              ? tournament.max_teams
              : tournament.max_players;

            return (
              <Tournament
                key={tournament.id}
                index={index}
                {...tournament}
                currentPlayers={usersAmount}
                maxPlayers={maxPlayers}
                isTeam={isTeam}
                isFull={isFull}
                fillPercent={fillPercent}
              />
            );
          })}
        </ul>
      ) : (
        <EmptyListPlaceholder
          isLoading={isLoading}
          icon={<Trophy className="h-10 w-10" />}
          text="Турниров пока нет. Следите за обновлениями в нашем Discord-канале"
        />
      )}
      {canCreateTournament && (
        <CustomModal
          isOpen={isCreateTournamentModalOpen}
          onClose={handleCloseCreateTournamentModal}
        >
          <CreateTournamentModal
            onClose={handleCloseCreateTournamentModal}
            onSubmit={handleCreateTournament}
          />
        </CustomModal>
      )}
    </main>
  );
};

export default TournamentsPage;
