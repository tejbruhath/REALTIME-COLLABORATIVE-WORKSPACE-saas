import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import DocumentModel from "@/lib/models/Document";
import Workspace from "@/lib/models/Workspace";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    await connectDB();

    // Verify user has access to workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.userId": session.user.id,
    });

    if (!workspace) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const documents = await DocumentModel.find({
      workspaceId,
      isArchived: false,
    })
      .populate("createdBy", "name email avatar")
      .populate("lastEditedBy", "name email avatar")
      .sort({ lastEditedAt: -1 });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Get documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { workspaceId, title } = await request.json();

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    await connectDB();

    // Verify user has access to workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.userId": session.user.id,
    });

    if (!workspace) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Generate unique Liveblocks room ID
    const liveblocksRoomId = `${workspaceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const document = await DocumentModel.create({
      workspaceId,
      title: title || "Untitled Document",
      content: {},
      liveblocksRoomId,
      createdBy: session.user.id,
      lastEditedBy: session.user.id,
      lastEditedAt: new Date(),
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
