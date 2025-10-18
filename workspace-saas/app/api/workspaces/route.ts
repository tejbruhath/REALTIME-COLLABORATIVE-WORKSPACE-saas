import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const workspaces = await Workspace.find({
      "members.userId": session.user.id,
    }).populate("ownerId", "name email avatar");

    return NextResponse.json({ workspaces });
  } catch (error) {
    console.error("Get workspaces error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
    }

    await connectDB();

    const workspace = await Workspace.create({
      name,
      ownerId: session.user.id,
      members: [
        {
          userId: session.user.id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error("Create workspace error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
