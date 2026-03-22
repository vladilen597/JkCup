import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { old_password, new_password } = await req.json();
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (c) => c.forEach((cookie) => cookieStore.set(cookie)),
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Сессия истекла" }, { status: 401 });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: old_password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Старый пароль неверен" },
        { status: 401 },
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }
    await supabase.auth.signOut({ scope: "global" });

    return NextResponse.json({ message: "Пароль успешно изменен" });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
};
