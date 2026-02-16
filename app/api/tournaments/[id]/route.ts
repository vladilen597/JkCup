import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const body = await req.json();
    const ref = doc(db, "tournaments", params.id);

    await updateDoc(ref, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const ref = doc(db, "tournaments", params.id);
    await deleteDoc(ref);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
