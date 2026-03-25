import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const { discord_id, discord_full_name, discord_global_name, discord_avatar } =
    await req.json();

  const updated = await prisma.profile.update({
    where: { id },
    data: {
      discord_global_name: discord_global_name,
      discord_full_name: discord_full_name,
      discord_id,
      discord_avatar,
    },
  });

  return NextResponse.json(updated);
};
