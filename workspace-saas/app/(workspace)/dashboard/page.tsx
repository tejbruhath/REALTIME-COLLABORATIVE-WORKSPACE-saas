"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Plus, FileText, LogOut } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="mb-16 flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3">Dashboard</h1>
            <p className="text-lg text-[#A3A3A3]">
              Welcome back, <span className="text-white font-medium">{session?.user?.name}</span>
            </p>
            <p className="text-sm text-[#737373] mt-2">
              Manage your workspaces and collaborate with your team in real-time
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Workspaces Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Your Workspaces</h2>
              <p className="text-sm text-[#737373]">
                Click on a workspace to view and manage documents
              </p>
            </div>
            <div className="text-sm text-[#A3A3A3]">
              {workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'}
            </div>
          </div>

          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((workspace) => (
                <button
                  key={workspace._id}
                  onClick={() => handleWorkspaceClick(workspace._id)}
                  className="bg-[#0A0A0A] p-8 text-left hover:bg-[#1F1F1F] transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-black">
                      <FileText className="text-[#3B82F6]" size={28} strokeWidth={2} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#737373] uppercase tracking-wider mb-1">
                        Members
                      </div>
                      <div className="text-lg font-bold text-white">
                        {workspace.members?.length || 0}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#3B82F6] transition-colors">
                    {workspace.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#A3A3A3]">
                    <div className="w-1 h-1 bg-[#3B82F6]"></div>
                    <span>Created {formatDistanceToNow(new Date(workspace.createdAt))} ago</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-[#0A0A0A] p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-black inline-block mb-6">
                  <FileText className="text-[#3B82F6]" size={48} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No workspaces yet</h3>
                <p className="text-[#A3A3A3] mb-2">
                  A default workspace should have been created for you automatically.
                </p>
                <p className="text-sm text-[#737373]">
                  Try refreshing the page or contact support if the issue persists.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
