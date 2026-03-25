import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Типизируем как Promise
) => {
  try {
    const { userId } = await req.json();

    const { id } = await params;

    const registration = await prisma.tournamentRegistration.create({
      data: {
        tournament_id: id,
        profile_id: userId,
      },
      include: { profile: true },
    });

    return NextResponse.json(registration);
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { userId } = await req.json();
    const { id } = await params;

    await prisma.tournamentRegistration.delete({
      where: {
        tournament_id_profile_id: {
          tournament_id: id,
          profile_id: userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Ошибка выхода" }, { status: 500 });
  }
};
