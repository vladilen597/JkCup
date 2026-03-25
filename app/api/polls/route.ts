import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const polls = await prisma.globalPoll.findMany({
      orderBy: {
        created_at: "asc",
      },
      include: {
        options: {
          include: {
            game: true,
          },
        },
        votes: true,
      },
    });
    return NextResponse.json(polls);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message || "Ошибка загрузки голосований",
      status: 500,
    });
  }
};
