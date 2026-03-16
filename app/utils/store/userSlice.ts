import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/app/lib/types";

const initialState: { user: IUser } = {
  user: {
    id: "",
    full_name: "Anonymous",
    image_url: "",
    email: "",
    discord: "",
    role: "guest",
    steam_link: "",
    steam_display_name: "",
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
