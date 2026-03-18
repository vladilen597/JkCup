import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { prisma } from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID не указан" }, { status: 400 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        game: true,
        creator: true,
        winner_user: true,
        winner_team: {
          include: {
            members: { include: { profile: true } },
          },
        },
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
        // ДОБАВЛЯЕМ СЕТКУ (РАУНДЫ -> МАТЧИ -> УЧАСТНИКИ)
        rounds: {
          orderBy: { number: "asc" }, // Сортируем по порядку (Раунд 1, 2...)
          include: {
            matches: {
              include: {
                participants: {
                  orderBy: { slot: "asc" },
                  include: {
                    profile: true,
                    team: {
                      include: { members: { include: { profile: true } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Турнир не найден" }, { status: 404 });
    }

    return NextResponse.json(tournament);
  } catch (error: any) {
    console.error("GET Tournament Error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении турнира", details: error.message },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const ref = doc(db, "tournaments", id);

    await updateDoc(ref, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    await prisma.tournament.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить турнир", details: error.message },
      { status: 500 },
    );
  }
};
