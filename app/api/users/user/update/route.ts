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

    // 1. Чистим ID от возможных пробелов и проверяем его
    const rawId = formData.get("id") as string;
    if (!rawId)
      return NextResponse.json({ message: "ID не указан" }, { status: 400 });
    const id = rawId.trim();

    // 2. Проверка авторизации через сессию Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user || user.id !== id) {
      return NextResponse.json({ message: "Доступ запрещен" }, { status: 403 });
    }

    // 3. Собираем объект обновления только из тех полей, что пришли
    const updateData: any = {};

    if (formData.has("full_name"))
      updateData.full_name = formData.get("full_name");
    if (formData.has("discord")) updateData.discord = formData.get("discord");
    if (formData.has("steam_link"))
      updateData.steam_link = formData.get("steam_link");

    // 4. Обработка КАРТИНКИ (только если пришел новый файл)
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

    // 5. Обработка ИГР (через Many-to-Many коннект)
    const gameIdsRaw = formData.get("gameIds") as string;
    let gameConnect: any = undefined;

    if (gameIdsRaw) {
      const gameIds: string[] = JSON.parse(gameIdsRaw);

      // Вместо простого set в общем объекте,
      // мы явно говорим Prisma: "отключи всё старое и подключи это"
      gameConnect = {
        set: gameIds.map((id) => ({ id })),
      };
    }

    // 6. Обновление в БД
    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        ...updateData,
        games: gameConnect, // Передаем сформированный объект set
      },
      include: {
        games: true,
      },
    });

    return NextResponse.json({ user: updatedProfile }, { status: 200 });
  } catch (err: any) {
    console.error("Update error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
