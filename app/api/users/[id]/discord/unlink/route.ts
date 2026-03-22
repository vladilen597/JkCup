import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
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

    if (userError || !user || user.id !== id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const identities = user.identities ?? [];

    if (identities.length <= 1) {
      return NextResponse.json(
        {
          error:
            "Нельзя отвязать единственный способ входа. Сначала добавьте пароль или другую соцсеть.",
        },
        { status: 400 },
      );
    }

    const discordIdentity = user.identities.find(
      ({ provider }) => provider === "discord",
    );

    if (discordIdentity) {
      const { error: unlinkError } =
        await supabase.auth.unlinkIdentity(discordIdentity);

      if (unlinkError) {
        return NextResponse.json(
          { error: "Не удалось отвязать Discord в Auth" },
          { status: 400 },
        );
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        discord_full_name: null,
        discord_global_name: null,
        discord_id: null,
        discord_avatar: null,
      },
      include: {
        judged_tournaments: {
          include: {
            tournament: true,
          },
        },
        games: true,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
