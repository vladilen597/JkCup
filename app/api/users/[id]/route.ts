import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const user = await prisma.profile.findUnique({
      where: { id },
      include: {
        judged_tournaments: {
          include: {
            tournament: true,
          },
        },
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Ошибка загрузки пользователя",
    });
  }
};
