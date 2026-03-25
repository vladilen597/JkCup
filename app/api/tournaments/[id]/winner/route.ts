import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const { winnerId, type } = await req.json();

    if (!winnerId) {
      return NextResponse.json(
        { error: "ID победителя не указан" },
        { status: 400 },
      );
    }

    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: {
        status: "finished",
        ...(type === "team"
          ? { winner_team: { connect: { id: winnerId } } }
          : { winner_user: { connect: { id: winnerId } } }),
      },
      include: {
        winner_user: true,
        winner_team: {
          include: { members: { include: { profile: true } } },
        },
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error: any) {
    console.error("WINNER SET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
