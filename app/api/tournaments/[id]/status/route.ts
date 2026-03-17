import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { status } = await req.json();
    const { id } = await params;

    const updatedStatusTournament = await prisma.tournament.update({
      where: { id },
      data: {
        status,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Статус обновлен",
      data: updatedStatusTournament,
    });
  } catch (error) {
    return NextResponse.json({
      status: 200,
      message: "Ошибка обновления статуса",
    });
  }
};
