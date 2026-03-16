import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: { creator: true },
    });
    console.log(feedbacks);
    return NextResponse.json(feedbacks);
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
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Неавторизован" }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || text.trim().length < 3) {
      return NextResponse.json(
        { message: "Текст слишком короткий" },
        { status: 400 },
      );
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        text: text.trim(),
        creator_id: user.id,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (err: any) {
    console.error("Feedback error:", err.message);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
};
