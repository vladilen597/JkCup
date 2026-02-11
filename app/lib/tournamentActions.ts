"use server";

import {
  doc,
  setDoc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase";

export async function joinTournament(
  tournamentId: string,
): Promise<{ success: boolean; message: string }> {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      message: "Войдите в аккаунт, чтобы присоединиться",
    };
  }

  const tournamentRef = doc(db, "tournaments", tournamentId);
  const participantRef = doc(
    db,
    "tournaments",
    tournamentId,
    "participants",
    user.uid,
  );

  try {
    const result = await runTransaction(db, async (transaction) => {
      const tournamentSnap = await transaction.get(tournamentRef);
      if (!tournamentSnap.exists()) {
        throw new Error("Турнир не найден");
      }

      const data = tournamentSnap.data()!;
      const current = data.currentParticipants || 0;
      const max = data.max_players || Infinity;

      if (current >= max) {
        throw new Error("Турнир уже заполнен");
      }

      // Check if already registered
      const participantSnap = await transaction.get(participantRef);
      if (participantSnap.exists()) {
        return { alreadyJoined: true };
      }

      // Register user
      transaction.set(participantRef, {
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || null,
        joinedAt: serverTimestamp(),
        status: "registered",
      });

      // Increment counter
      transaction.update(tournamentRef, {
        currentParticipants: current + 1,
      });

      return { success: true };
    });

    if ("alreadyJoined" in result) {
      return { success: false, message: "Вы уже зарегистрированы" };
    }

    return { success: true, message: "Успешно зарегистрированы!" };
  } catch (err: any) {
    console.error("Join error:", err);
    return { success: false, message: err.message || "Ошибка при регистрации" };
  }
}
