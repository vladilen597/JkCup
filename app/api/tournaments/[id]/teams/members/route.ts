import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { teamMemberRecordId } = await req.json();

    if (!teamMemberRecordId) {
      return NextResponse.json(
        { error: "ID записи не указан" },
        { status: 400 },
      );
    }

    await prisma.teamMember.delete({
      where: {
        id: teamMemberRecordId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE TEAM MEMBER ERROR:", error);
    return NextResponse.json(
      { error: "Не удалось удалить участника", details: error.message },
      { status: 500 },
    );
  }
};
