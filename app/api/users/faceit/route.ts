import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { steam_id } = await req.json();

  try {
    const { data } = await axios.get(
      "https://open.faceit.com/data/v4/players",
      {
        params: {
          game: "cs2",
          game_player_id: steam_id,
        },
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_API_KEY}`,
        },
      },
    );

    const level = data.games?.cs2?.skill_level || 0;

    return NextResponse.json({
      nickname: data.nickname,
      elo: data.games?.cs2?.faceit_elo || "No Elo",
      level: level,
      avatar: data.avatar || "",
    });
  } catch (error: any) {
    console.error(
      "Ошибка FaceIT:",
      error.response?.status,
      error.response?.data,
    );

    return NextResponse.json(
      { error: error.response?.data || "Internal Server Error" },
      { status: error.response?.status || 500 },
    );
  }
};
