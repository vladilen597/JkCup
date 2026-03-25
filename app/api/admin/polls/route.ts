import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { title, game_ids, ends_at } = await req.json();

    await prisma.globalPoll.updateMany({
      where: { is_active: true },
      data: { is_active: false },
    });

    const poll = await prisma.globalPoll.create({
      data: {
        title,
        is_active: true,
        ends_at,
        options: {
          create: game_ids.map((id: string) => ({ game_id: id })),
        },
      },
      include: { options: { include: { game: true } }, votes: true },
    });

    return NextResponse.json(poll);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
