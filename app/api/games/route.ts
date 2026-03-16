import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

export const GET = async () => {
  try {
    const games = await prisma.game.findMany();
    console.log(games);
    return NextResponse.json(games);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Ошибка при получении игр" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const gameId = req.nextUrl.searchParams.get("id");

    if (!gameId) {
      return NextResponse.json({ error: "ID не указан" }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Игра не найдена" }, { status: 404 });
    }
    if (game.image_url) {
      const filePath = game.image_url.split("/public/photos/")[1];

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("photos")
          .remove([filePath]);

        if (storageError) {
          console.error("Ошибка удаления файла из Storage:", storageError);
        }
      }
    }

    await prisma.game.delete({
      where: { id: gameId },
    });

    return NextResponse.json(
      { message: "Игра и файл успешно удалены" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении игры" },
      { status: 500 },
    );
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!name || !file) {
      return NextResponse.json({ error: "Данные не полны" }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("photos")
      .upload(`game_images/${fileName}`, file);

    if (storageError) throw storageError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(storageData.path);

    const newGame = await prisma.game.create({
      data: {
        name,
        image_url: publicUrl,
      },
    });

    return NextResponse.json(newGame);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
