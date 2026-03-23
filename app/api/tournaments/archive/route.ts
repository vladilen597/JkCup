import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const archivedTournaments = await prisma.archivedTournament.findMany({
      orderBy: {
        archived_at: "desc",
      },
      include: {
        registrations: true,
        teams: true,
      },
    });

    return NextResponse.json(archivedTournaments);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения архива" },
      { status: 500 },
    );
  }
};
