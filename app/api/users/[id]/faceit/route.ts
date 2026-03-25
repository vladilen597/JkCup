import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
  const steamId = "76561198127080466";
  const FACEIT_API_KEY = process.env.FACEIT_API_KEY;

  try {
    const { data } = await axios.get("https://faceit.com", {
      params: {
        game: "cs2",
        game_player_id: steamId,
      },
      headers: {
        Authorization: `Bearer ${FACEIT_API_KEY}`,
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    return NextResponse.json({
      nickname: data.nickname,
      elo: data.games?.cs2?.faceit_elo || "No Elo",
      level: data.games?.cs2?.skill_level || 0,
    });
  } catch (error) {
    console.error(
      "Ошибка FaceIT:",
      error.response?.status,
      error.response?.data,
    );

    return NextResponse.json(
      { error: "Cloudflare block or User not found" },
      { status: error.response?.status || 500 },
    );
  }
};
