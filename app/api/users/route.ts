import { NextResponse } from "next/server";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

const rolePriority: Record<string, number> = {
  superadmin: 1,
  admin: 2,
};

export async function GET() {
  try {
    const usersQuery = query(collection(db, "users"));
    const snapshot = await getDocs(usersQuery);

    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      displayName: doc.data().displayName || "Anonymous",
      photoUrl: doc.data().photoUrl || null,
      discord: doc.data().discord || "",
      role: doc.data().role,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      steamLink: doc.data().steamLink,
      steamDisplayName: doc.data().steamDisplayName,
    }));

    users.sort((a, b) => {
      const priorityA = rolePriority[a.role] || 99;
      const priorityB = rolePriority[b.role] || 99;
      return priorityA - priorityB;
    });

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
