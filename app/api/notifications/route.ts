import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.log(error);
    NextResponse.json({
      status: 200,
      message: error.response?.data?.message || "Ошибка получения отзывов",
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { title, text, type, priority, creatorId } = await req.json();

    const notification = await prisma.notification.create({
      data: {
        title: title.trim(),
        text: text.trim(),
        type: type || "info",
        priority: priority || 0,
      },
    });

    const users = await prisma.profile.findMany({
      select: { id: true },
      where: { status: "active" },
    });

    if (users.length > 0) {
      await prisma.userNotification.createMany({
        data: users.map((user) => ({
          user_id: user.id,
          notification_id: notification.id,
          is_read: false,
        })),
        skipDuplicates: true,
      });
    }

    const userNotificationForCreator = await prisma.userNotification.findFirst({
      where: {
        user_id: creatorId,
        notification_id: notification.id,
      },
      include: {
        notification: true,
      },
    });

    return NextResponse.json(userNotificationForCreator);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const notificationId = req.nextUrl.searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json({ error: "ID не указан" }, { status: 400 });
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({
      message: "Уведомление удалено у всех пользователей",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        error:
          err.code === "P2025" ? "Уведомление не найдено" : "Ошибка сервера",
      },
      { status: 500 },
    );
  }
};
