import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

export async function GET(request: NextRequest) {
  try {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(usersQuery);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      displayName: doc.data().displayName || "Anonymous",
      photoUrl: doc.data().photoUrl || null,
      discord: doc.data().discord || "",
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({
      users,
      count: users.length,
    });
  } catch (error: any) {
    console.error(
      "Error fetching users from Firestore:",
      error.code,
      error.message,
      error.stack,
    );

    return NextResponse.json(
      {
        error: "Failed to load users",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
