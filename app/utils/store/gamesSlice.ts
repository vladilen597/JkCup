import { IGame } from "@/app/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: { games: IGame[] } = {
  games: [],
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<IGame[]>) => {
      state.games = action.payload;
    },
    addGame: (state, action: PayloadAction<IGame>) => {
      state.games = [action.payload, ...state.games];
    },
    deleteGame: (state, action: PayloadAction<string>) => {
      state.games = state.games.filter((game) => game.id !== action.payload);
    },
  },
});

export const { setGames, addGame, deleteGame } = gamesSlice.actions;
export default gamesSlice.reducer;
