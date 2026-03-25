import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const updatedUser = await prisma.profile.update({
      where: { id },
      data: {
        steam_avatar: null,
        steam_name: null,
        steam_id: null,
        steam_profile_url: null,
      },
      include: {
        judged_tournaments: {
          include: {
            tournament: true,
          },
        },
        games: true,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Ошибка отвязки Steam",
    });
  }
};
