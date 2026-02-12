import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  uid: string;
  displayName: string;
  photoUrl: string;
  email: string;
}

const initialState: { user: IUser } = {
  user: {
    uid: "",
    displayName: "Anonymous",
    photoUrl: "",
    email: "",
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
