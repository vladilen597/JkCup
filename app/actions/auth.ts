"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: any) {
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

  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  return { user: profile };
}
