import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID не указан" }, { status: 400 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        game: true,
        creator: true,
        winner_user: true,
        winner_team: true,
        registrations: {
          include: { profile: true },
        },
        teams: {
          include: {
            members: { include: { profile: true } },
          },
        },
        judges: {
          include: { profile: true },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Турнир не найден" }, { status: 404 });
    }

    return NextResponse.json(tournament);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Ошибка при получении турнира", details: error.message },
      { status: 500 },
    );
  }
};
