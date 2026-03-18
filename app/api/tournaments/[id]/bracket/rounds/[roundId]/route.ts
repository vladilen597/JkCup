import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string; roundId: string }> },
) => {
  try {
    // Распаковываем оба ID из пути
    const { id: tournamentId, roundId } = await params;

    // Удаляем конкретный раунд
    await prisma.round.delete({
      where: { id: roundId },
    });

    // Возвращаем обновленный турнир со всеми вложениями (используем наш глубокий include)
    const updatedTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        game: true,
        creator: true,
        registrations: { include: { profile: true } },
        teams: { include: { members: { include: { profile: true } } } },
        judges: { include: { profile: true } },
        rounds: {
          orderBy: { number: "asc" },
          include: {
            matches: {
              include: {
                participants: { include: { profile: true, team: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error: any) {
    console.error("DELETE ROUND ERROR:", error);
    return NextResponse.json(
      { error: "Не удалось удалить раунд", details: error.message },
      { status: 500 },
    );
  }
};
