import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "./gamesSlice";

export interface IUser {
  uid: string;
  displayName: string;
  photoUrl: string;
  email: string;
  discord: string;
  createdAt?: string;
  lastSignIn?: string;
  steamLink?: string;
  steamDisplayName?: string;
  role: "user" | "admin" | "superadmin";
  games?: IGame[];
}

const initialState: { user: IUser } = {
  user: {
    uid: "",
    displayName: "Anonymous",
    photoUrl: "",
    email: "",
    discord: "",
    role: "user",
    steamLink: "",
    steamDisplayName: "",
    games: [],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
