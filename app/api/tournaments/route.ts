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

        return tournamentData;
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
