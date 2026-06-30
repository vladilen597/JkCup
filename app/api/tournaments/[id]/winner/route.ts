import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const { type, winners } = await req.json(); // Принимаем тип турнира и единый массив распределения мест

    // Универсальная проверка для обоих типов турниров
    if (!winners || !Array.isArray(winners)) {
      return NextResponse.json(
        { error: "Массив распределения победителей обязателен" },
        { status: 400 },
      );
    }

    const updatedTournament = await prisma.$transaction(async (tx) => {
      // 1. Очищаем старые записи победителей этого турнира (на случай пересохранения)
      await tx.tournamentWinner.deleteMany({
        where: { tournament_id: id },
      });

      // 2. Формируем плоский массив игроков для массовой вставки в базу
      const winnersData: any[] = [];

      if (type === "user") {
        // Одиночный турнир: просто перекладываем поля
        winners.forEach((w: any) => {
          winnersData.push({
            tournament_id: id,
            user_id: w.user_id,
            reward_id: w.reward_id,
            reward_value: w.reward_value,
            team_name: null, // Имени команды у соло-игроков нет
          });
        });
      } else if (type === "team") {
        // Командный турнир: разворачиваем состав каждой команды, чтобы учесть статистику всех участников
        winners.forEach((w: any) => {
          if (w.team && Array.isArray(w.team.members)) {
            w.team.members.forEach((member: any) => {
              // Ищем ID пользователя внутри объекта участника команды
              const playerUserId =
                member.profile?.id || member.user_id || member.profile_id;
              if (playerUserId) {
                winnersData.push({
                  tournament_id: id,
                  user_id: playerUserId,
                  reward_id: w.reward_id,
                  reward_value: w.reward_value,
                  team_name: w.team.name, // Привязываем имя команды строкой
                });
              }
            });
          }
        });
      }

      // 3. Массово записываем всех победителей в таблицу результатов (tournament_winners)
      if (winnersData.length > 0) {
        await tx.tournamentWinner.createMany({
          data: winnersData,
        });
      }

      // 4. Обновляем статус турнира и возвращаем объект со всеми нужными фронтенду инклюдами
      return await tx.tournament.update({
        where: { id },
        data: {
          status: "finished",
        },
        include: {
          game: true,
          creator: true,
          winner_users: {
            include: {
              user: true, // Подтягиваем профили игроков для красивого вывода результатов
            },
          },
          registrations: {
            include: { profile: true },
          },
          teams: {
            include: {
              members: { include: { profile: true } },
            },
          },
        },
      });
    });

    return NextResponse.json(updatedTournament);
  } catch (error: any) {
    console.error("WINNER SET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
