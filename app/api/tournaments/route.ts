import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        game: true,
        creator: true,
        winner_user: true,
        winner_team: true,

        judges: {
          include: {
            profile: true,
          },
        },

        registrations: {
          include: {
            profile: true,
          },
        },

        teams: {
          include: {
            creator: true,
            members: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(tournaments);
  } catch (error: any) {
    console.error("Error fetching tournaments with all relations:", error);
    return NextResponse.json(
      { error: "Failed to load tournaments", details: error.message },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    console.log(body);

    const tournament = await prisma.tournament.create({
      data: {
        name: body.name,
        type: body.type,
        max_players: body.max_players,
        max_teams: body.max_teams,
        players_per_team: body.players_per_team,
        description: body.description,
        is_bracket: body.is_bracket,
        rules: body.rules,
        stream_link: body.stream_link,
        hidden: body.hidden,
        duration: body.duration,
        start_date: body.start_date,
        tags: body.tags || [],
        rewards: body.rewards,

        creator: {
          connect: { id: body.creator_id },
        },
        ...(body.game_id && {
          game: { connect: { id: body.game_id } },
        }),
      },
      include: {
        creator: true,
        game: true,
      },
    });

    return NextResponse.json(tournament);
  } catch (error: any) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "Failed to create tournament", details: error.message },
      { status: 500 },
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();

    const {
      id: _id,
      game,
      game_id,
      creator,
      creator_id,
      registrations,
      teams,
      judges,
      rounds,
      winner_user,
      winner_user_id,
      winner_team,
      winner_team_id,
      created_at,
      ...updateData
    } = body;

    const updatedTournament = await prisma.tournament.update({
      where: { id: id as string },
      data: {
        ...updateData,
        bracket: updateData.bracket || undefined,
        rewards: updateData.rewards || undefined,
        tags: updateData.tags || undefined,

        game: game_id ? { connect: { id: game_id } } : { disconnect: true },

        winner_user: winner_user_id
          ? { connect: { id: winner_user_id } }
          : undefined,
        winner_team: winner_team_id
          ? { connect: { id: winner_team_id } }
          : undefined,

        start_date: body.start_date ? new Date(body.start_date) : null,
        started_at: body.started_at ? new Date(body.started_at) : null,
      },
      include: {
        game: true,
        creator: true,
        winner_user: true,
        winner_team: {
          include: {
            members: { include: { profile: true } },
          },
        },
        registrations: { include: { profile: true } },
        teams: {
          include: {
            members: { include: { profile: true } },
          },
        },
        judges: { include: { profile: true } },
        rounds: {
          orderBy: { number: "asc" },
          include: {
            matches: {
              include: {
                participants: { include: { profile: true, team: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error: any) {
    console.error("PRISMA UPDATE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
