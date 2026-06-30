import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const tournament = await prisma.archivedTournament.findUnique({
      where: { id },
      include: {
        winner_user: true,

        winner_team: {
          include: {
            members: {
              include: { user: true },
            },
          },
        },

        judges: {
          include: {
            user: true,
          },
        },

        teams: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },

        registrations: {
          include: {
            user: true,
          },
          orderBy: [{ reward_id: "desc" }, { is_winner: "desc" }],
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Турнир не найден в архиве" },
        { status: 404 },
      );
    }

    return NextResponse.json(tournament);
  } catch (error: any) {
    console.error("GET Archive Error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    await prisma.archivedTournament.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Успешно удалено" }, { status: 200 }); // ИСПРАВЛЕНО: правильный синтаксис статуса для NextResponse
  } catch (error: any) {
    console.error("DELETE Archive Error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
