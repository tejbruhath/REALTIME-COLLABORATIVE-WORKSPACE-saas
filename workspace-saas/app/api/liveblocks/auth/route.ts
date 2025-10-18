import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import liveblocks from "@/lib/liveblocks";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Document from "@/lib/models/Document";
import Workspace from "@/lib/models/Workspace";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { room } = await request.json();

    // Verify user has access to the room/document
    if (room) {
      await connectDB();
      
      // Find document by Liveblocks room ID
      const document = await Document.findOne({ liveblocksRoomId: room });
      
      if (document) {
        // Find workspace and check if user is a member
        const workspace = await Workspace.findById(document.workspaceId);
        
        if (workspace) {
          const isMember = workspace.members.some(
            (m: any) => m.userId.toString() === session.user.id
          );
          const isOwner = workspace.ownerId.toString() === session.user.id;
          
          if (!isMember && !isOwner) {
            return new NextResponse("Forbidden - Not a workspace member", { status: 403 });
          }
        }
      }
    }

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
