"use client";

import { useCallback } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { setUser } from "@/app/utils/store/userSlice";
import { auth, db } from "@/app/utils/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export function useGoogleSignIn() {
  const dispatch = useAppDispatch();

  const signIn = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        setUser({
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          photoUrl: user.photoURL || "",
          email: user.email || "",
        }),
      );

      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          photoUrl: user.photoURL || null,
          email: user.email || null,
          discord: "",
          createdAt: serverTimestamp(),
          lastSignIn: serverTimestamp(),
        },
        { merge: true },
      );

      return { success: true };
    } catch (error: any) {
      console.error("Sign-in error:", error);
      return { success: false, error: error.code || error.message };
    }
  }, [dispatch]);

  return { signIn };
}
