import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        discord_full_name: null,
        discord_global_name: null,
        discord_id: null,
        discord_avatar: null,
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

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
