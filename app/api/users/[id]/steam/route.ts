import { NextResponse } from "next/server";
import SteamAuth from "node-steam-openid";
import { cookies } from "next/headers";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const cookieStore = await cookies();

  cookieStore.set("steam_linking_user_id", id, {
    maxAge: 300,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const steam = new SteamAuth({
    realm: process.env.NEXT_PUBLIC_SITE_URL!,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/steam/callback`,
    apiKey: process.env.STEAM_API_KEY!,
  });

  const redirectUrl = await steam.getRedirectUrl();
  return NextResponse.redirect(redirectUrl);
};
