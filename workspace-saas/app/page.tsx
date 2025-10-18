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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
            <span className="text-blue-400 font-semibold text-sm">
              Real-Time Collaboration Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
            Collaborative<br />Workspace
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Professional real-time text editor built for teams
          </p>
          <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto">
            Create, edit, and collaborate seamlessly with your team members. Share documents, 
            leave comments, and see changes instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Powerful Features</h2>
            <p className="text-gray-400">Everything you need for seamless team collaboration</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-200 group">
              <div className="p-3 bg-blue-500/10 rounded-lg inline-block mb-4">
                <FileText className="text-blue-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Rich Text Editor
              </h3>
              <p className="text-gray-400 text-sm">
                Full-featured editor with tables, images, code blocks, and advanced formatting.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-200 group">
              <div className="p-3 bg-blue-500/10 rounded-lg inline-block mb-4">
                <Users className="text-blue-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Real-time Collaboration
              </h3>
              <p className="text-gray-400 text-sm">
                See changes instantly as your team edits documents together with live cursors.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-200 group">
              <div className="p-3 bg-blue-500/10 rounded-lg inline-block mb-4">
                <Zap className="text-blue-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Lightning Fast
              </h3>
              <p className="text-gray-400 text-sm">
                Built with Next.js and Turbopack. Zero lag, instant updates.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-200 group">
              <div className="p-3 bg-blue-500/10 rounded-lg inline-block mb-4">
                <Shield className="text-blue-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Secure & Private
              </h3>
              <p className="text-gray-400 text-sm">
                Your data is encrypted and stored securely with role-based access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
