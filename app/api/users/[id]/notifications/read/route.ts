import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { id } = await req.json();
    const updated = await prisma.userNotification.update({
      where: { id },
      data: { is_read: true, read_at: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Ошибка прочтения уведомления" },
      { status: 500 },
    );
  }
};
