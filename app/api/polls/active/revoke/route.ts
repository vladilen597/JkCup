import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (req: Request) => {
  try {
    const { pollId, userId } = await req.json();

    const deletedVote = await prisma.globalVote.delete({
      where: {
        poll_id_profile_id: {
          poll_id: pollId,
          profile_id: userId,
        },
      },
    });

    return NextResponse.json({ message: "Vote removed", deletedVote });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
