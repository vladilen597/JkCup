import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: userId } = await params;

    const stats = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            tournament_registrations: true,
            team_memberships: true,
            judged_tournaments: true,
            archived_judged: true,
            archived_participations: true,
            won_archives: true,
            won_tournaments: true,
          },
        },
      },
    });

    return NextResponse.json({
      registrations: stats?._count.tournament_registrations || 0,
      team_membership: stats?._count.team_memberships || 0,
      judged_tournaments: stats?._count.judged_tournaments || 0,
      archived_judged: stats?._count.archived_judged || 0,
      archived_participations: stats?._count.archived_participations || 0,
      won_archives: stats?._count.won_archives || 0,
      won_tournaments: stats?._count.won_tournaments || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
