import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { searchParams } = new URL(req.url);
    const sortParam = searchParams.get("sort") || "any";

    let orderBy: any = { role: "asc" };

    if (sortParam !== "any") {
      orderBy = {
        [sortParam]: sortParam === "created_at" ? "desc" : "asc",
      };
    }

    const users = await prisma.profile.findMany({
      orderBy,
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Users GET Error:", error);
    const status = error?.response?.status || 500;
    return NextResponse.json(
      { error: "Ошибка при получении пользователей" },
      { status },
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
