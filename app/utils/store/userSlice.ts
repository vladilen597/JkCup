import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/app/lib/types";

const initialState: {
  currentUser: IUser;
  userInfo: IUser & { imageFile?: null | File };
} = {
  currentUser: {
    id: "",
    full_name: "Anonymous",
    image_url: "",
    email: "",
    role: "guest",
    steam_profile_url: "",
    steam_name: "",
    games: [],
    who_invited: "",
    judged_tournaments: [],
  },
  userInfo: {
    id: "",
    full_name: "Anonymous",
    image_url: "",
    email: "",
    role: "guest",
    steam_profile_url: "",
    steam_name: "",
    games: [],
    who_invited: "",
    judged_tournaments: [],
    imageFile: null,
  },
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    updateCurrentUser: (state, action: PayloadAction<IUser>) => {
      console.log("update");
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setUserInfo: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
    },
    updateUserInfo: (state, action: PayloadAction<IUser>) => {
      state.currentUser = { ...state.userInfo, ...action.payload };
    },
    updateUserInfoField: (
      state,
      action: PayloadAction<{ name: string; value: any }>,
    ) => {
      state.userInfo[action.payload.name] = action.payload.value;
    },
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
    },
  },
});

export const {
  setCurrentUser,
  updateCurrentUser,
  setUserInfo,
  updateUserInfo,
  updateUserInfoField,
  clearUserInfo,
} = currentUserSlice.actions;
export default currentUserSlice.reducer;
