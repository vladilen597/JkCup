import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: userId } = await params;

    const userNotifications = await prisma.userNotification.findMany({
      where: { user_id: userId },
      include: { notification: true },
      orderBy: { notification: { created_at: "desc" } },
    });
    console.log(userNotifications);
    return NextResponse.json(userNotifications);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Ошибка получения оповещений пользователя",
    });
  }
};
