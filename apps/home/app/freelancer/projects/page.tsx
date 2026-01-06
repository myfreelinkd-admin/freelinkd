"use client";

import { useState } from "react";
import Sidebar from "@/app/components/dashboard/freelancer/layout/sidebar";
import Navbar from "@/app/components/dashboard/freelancer/layout/navbar";
import AllProjects from "@/app/components/dashboard/freelancer/contents/projects/all-projects";
import CompleteProjects from "@/app/components/dashboard/freelancer/contents/projects/complete";
import CanceledProjects from "@/app/components/dashboard/freelancer/contents/projects/canceled";
import { LayoutGrid, CheckCircle2, XCircle, Activity } from "lucide-react";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", icon: LayoutGrid, color: "text-(--primary)" },
    {
      id: "ongoing",
      label: "Process",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      id: "complete",
      label: "Complete",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    { id: "canceled", label: "Canceled", icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen flex bg-(--background)">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-(--primary)">
              Manage Projects
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              Manage your projects, track progress, and view your project
              history.
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
                      {tab.label} Projects
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Sections */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "all" && <AllProjects />}
            {activeTab === "ongoing" && <AllProjects filter="Process" />}
            {activeTab === "complete" && <CompleteProjects />}
            {activeTab === "canceled" && <CanceledProjects />}
          </div>
        </main>
      </div>
    </div>
  );
}
