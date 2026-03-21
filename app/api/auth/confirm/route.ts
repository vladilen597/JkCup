import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

  // 1. Проверяем, может сессия УЖЕ есть (Middleware мог её создать)
  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();

  if (existingUser) {
    return NextResponse.redirect(
      `${origin}/users/${existingUser.id}/security?reset-modal=open`,
    );
  }

  // 2. Если сессии нет, пробуем обменять код
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      return NextResponse.redirect(
        `${origin}/users/${data.user.id}/security?reset-modal=open`,
      );
    }

    console.error("CONFIRM_ERROR:", error?.message);
  }

  // 3. Если всё упало, редиректим на страницу безопасности БЕЗ модалки,
  // но с ошибкой в тосте (можно поймать на фронте)
  return NextResponse.json({ error: "Ссылка невалидна" }, { status: 400 });
}
