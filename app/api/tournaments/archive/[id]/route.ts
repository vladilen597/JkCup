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
              include: { profile: true },
            },
          },
        },

        judges: {
          include: {
            profile: true,
          },
        },

        teams: {
          include: {
            members: {
              include: {
                profile: true,
              },
            },
          },
        },

        registrations: {
          include: {
            profile: true,
          },
          orderBy: {
            is_winner: "desc",
          },
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

    return NextResponse.json({ status: 200, message: "Успешно удалено" });
  } catch (error: any) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
