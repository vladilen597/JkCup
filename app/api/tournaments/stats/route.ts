import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const tournamentRegistrations =
      await prisma.tournamentRegistration.findMany();
    const tournamentTeams = await prisma.tournamentTeam.findMany();

    return NextResponse.json({
      users: tournamentRegistrations.length,
      teams: tournamentTeams.length,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Ошибка получения статистики турниров",
      status: 500,
    });
  }
};
