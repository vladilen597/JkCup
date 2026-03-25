import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const { email, password, full_name, who_invited } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          who_invited,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const supabaseUser = data.user;

    if (supabaseUser) {
      const allNotifications = await prisma.notification.findMany({
        select: { id: true },
      });

      if (allNotifications.length > 0) {
        await prisma.userNotification.createMany({
          data: allNotifications.map((n) => ({
            user_id: supabaseUser.id,
            notification_id: n.id,
            is_read: false,
          })),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json(
      { message: "Успешно! Проверьте почту." },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
