import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const formData = await req.formData();

    const rawId = formData.get("id") as string;
    if (!rawId)
      return NextResponse.json({ message: "ID не указан" }, { status: 400 });
    const id = rawId.trim();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user || user.id !== id) {
      return NextResponse.json({ message: "Доступ запрещен" }, { status: 403 });
    }

    const updateData: any = {};

    if (formData.has("full_name"))
      updateData.full_name = formData.get("full_name");
    if (formData.has("discord")) updateData.discord = formData.get("discord");
    if (formData.has("steam_link"))
      updateData.steam_link = formData.get("steam_link");

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(`user_images/${fileName}`, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("photos")
        .getPublicUrl(`user_images/${fileName}`);

      updateData.image_url = publicUrl;
    }

    const gameIdsRaw = formData.get("gameIds") as string;
    let gameConnect: any = undefined;

    console.log("gameIdsRaw", gameIdsRaw);
    if (gameIdsRaw) {
      const gameIds: string[] = JSON.parse(gameIdsRaw);

      gameConnect = {
        set: gameIds.map((id) => ({ id })),
      };
    }

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        ...updateData,
        games: gameConnect,
      },
      include: {
        games: true,
      },
    });

    console.log(updatedProfile);

    return NextResponse.json({ user: updatedProfile }, { status: 200 });
  } catch (err: any) {
    console.error("Update error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
