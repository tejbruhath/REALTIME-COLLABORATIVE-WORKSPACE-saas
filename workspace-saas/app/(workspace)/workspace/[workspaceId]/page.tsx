"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = params.workspaceId as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, workspaceId]);

  const fetchData = async () => {
    try {
      const [workspacesRes, documentsRes] = await Promise.all([
        fetch("/api/workspaces"),
        fetch(`/api/documents?workspaceId=${workspaceId}`),
      ]);

      const workspacesData = await workspacesRes.json();
      const documentsData = await documentsRes.json();

      setWorkspaces(workspacesData.workspaces || []);
      setDocuments(documentsData.documents || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, title: "Untitled Document" }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Document created");
        router.push(`/workspace/${workspaceId}/${data.document._id}`);
      } else {
        toast.error("Failed to create document");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar
        workspaces={workspaces}
        documents={documents}
        currentWorkspaceId={workspaceId}
        onCreateDocument={handleCreateDocument}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Select a document</h2>
          <p className="text-[#A3A3A3] mb-8">
            Choose a document from the sidebar or create a new one
          </p>
          <button
            onClick={handleCreateDocument}
            className="bg-[#3B82F6] text-white px-6 py-3 hover:bg-[#2563EB] transition-colors"
          >
            Create New Document
          </button>
        </div>
      </div>
    </div>
  );
}
