import { NextRequest, NextResponse } from "next/server";
import SteamAuth from "node-steam-openid";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("steam_linking_user_id")?.value;

  if (!userId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/tournaments?error=session_lost`,
    );
  }

  const steam = new SteamAuth({
    realm: process.env.NEXT_PUBLIC_SITE_URL!,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/steam/callback`,
    apiKey: process.env.STEAM_API_KEY!,
  });

  try {
    const steamUser = await steam.authenticate(req);

    await prisma.profile.update({
      where: { id: userId },
      data: {
        steam_id: steamUser.steamid,
        steam_name: steamUser.username,
        steam_avatar: steamUser.avatar.large,
        steam_profile_url:
          typeof steamUser.profile === "object"
            ? steamUser.profile.url
            : steamUser.profile,
      },
    });

    cookieStore.delete("steam_linking_user_id");

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/users/${userId}/integrations?status=steam_success`,
    );
  } catch (error: any) {
    console.error("Steam Error:", error.message);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/users/${userId}/integrations?error=steam_fail`,
    );
  }
};
