"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchWorkspaces();
    }
  }, [status, router]);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch("/api/workspaces");
      const data = await response.json();
      setWorkspaces(data.workspaces || []);
    } catch (error) {
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-[#A3A3A3]">Welcome back, {session?.user?.name}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <button
                key={workspace._id}
                onClick={() => handleWorkspaceClick(workspace._id)}
                className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 text-left hover:border-[#3B82F6] transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="text-[#3B82F6]" size={24} />
                  <span className="text-xs text-[#737373]">
                    {workspace.members?.length || 0} members
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
                  {workspace.name}
                </h3>
                <p className="text-sm text-[#A3A3A3]">
                  Created {formatDistanceToNow(new Date(workspace.createdAt))} ago
                </p>
              </button>
            ))}
          </div>
        </div>

        {workspaces.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-[#3B82F6] mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
            <p className="text-[#A3A3A3] mb-6">
              A default workspace was created for you. Refresh the page if you don't see it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
