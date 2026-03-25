import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { profileIds } = await req.json();
    const { id: tournamentId } = await params;

    if (!Array.isArray(profileIds) || profileIds.length === 0) {
      return NextResponse.json({ error: "Массив ID пуст" }, { status: 400 });
    }

    const data = profileIds.map((profileId) => ({
      tournament_id: tournamentId,
      profile_id: profileId,
    }));

    await prisma.tournamentJudge.createMany({
      data,
      skipDuplicates: true,
    });

    const updatedJudges = await prisma.tournamentJudge.findMany({
      where: { tournament_id: tournamentId },
      include: { profile: true },
    });

    return NextResponse.json(updatedJudges);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Ошибка при добавлении судей", details: error.message },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { userId } = await req.json();
    const { id: tournamentId } = await params;

    await prisma.tournamentJudge.delete({
      where: {
        tournament_id_profile_id: {
          tournament_id: tournamentId,
          profile_id: userId,
        },
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
