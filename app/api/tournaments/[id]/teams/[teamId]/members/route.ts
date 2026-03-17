import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) => {
  try {
    const { userId } = await req.json();
    const { teamId } = await params;

    const member = await prisma.teamMember.create({
      data: {
        team_id: teamId,
        profile_id: userId,
      },
      include: { profile: true },
    });

    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Ошибка при вступлении" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) => {
  try {
    const { userId } = await req.json();
    const { teamId } = await params;

    await prisma.teamMember.delete({
      where: {
        team_id_profile_id: {
          team_id: teamId,
          profile_id: userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Ошибка при выходе" }, { status: 500 });
  }
};
