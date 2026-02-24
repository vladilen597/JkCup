"use client";

import { useCallback } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { setUser } from "@/app/utils/store/userSlice";
import { auth, db } from "@/app/utils/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export function useGoogleSignIn() {
  const dispatch = useAppDispatch();

  const signIn = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser.uid) throw new Error("No UID after sign-in");

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData;

      if (userSnap.exists()) {
        userData = {
          uid: firebaseUser.uid,
          displayName:
            userSnap.data().displayName ||
            firebaseUser.displayName ||
            "Anonymous",
          photoUrl: userSnap.data().photoUrl || firebaseUser.photoURL || null,
          email: userSnap.data().email || firebaseUser.email || null,
          discord: userSnap.data().discord || "",
          createdAt: userSnap.data().createdAt,
          role: userSnap.data().role,
          steamLink: userSnap.data().steamLink,
          steamDisplayName: userSnap.data().steamDisplayName,
        };

        await setDoc(
          userRef,
          { lastSignIn: serverTimestamp() },
          { merge: true },
        );
      } else {
        userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "Anonymous",
          photoUrl: firebaseUser.photoURL || "",
          email: firebaseUser.email || "",
          discord: "",
          createdAt: new Date().toString(),
          role: "user" as "user" | "admin" | "superadmin",
          steamLink: "",
          steamDisplayName: "",
        };

        await setDoc(userRef, userData);
      }

      dispatch(setUser(userData));

      return { success: true, user: userData };
    } catch (error: any) {
      console.error("Sign-in / profile error:", error);
      return { success: false, error: error.code || error.message };
    }
  }, [dispatch]);

  return { signIn };
}
