"use client";
import { store } from "@/app/utils/store/store";
import { setUser } from "@/app/utils/store/userSlice";
import { useRef } from "react";
import { Provider } from "react-redux";

export const StoreProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: any;
}) => {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (initialUser) {
      store.dispatch(setUser(initialUser));
    } else {
      store.dispatch(setUser(null));
    }
    initialized.current = true;
  }

  return <Provider store={store}>{children}</Provider>;
};
