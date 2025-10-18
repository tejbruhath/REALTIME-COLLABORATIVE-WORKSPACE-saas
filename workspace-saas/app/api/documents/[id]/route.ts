import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import DocumentModel from "@/lib/models/Document";
import Workspace from "@/lib/models/Workspace";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const document = await DocumentModel.findById(params.id)
      .populate("createdBy", "name email avatar")
      .populate("lastEditedBy", "name email avatar");

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify user has access to workspace
    const workspace = await Workspace.findOne({
      _id: document.workspaceId,
      "members.userId": session.user.id,
    });

    if (!workspace) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Get document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content } = await request.json();

    await connectDB();

    const document = await DocumentModel.findById(params.id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify user has access to workspace
    const workspace = await Workspace.findOne({
      _id: document.workspaceId,
      "members.userId": session.user.id,
    });

    if (!workspace) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Update document
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;
    document.lastEditedBy = session.user.id as any;
    document.lastEditedAt = new Date();

    await document.save();

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Update document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const document = await DocumentModel.findById(params.id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify user has access to workspace
    const workspace = await Workspace.findOne({
      _id: document.workspaceId,
      "members.userId": session.user.id,
    });

    if (!workspace) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Soft delete
    document.isArchived = true;
    await document.save();

    return NextResponse.json({ message: "Document archived" });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
