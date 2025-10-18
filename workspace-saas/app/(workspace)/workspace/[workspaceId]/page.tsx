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
      <div className="flex-1 flex items-center justify-center p-8 ml-64">
        <div className="text-center max-w-2xl">
          <div className="p-6 bg-[#0A0A0A] inline-block mb-8">
            <svg
              className="w-24 h-24 text-[#3B82F6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">No Document Selected</h2>
          <p className="text-lg text-[#A3A3A3] mb-2">
            Choose a document from the sidebar to start editing
          </p>
          <p className="text-sm text-[#737373] mb-10">
            Or create a new document to begin collaborating with your team
          </p>
          <button
            onClick={handleCreateDocument}
            className="bg-[#3B82F6] text-white px-10 py-4 font-bold text-lg hover:bg-[#2563EB] transition-all duration-200"
          >
            Create New Document
          </button>
        </div>
      </div>
    </div>
  );
}
