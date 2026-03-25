import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  req: Request,
  {
    params,
  }: { params: Promise<{ id: string; roundId: string; matchId: string }> },
) => {
  try {
    const { matchId } = await params;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ message: "Матч уже удален" }, { status: 200 });
    }

    await prisma.match.delete({
      where: { id: matchId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete match error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
