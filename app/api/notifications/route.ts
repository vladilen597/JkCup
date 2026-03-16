import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    console.log(notifications);
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
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  try {
    const { title, text } = await req.json();

    console.log(title, text);

    const notification = await prisma.notification.create({
      data: {
        title: title.trim(),
        text: text.trim(),
      },
    });

    return NextResponse.json(notification);
  } catch (err) {
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
      status: 200,
      message: "Успешно удалено уведомление",
    });
  } catch (err) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
