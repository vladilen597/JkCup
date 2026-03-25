import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const updated = await prisma.globalPoll.update({
      where: { id },
      data: { is_active: false },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
