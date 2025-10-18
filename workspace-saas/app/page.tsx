"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FileText, Users, Zap, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Collaborative Workspace
          </h1>
          <p className="text-xl text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
            Professional real-time text editor built for teams. Create, edit, and collaborate
            seamlessly with your team members.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#3B82F6] text-white px-8 py-3 font-medium hover:bg-[#2563EB] transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-transparent border border-[#1F1F1F] text-white px-8 py-3 font-medium hover:border-[#3B82F6] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6">
            <FileText className="text-[#3B82F6] mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-2">Rich Text Editor</h3>
            <p className="text-[#A3A3A3]">
              Full-featured editor with tables, images, code blocks, and more.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6">
            <Users className="text-[#3B82F6] mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Collaboration</h3>
            <p className="text-[#A3A3A3]">
              See changes instantly as your team edits documents together.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6">
            <Zap className="text-[#3B82F6] mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-[#A3A3A3]">
              Built with performance in mind. No lag, no delays.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6">
            <Shield className="text-[#3B82F6] mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-[#A3A3A3]">
              Your data is encrypted and stored securely in MongoDB Atlas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
