import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import liveblocks from "@/lib/liveblocks";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { room } = await request.json();

    // Create Liveblocks session
    const liveblocksSession = liveblocks.prepareSession(session.user.id, {
      userInfo: {
        name: session.user.name || "Anonymous",
        avatar: session.user.image || undefined,
        color: session.user.color || "#3B82F6",
      },
    });

    // Give access to the room
    if (room) {
      liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
    }

    const { status, body } = await liveblocksSession.authorize();

    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
