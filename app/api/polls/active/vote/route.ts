import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: Request) => {
  try {
    const { pollId, gameId, userId } = await req.json();

    const vote = await prisma.globalVote.upsert({
      where: {
        poll_id_profile_id: {
          poll_id: pollId,
          profile_id: userId,
        },
      },
      update: { game_id: gameId },
      create: {
        poll_id: pollId,
        profile_id: userId,
        game_id: gameId,
      },
    });

    return NextResponse.json(vote);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
