import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  {
    params,
  }: { params: Promise<{ id: string; roundId: string; matchId: string }> },
) => {
  try {
    const { id: tournamentId, matchId } = await params;
    const { profileId, teamId, slot } = await req.json();

    await prisma.$transaction([
      prisma.matchParticipant.deleteMany({
        where: { match_id: matchId, slot: Number(slot) },
      }),
      prisma.matchParticipant.create({
        data: {
          match_id: matchId,
          profile_id: profileId || null,
          team_id: teamId || null,
          slot: Number(slot),
        },
      }),
    ]);

    const updatedTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        rounds: {
          orderBy: { number: "asc" },
          include: {
            matches: {
              include: {
                participants: {
                  include: {
                    profile: true,
                    team: {
                      include: {
                        members: { include: { profile: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        registrations: { include: { profile: true } },
        teams: { include: { members: { include: { profile: true } } } },
        judges: { include: { profile: true } },
        game: true,
        creator: true,
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { participantRecordId } = await req.json();

    await prisma.matchParticipant.delete({
      where: { id: participantRecordId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
