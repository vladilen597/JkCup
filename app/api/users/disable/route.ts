import { authAdmin } from "@/app/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { id } = await req.json();
    await authAdmin.updateUser(id, {
      disabled: true,
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
  }
};
