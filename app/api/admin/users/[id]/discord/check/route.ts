import { createAdminClient } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const GUILD_ID = "1451049043789873243";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.admin.getUserById(id);

    if (userError || !user) {
      return NextResponse.json(
        { message: "Пользователь не найден в базе" },
        { status: 404 },
      );
    }

    const discordIdentity = user.identities?.find(
      (ident) => ident.provider === "discord",
    );
    const discordUserId = discordIdentity?.id;

    if (!discordUserId) {
      return NextResponse.json({
        isOnServer: false,
        message: "Юзер не подключил дискорд",
      });
    }

    const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}`;
    const discordRes = await fetch(url, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    if (discordRes.status === 200) {
      return NextResponse.json({
        isOnServer: true,
        message: "Юзер состоит",
      });
    } else {
      return NextResponse.json({
        isOnServer: false,
        message: "Юзер не состоит",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
};
