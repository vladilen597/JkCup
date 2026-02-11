import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../types/user";

const initialState: { user: IUser } = {
  user: {
    uid: "",
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
