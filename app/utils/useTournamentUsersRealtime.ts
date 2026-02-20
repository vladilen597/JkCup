import { useState, useEffect, useCallback } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  QueryConstraint,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export interface User {
  uid: string;
  displayName?: string;
  email?: string;
  [key: string]: any;
}

export interface Tournament {
  id: string;
  name: string;
  title?: string;
  users: User[];
  joinedUsers?: User[];
  createdAt?: Date;
  status?: "active" | "completed" | "upcoming";
  [key: string]: any;
}

export interface TournamentStats {
  totalJoinedUsers: number;
}

export interface TournamentDetail {
  id: string;
  name: string;
  userCount: number;
  users: User[];
}

export interface UseTournamentUsersOptions {
  onlyActive?: boolean;
  minUsers?: number;
  includeEmpty?: boolean;
}

export interface UseTournamentUsersReturn {
  stats: TournamentStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const useTournamentUsersRealtime = (
  options: UseTournamentUsersOptions = {},
): UseTournamentUsersReturn => {
  const { onlyActive = false, minUsers = 0, includeEmpty = true } = options;

  const [stats, setStats] = useState<TournamentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const processTournaments = useCallback(
    (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        let totalUsers = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          const users = (data.users || data.joinedUsers || []) as User[];
          const userCount = users.length;

          if (userCount < minUsers) return;
          if (!includeEmpty && userCount === 0) return;
        });

        const tournamentStats: TournamentStats = {
          totalJoinedUsers: totalUsers,
        };

        setStats(tournamentStats);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error processing tournament data: ${err.message}`);
        } else {
          setError("Unknown error processing tournament data");
        }
      } finally {
        setLoading(false);
      }
    },
    [minUsers, includeEmpty],
  );

  useEffect(() => {
    setLoading(true);

    const tournamentsRef = collection(db, "tournaments");

    const constraints: QueryConstraint[] = [];

    if (onlyActive) {
      constraints.push(where("status", "==", "active"));
    }

    const q =
      constraints.length > 0
        ? query(tournamentsRef, ...constraints)
        : tournamentsRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        processTournaments(snapshot);
      },
      (err: Error) => {
        console.error("Error in tournament users snapshot:", err);
        setError(`Failed to fetch tournament data: ${err.message}`);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [onlyActive, processTournaments]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  return { stats, loading, error, refresh };
};

export default useTournamentUsersRealtime;
