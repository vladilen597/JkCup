import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, query } from "firebase/firestore";
import admin from "firebase-admin";
import { db as firebaseDB } from "@/app/utils/firebase";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const rolePriority: Record<string, number> = {
  superadmin: 1,
  admin: 2,
};

export const GET = async () => {
  try {
    const usersQuery = query(collection(firebaseDB, "users"));
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
};

const db = admin.firestore();
const auth = admin.auth();

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "No user id provided" },
        { status: 400 },
      );
    }

    await auth.deleteUser(userId);

    await db.collection("users").doc(userId).delete();

    return NextResponse.json(
      { message: "Пользователь успешно удалён" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Ошибка при удалении:", error);
    return NextResponse.json(
      { message: "Ошибка сервера", error: error.message },
      { status: 500 },
    );
  }
};
