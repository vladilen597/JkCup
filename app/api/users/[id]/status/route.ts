import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const updatedUser = await prisma.profile.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
