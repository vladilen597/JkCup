import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const users = await prisma.profile.findMany();

    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Ошибка при получении игр" },
      { status: 500 },
    );
  }
};

// export const DELETE = async (req: NextRequest) => {
//   try {
//     const userId = req.nextUrl.searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json(
//         { message: "No user id provided" },
//         { status: 400 },
//       );
//     }

//     await auth.deleteUser(userId);

//     await db.collection("users").doc(userId).delete();

//     return NextResponse.json(
//       { message: "Пользователь успешно удалён" },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Ошибка при удалении:", error);
//     return NextResponse.json(
//       { message: "Ошибка сервера", error: error.message },
//       { status: 500 },
//     );
//   }
// };
