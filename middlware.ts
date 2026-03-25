import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js"; // Импортируем тип

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Для сброса пароля тип всегда 'recovery'
  const type = (searchParams.get("type") as EmailOtpType) || "recovery";

  if (code) {
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

    // Используем verifyOtp — это более надежный способ для ссылок из почты
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: code,
      type,
    });

    if (!error && data.user) {
      // Редирект в профиль с флагом модалки
      return NextResponse.redirect(
        `${origin}/users/${data.user.id}/security?reset-modal=open`,
      );
    }

    console.error("Auth Confirm Error:", error?.message);
  }

  // Если что-то пошло не так, вернем на главную с ошибкой
  return NextResponse.redirect(`${origin}/?error=link_expired_or_invalid`);
}
