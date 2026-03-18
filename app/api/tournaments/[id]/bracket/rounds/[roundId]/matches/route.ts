import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string; roundId: string }> },
) => {
  try {
    const { roundId } = await params;

    const newMatch = await prisma.match.create({
      data: {
        round_id: roundId,
        status: "pending",
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json(newMatch);
  } catch (error: any) {
    console.error("Match Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
