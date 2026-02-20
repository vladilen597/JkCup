// hooks/useTournamentUsersRealtime.ts
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
import { ITeam } from "./store/tournamentsSlice";
import { IUser } from "./store/userSlice";

export interface UseTournamentUsersOptions {
  onlyActive?: boolean;
}

export interface UseTournamentUsersReturn {
  totalJoinedUsers: number;
  totalTeams: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const useTournamentUsersRealtime = (
  options: UseTournamentUsersOptions = {},
): UseTournamentUsersReturn => {
  const { onlyActive = false } = options;

  const [totalJoinedUsers, setTotalJoinedUsers] = useState<number>(0);
  const [totalTeams, setTotalTeams] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const processTournaments = useCallback(
    (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        let totalUsers = 0;
        let totalTeams = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          const users = (data.users || data.joinedUsers || []) as IUser[];
          data.teams.forEach((team: ITeam) => {
            totalUsers += team.users.length;
          });
          totalUsers += users.length;
          totalTeams += data.teams.length;
        });

        setTotalJoinedUsers(totalUsers);
        setTotalTeams(totalTeams);
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
    [],
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

  return { totalJoinedUsers, totalTeams, loading, error, refresh };
};

export default useTournamentUsersRealtime;
