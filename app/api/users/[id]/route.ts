import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const user = await prisma.profile.findUnique({
      where: { id },
      include: {
        judged_tournaments: {
          include: {
            tournament: true,
          },
        },
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Ошибка загрузки пользователя",
    });
  }
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    await prisma.profile.delete({
      where: { id },
    });

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      console.warn(
        "User deleted from DB but failed in Auth:",
        authError.message,
      );
    }

    return NextResponse.json({ message: "Пользователь полностью удален" });
  } catch (error: any) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
