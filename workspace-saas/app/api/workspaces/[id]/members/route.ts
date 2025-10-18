import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";
import User from "@/lib/models/User";

// Add member to workspace
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role = "editor" } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Find the user to add
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find workspace and check permissions
    const workspace = await Workspace.findById(params.id);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if current user is owner or admin
    const currentUserMember = workspace.members.find(
      (m: any) => m.userId.toString() === session.user.id
    );

    if (
      workspace.ownerId.toString() !== session.user.id &&
      currentUserMember?.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if user is already a member
    const existingMember = workspace.members.find(
      (m: any) => m.userId.toString() === (userToAdd._id as any).toString()
    );

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      );
    }

    // Add member
    workspace.members.push({
      userId: userToAdd._id as any,
      role,
      joinedAt: new Date(),
    });

    await workspace.save();

    return NextResponse.json({
      message: "Member added successfully",
      member: {
        userId: userToAdd._id,
        email: userToAdd.email,
        name: userToAdd.name,
        role,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get workspace members
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const workspace = await Workspace.findById(params.id).populate(
      "members.userId",
      "name email avatar color"
    );

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if user has access to this workspace
    const isMember = workspace.members.some(
      (m: any) => m.userId._id.toString() === session.user.id
    );

    if (!isMember && workspace.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = workspace.members.map((m: any) => ({
      id: m.userId._id,
      name: m.userId.name,
      email: m.userId.email,
      avatar: m.userId.avatar,
      color: m.userId.color,
      role: m.role,
      joinedAt: m.joinedAt,
    }));

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove member from workspace
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdToRemove = searchParams.get("userId");

    if (!userIdToRemove) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectDB();

    const workspace = await Workspace.findById(params.id);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if current user is owner or admin
    const currentUserMember = workspace.members.find(
      (m: any) => m.userId.toString() === session.user.id
    );

    if (
      workspace.ownerId.toString() !== session.user.id &&
      currentUserMember?.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cannot remove owner
    if (workspace.ownerId.toString() === userIdToRemove) {
      return NextResponse.json(
        { error: "Cannot remove workspace owner" },
        { status: 400 }
      );
    }

    // Remove member
    workspace.members = workspace.members.filter(
      (m: any) => m.userId.toString() !== userIdToRemove
    );

    await workspace.save();

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
