import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const result = await prisma.$transaction(async (tx) => {
      const t = await tx.tournament.findUnique({
        where: { id },
        include: {
          game: true,
          creator: true,
          registrations: true,
          judges: true,
          teams: { include: { members: true } },
          winner_users: true, // Все призеры здесь
        },
      });

      if (!t) throw new Error("Турнир не найден");

      // Карта наград: user_id -> { reward_id, reward_value }
      const winnerRewardsMap = new Map(
        (t.winner_users || []).map((w) => [
          w.user_id,
          { id: w.reward_id, value: w.reward_value },
        ]),
      );

      // Ищем ID победителя (1 место) среди winner_users, чтобы записать его в архивный winner_user_id
      // Предполагаем, что 1 место определяется по логике твоего приложения (например, первый элемент или конкретный reward_id)
      const firstPlaceWinner = t.winner_users?.[0]?.user_id || null;

      // 1. Создаем запись архивного турнира
      const archived = await tx.archivedTournament.create({
        data: {
          id: t.id,
          name: t.name,
          type: t.type,
          max_players: t.max_players,
          max_teams: t.max_teams,
          players_per_team: t.players_per_team,
          description: t.description,
          rules: t.rules,
          rewards: t.rewards ? (t.rewards as any) : [],
          tags: t.tags ? (t.tags as any) : [],
          creator_id: t.creator_id,

          // ИСПРАВЛЕНО: берем ID главного победителя из массива наград, раз в активном турнире этого поля нет
          winner_user_id: firstPlaceWinner,

          start_date: t.start_date,
          duration: t.duration,
          game_snapshot: t.game
            ? { id: t.game.id, name: t.game.name, image_url: t.game.image_url }
            : null,
          creator_snapshot: { id: t.creator.id, name: t.creator.full_name },
          created_at: t.created_at,
          started_at: t.started_at,
        },
      });

      // 2. Архивируем судей
      if (t.judges.length > 0) {
        await tx.archivedJudge.createMany({
          data: t.judges.map((j) => ({
            user_id: j.profile_id,
            tournament_id: archived.id,
          })),
        });
      }

      // 3. Архивируем участников в зависимости от режима турнира
      if (t.type === "team") {
        for (const team of t.teams) {
          const isWinner = team.id === t.winner_team_id;

          const archTeam = await tx.archivedTeam.create({
            data: {
              tournament_id: t.id,
              name: team.name,
            },
          });

          if (isWinner) {
            await tx.archivedTournament.update({
              where: { id: t.id },
              data: { winner_team_id: archTeam.id },
            });
          }

          await tx.archivedParticipant.createMany({
            data: team.members.map((m) => {
              const reward = winnerRewardsMap.get(m.profile_id);
              return {
                tournament_id: t.id,
                user_id: m.profile_id,
                team_id: archTeam.id,
                team_name: team.name,
                is_winner: isWinner || winnerRewardsMap.has(m.profile_id),
                reward_id: reward?.id || null,
                reward_value: reward?.value || null,
              };
            }),
          });
        }
      } else {
        await tx.archivedParticipant.createMany({
          data: t.registrations.map((reg) => {
            const reward = winnerRewardsMap.get(reg.profile_id);
            return {
              tournament_id: t.id,
              user_id: reg.profile_id,
              // ИСПРАВЛЕНО: проверяем победу только по наличию в карте наград
              is_winner: winnerRewardsMap.has(reg.profile_id),
              reward_id: reward?.id || null,
              reward_value: reward?.value || null,
            };
          }),
        });
      }

      // 4. Удаляем активный турнир
      await tx.tournament.delete({ where: { id: t.id } });
      return archived;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Archive POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
