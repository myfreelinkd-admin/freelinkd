"use client";

import { useState } from "react";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import FreelancerManagement from "@/app/components/dashboard/admin/contents/manage-user/freelancer";
import UMKMManagement from "@/app/components/dashboard/admin/contents/manage-user/umkm";
import { UserRound, Building2 } from "lucide-react";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("freelancer");

  const tabs = [
    {
      id: "freelancer",
      label: "Freelancer",
      icon: UserRound,
      color: "text-(--secondary)",
      count: "100",
    },
    {
      id: "umkm",
      label: "UMKM",
      icon: Building2,
      color: "text-blue-600",
      count: "45",
    },
  ];

  return (
    <div className="min-h-screen flex bg-(--background)">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-(--primary)">
              User Management
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              Monitor, manage, and verify all users across the Freelinkd
              platform.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-(--alternative)/50 p-1.5 rounded-2xl border border-gray-100 gap-1 w-fit mb-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? "bg-white shadow-md shadow-gray-200/50 min-w-35"
                      : "hover:bg-white/40 w-11"
                  }`}
                >
                  <tab.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? tab.color
                        : "text-gray-400 group-hover:text-(--primary)"
                    }`}
                  />
                  {isActive && (
                    <span
                      className={`text-sm font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 ${tab.color}`}
                    >
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Sections */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "freelancer" && <FreelancerManagement />}
            {activeTab === "umkm" && <UMKMManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}
