"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Folder, Settings, LogOut, Plus } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  workspaces: any[];
  documents: any[];
  currentWorkspaceId: string;
  onCreateDocument: () => void;
}

export default function Sidebar({
  workspaces,
  documents,
  currentWorkspaceId,
  onCreateDocument,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-black border-r border-[#1F1F1F] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#1F1F1F]">
        <h1 className="text-xl font-bold text-white">Workspace</h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          {workspaces.find((w) => w._id === currentWorkspaceId)?.name || "Select workspace"}
        </p>
      </div>

      {/* New Document Button */}
      <div className="p-4">
        <button
          onClick={onCreateDocument}
          className="w-full bg-[#3B82F6] text-white px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#2563EB] transition-colors"
        >
          <Plus size={18} />
          New Document
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider mb-3">
            Documents
          </h2>
          <div className="space-y-1">
            {documents.length === 0 ? (
              <p className="text-sm text-[#737373] italic">No documents yet</p>
            ) : (
              documents.map((doc) => (
                <Link
                  key={doc._id}
                  href={`/workspace/${currentWorkspaceId}/${doc._id}`}
                  className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    pathname.includes(doc._id)
                      ? "bg-[#1F1F1F] text-white"
                      : "text-[#A3A3A3] hover:bg-[#0A0A0A] hover:text-white"
                  }`}
                >
                  <FileText size={16} />
                  <span className="truncate">{doc.title}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1F1F1F] p-4 space-y-2">
        <Link
          href="/dashboard"
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#A3A3A3] hover:bg-[#0A0A0A] hover:text-white transition-colors"
        >
          <Settings size={16} />
          Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#A3A3A3] hover:bg-[#0A0A0A] hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
