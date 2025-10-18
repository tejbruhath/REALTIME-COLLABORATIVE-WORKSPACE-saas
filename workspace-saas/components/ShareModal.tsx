"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  color: string;
  role: string;
  joinedAt: string;
}

interface ShareModalProps {
  workspaceId: string;
  onClose: () => void;
}

export default function ShareModal({ workspaceId, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Member added successfully!");
        setEmail("");
        fetchMembers();
      } else {
        toast.error(data.error || "Failed to add member");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/members?userId=${userId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Member removed");
        fetchMembers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove member");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F1F1F]">
          <h2 className="text-xl font-semibold text-white">Share Workspace</h2>
          <button
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add Member Form */}
        <div className="p-6 border-b border-[#1F1F1F]">
          <form onSubmit={handleAddMember} className="flex gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="w-full bg-black border border-[#1F1F1F] text-white pl-10 pr-4 py-2 focus:outline-none focus:border-[#3B82F6]"
                disabled={loading}
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-black border border-[#1F1F1F] text-white px-4 py-2 focus:outline-none focus:border-[#3B82F6]"
              disabled={loading}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="bg-[#3B82F6] text-white px-6 py-2 hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <UserPlus size={18} />
              Add
            </button>
          </form>
          <p className="text-xs text-[#A3A3A3] mt-2">
            The user must have an account to be added to this workspace
          </p>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-medium text-[#A3A3A3] mb-4">
            Members ({members.length})
          </h3>

          {loadingMembers ? (
            <div className="text-center text-[#A3A3A3] py-8">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="text-center text-[#A3A3A3] py-8">No members yet</div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-black border border-[#1F1F1F] hover:border-[#3B82F6] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.name}</div>
                      <div className="text-sm text-[#A3A3A3]">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#A3A3A3] capitalize px-3 py-1 bg-[#1F1F1F]">
                      {member.role}
                    </span>
                    {member.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-[#A3A3A3] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
