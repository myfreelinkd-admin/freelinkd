"use client";

import { Building2, Calendar, CheckCircle2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface UmkmUser {
  id: string;
  username: string;
  email: string;
  profile?: {
    nama_umkm: string;
    industry: string;
    created_at?: string;
  };
}

export default function Greetings() {
  const [user, setUser] = useState<UmkmUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("umkm_user") || localStorage.getItem("umkm_user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    setLoading(false);
  }, []);

  // Format joined date
  const joinedDate = user?.profile?.created_at
    ? new Date(user.profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Left Section: Welcome & Business Info */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
        {/* Decorative Background Element */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-(--secondary)/5 rounded-full blur-3xl group-hover:bg-(--secondary)/10 transition-colors duration-500"></div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-(--primary) tracking-tight">
              Welcome Back,{" "}
              <span className="text-(--secondary)">
                {loading ? "..." : user?.username || user?.profile?.nama_umkm || "Sagawa Group"}
              </span>
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              Have a Nice Day! Let&apos;s grow your business today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-(--alternative)/50 border border-gray-50 hover:border-(--secondary)/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-(--secondary)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Industry
                </p>
                <p className="text-sm font-bold text-(--primary)">
                  {loading ? "..." : user?.profile?.industry || "Franchise"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-(--alternative)/50 border border-gray-50 hover:border-(--secondary)/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-(--secondary)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Joined Since
                </p>
                <p className="text-sm font-bold text-(--primary)">{joinedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-(--alternative)/50 border border-gray-50 hover:border-(--secondary)/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-(--secondary)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Success Rate
                </p>
                <p className="text-sm font-bold text-(--primary)">
                  98% Projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Post Project CTA */}
      <div className="bg-(--primary) rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4"></div>

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              Ready to start a new project?
            </h2>
            <p className="text-white/60 text-sm mt-3 font-medium">
              Find the best freelancers and get your work done faster.
            </p>
          </div>

          <button className="w-full py-4 bg-(--secondary) hover:bg-(--secondary)/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-(--secondary)/20 mt-6 cursor-pointer flex items-center justify-center gap-2 group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Post Project
          </button>
        </div>

        {/* Abstract Pattern */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
