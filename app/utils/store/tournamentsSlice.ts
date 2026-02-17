import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./userSlice";
import { ISelectOption } from "@/app/components/Shared/CustomSelect/CustomSelect";

export interface ITournament {
  id: string;
  game: string;
  max_players: number;
  name: string;
  users: IUser[];
  type: ISelectOption;
  max_teams: number;
  players_per_team: number;
  description: string;
  start_date: string;
  status: string;
  teams: ITeam[];
}

export interface ITeam {
  uid: string;
  creator_uid: string;
  name?: string;
  users: IUser[];
  is_private: boolean;
}

const initialState: { tournaments: ITournament[] } = {
  tournaments: [],
};

const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    setTournaments: (state, action: PayloadAction<ITournament[]>) => {
      state.tournaments = action.payload;
    },
    updateTournament: (state, action: PayloadAction<ITournament>) => {
      state.tournaments = state.tournaments.map((tournament) => {
        if (tournament.id === action.payload.id) {
          return action.payload;
        } else {
          return tournament;
        }
      });
    },
    updateTournamentStatus: (
      state,
      action: PayloadAction<{ tournamentId: string; status: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.status = action.payload.status;
      }
    },
    addTournamentTeam: (
      state,
      action: PayloadAction<{
        uid: string;
        tournamentId: string;
        teamName: string;
        currentUser: IUser;
        is_private: boolean;
      }>,
    ) => {
      const { uid, tournamentId, teamName, is_private, currentUser } =
        action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.teams.push({
          uid,
          name: teamName,
          is_private,
          creator_uid: currentUser.uid,
          users: [currentUser],
        });
      }
    },
    removeTeam: (
      state,
      action: PayloadAction<{ tournamentId: string; teamId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        tournament.teams = tournament.teams.filter(
          (team) => team.uid !== action.payload.teamId,
        );
      }
    },
    removeTeamParticipant: (
      state,
      action: PayloadAction<{ tournamentId: string; updatedTeams: ITeam[] }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        tournament.teams = action.payload.updatedTeams;
      }
    },
    addTeamParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        teamId: string;
        user: IUser;
      }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        const team = tournament.teams.find(
          (team) => team.uid === action.payload.teamId,
        );
        team?.users.push(action.payload.user);
      }
    },
    addParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        participant: IUser;
      }>,
    ) => {
      const { tournamentId, participant } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        if (!tournament.users.some((u) => u.uid === participant.uid)) {
          tournament.users.push(participant);
        }
      }
    },
    removeParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        userId: string;
      }>,
    ) => {
      const { tournamentId, userId } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.users = tournament.users.filter((u) => u.uid !== userId);
      }
    },
  },
});

export const {
  setTournaments,
  addTournamentTeam,
  addParticipant,
  removeTeam,
  addTeamParticipant,
  updateTournament,
  updateTournamentStatus,
  removeParticipant,
  removeTeamParticipant,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
