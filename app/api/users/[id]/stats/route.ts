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
          },
        },
      },
    });

    const total =
      (stats?._count.tournament_registrations || 0) +
      (stats?._count.team_memberships || 0);

    return NextResponse.json({
      registrations: stats?._count.tournament_registrations || 0,
      team_membership: stats?._count.team_memberships || 0,
      judged_tournaments: stats?._count.judged_tournaments || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
