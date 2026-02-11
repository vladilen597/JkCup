import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

export async function GET() {
  try {
    const tournamentsQuery = query(collection(db, "tournaments"));

    const tournamentsSnap = await getDocs(tournamentsQuery);

    const enrichedTournaments = await Promise.all(
      tournamentsSnap.docs.map(async (tournamentDoc) => {
        const tournamentData = {
          id: tournamentDoc.id,
          ...tournamentDoc.data(),
        };

        const participantsCollection = collection(
          db,
          "tournaments",
          tournamentDoc.id,
          "users",
        );

        const participantsQuery = query(
          participantsCollection,
          orderBy("joinedAt", "asc"), // or 'desc' — newest/oldest first
        );

        const participantsSnap = await getDocs(participantsQuery);

        const users = participantsSnap.docs.map((pDoc) => ({
          id: pDoc.id,
          ...pDoc.data(),
        }));

        return {
          ...tournamentData,
          users,
          usersAmount: users.length,
        };
      }),
    );

    return NextResponse.json(enrichedTournaments);
  } catch (error: any) {
    console.error("Error fetching tournaments with participants:", error);
    return NextResponse.json(
      { error: "Failed to load tournaments", details: error.message },
      { status: 500 },
    );
  }
}
