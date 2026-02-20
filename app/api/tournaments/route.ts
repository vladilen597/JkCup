import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newTournament = {
      ...body,
      createdAt: new Date().toString(),
      users: [],
      teams: [],
      winner_team: null,
      winner_user: null,
      judges: [],
    };

    const docRef = await addDoc(collection(db, "tournaments"), newTournament);

    return NextResponse.json({ id: docRef.id, ...newTournament });
  } catch (error: any) {
    console.error("Create tournament error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
