import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const poll = await prisma.globalPoll.findFirst({
      where: {
        is_active: true,
        ends_at: {
          gt: new Date(),
        },
      },
      include: {
        options: {
          include: {
            game: true,
          },
        },
        votes: {
          select: {
            game_id: true,
          },
        },
      },
    });

    if (!poll) {
      return NextResponse.json(null);
    }

    const voteStats = poll.votes.reduce((acc: Record<string, number>, curr) => {
      acc[curr.game_id] = (acc[curr.game_id] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      poll,
      stats: voteStats,
      totalVotes: poll.votes.length,
    });
  } catch (error: any) {
    console.error("ACTIVE POLL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
