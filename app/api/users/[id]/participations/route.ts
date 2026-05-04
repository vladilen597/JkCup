import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    console.log(id);

    const userTournaments = await prisma.tournament.findMany({
      where: {
        registrations: {
          some: {
            profile_id: id,
          },
        },
      },
      include: {
        game: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    const archivedUserTournaments = await prisma.archivedTournament.findMany({
      where: {
        registrations: {
          some: {
            user_id: id,
          },
        },
      },
      include: {
        teams: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json([...userTournaments, ...archivedUserTournaments]);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.response.data.message,
    });
  }
};
