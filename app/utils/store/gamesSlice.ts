import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IGame {
  uid: string;
  id: string;
  name: string;
  image: string;
}

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
      state.games = [...state.games, action.payload];
    },
    deleteGame: (state, action: PayloadAction<string>) => {
      state.games = state.games.filter((game) => game.id !== action.payload);
    },
  },
});

export const { setGames, addGame, deleteGame } = gamesSlice.actions;
export default gamesSlice.reducer;
