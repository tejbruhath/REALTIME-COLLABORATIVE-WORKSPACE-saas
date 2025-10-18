"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { RoomProvider } from "@/liveblocks.config";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import Toolbar from "@/components/Toolbar";
import ShareModal from "@/components/ShareModal";
import toast from "react-hot-toast";
import { Save, Check, Share2 } from "lucide-react";

export default function DocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [document, setDocument] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const workspaceId = params.workspaceId as string;
  const documentId = params.documentId as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, workspaceId, documentId]);

  const fetchData = async () => {
    try {
      const [workspacesRes, documentsRes, documentRes] = await Promise.all([
        fetch("/api/workspaces"),
        fetch(`/api/documents?workspaceId=${workspaceId}`),
        fetch(`/api/documents/${documentId}`),
      ]);

      const workspacesData = await workspacesRes.json();
      const documentsData = await documentsRes.json();
      const documentData = await documentRes.json();

      setWorkspaces(workspacesData.workspaces || []);
      setDocuments(documentsData.documents || []);
      setDocument(documentData.document);
      setTitle(documentData.document?.title || "");
    } catch (error) {
      toast.error("Failed to load document");
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
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    setSaved(false);

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        setSaved(true);
        // Update documents list
        setDocuments((prev) =>
          prev.map((doc) => (doc._id === documentId ? { ...doc, title: newTitle } : doc))
        );
      }
    } catch (error) {
      console.error("Failed to update title");
    }
  };

  const handleContentUpdate = async (content: any) => {
    setSaved(false);
    // Debounce save
    setTimeout(async () => {
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        setSaved(true);
      } catch (error) {
        console.error("Failed to save content");
      }
    }, 1000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Document not found</div>
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
      <div className="flex-1 flex flex-col">
        {/* Document Header */}
        <div className="bg-black border-b border-[#1F1F1F] px-8 py-4 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold text-white bg-transparent border-none outline-none focus:outline-none"
            placeholder="Untitled Document"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-[#A3A3A3]">
              {saved ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Saving...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <RoomProvider id={document.liveblocksRoomId}>
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="text-white">Loading editor...</div>
              </div>
            }
          >
            <Editor
              documentId={documentId}
              initialContent={document.content}
              onUpdate={handleContentUpdate}
            />
          </Suspense>
        </RoomProvider>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          workspaceId={workspaceId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
