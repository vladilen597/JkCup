import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { prisma } from "@/lib/prisma";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const ref = doc(db, "tournaments", id);

    await updateDoc(ref, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    await prisma.tournament.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить турнир", details: error.message },
      { status: 500 },
    );
  }
};
