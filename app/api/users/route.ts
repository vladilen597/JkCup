import { authAdmin } from "@/app/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Temporarily disabled for testing
  // const authHeader = request.headers.get('authorization');
  // if (!authHeader?.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const maxResults = 100;
    const result = await authAdmin.listUsers(maxResults);

    const users = result.users.map((user) => ({
      id: user.uid,
      displayName: user.displayName || "Anonymous",
      photoURL: user.photoURL || null,
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("List users error:", error.code, error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to load users", details: error.message },
      { status: 500 },
    );
  }
}
