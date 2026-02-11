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
}

const initialState: { tournaments: ITournament[] } = {
  tournaments: [],
};

const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    setTournaments: (state, action: PayloadAction<any>) => {
      state.tournaments = action.payload;
    },
  },
});

export const { setTournaments } = tournamentsSlice.actions;
export default tournamentsSlice.reducer;
