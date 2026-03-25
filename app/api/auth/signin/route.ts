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
    const { email, password } = await req.json();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          message:
            "Профиль пользователя не найден. Обратитесь к администрации.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Успешный вход",
        user: profile,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
};
