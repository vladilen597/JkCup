import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: tournamentId } = await params;
    const { number, name } = await req.json();

    const newRound = await prisma.round.create({
      data: {
        tournament_id: tournamentId,
        number: Number(number),
        name: name || `Раунд ${number + 1}`,
      },
      include: {
        matches: true,
      },
    });

    return NextResponse.json(newRound);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
