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

export const { setTournaments, addParticipant, removeParticipant } =
  tournamentsSlice.actions;

export default tournamentsSlice.reducer;
