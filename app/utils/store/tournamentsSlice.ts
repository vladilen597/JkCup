import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./userSlice";

export interface ITournament {
  id: string;
  game: string;
  max_players: number;
  name: string;
  team_amount: number;
  users: IUser[];
  users_amount: number;
  description: string;
  start_date: string;
  status: string;
  teams: any[];
}

export interface ITeam {
  uid: string;
  creator_uid: string;
  name?: string;
  users: IUser[];
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
    addTournamentTeam: (
      state,
      action: PayloadAction<{
        uid: string;
        tournamentId: string;
        teamName: string;
        currentUser: IUser;
      }>,
    ) => {
      const { uid, tournamentId, teamName, currentUser } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.teams.push({
          uid,
          name: teamName,
          creator_uid: currentUser.uid,
          users: [currentUser],
        });
        tournament.users_amount = tournament.users.length;
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
          tournament.users_amount = tournament.users.length;
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
        tournament.users_amount = tournament.users.length;
      }
    },
  },
});

export const {
  setTournaments,
  addTournamentTeam,
  addParticipant,
  removeParticipant,
  removeTeamParticipant,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
