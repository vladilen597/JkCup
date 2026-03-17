import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) => {
  try {
    const { teamId } = await params;

    await prisma.tournamentTeam.delete({
      where: { id: teamId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete team error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить команду", details: error.message },
      { status: 500 },
    );
  }
};
