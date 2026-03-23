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
        },
      });

      console.log("rules", t.rules);
      if (!t) throw new Error("Турнир не найден");

      console.log("game", t);

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
          rewards: t.rewards || {},
          tags: t.tags || {},
          creator_id: t.creator_id,
          winner_user_id: t.winner_user_id,
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

      if (t.judges.length > 0) {
        await tx.archivedJudge.createMany({
          data: t.judges.map((j) => ({
            user_id: j.profile_id,
            tournament_id: archived.id,
          })),
        });
      }

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
            data: team.members.map((m) => ({
              tournament_id: t.id,
              user_id: m.profile_id,
              team_id: archTeam.id,
              team_name: team.name,
              is_winner: isWinner,
            })),
          });
        }
      } else {
        await tx.archivedParticipant.createMany({
          data: t.registrations.map((reg) => ({
            tournament_id: t.id,
            user_id: reg.profile_id,
            is_winner: reg.profile_id === t.winner_user_id,
          })),
        });
      }

      await tx.tournament.delete({ where: { id: t.id } });
      return archived;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
