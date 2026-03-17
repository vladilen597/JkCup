import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: tournamentId } = await params;
    const { name, is_private, creatorId } = await req.json();

    const newTeam = await prisma.tournamentTeam.create({
      data: {
        tournament_id: tournamentId,
        creator_id: creatorId,
        name: name,
        is_private: is_private,
        members: {
          create: {
            profile_id: creatorId,
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
        },
        creator: true,
      },
    });

    return NextResponse.json(newTeam);
  } catch (error: any) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: "Не удалось создать команду", details: error.message },
      { status: 500 },
    );
  }
};
