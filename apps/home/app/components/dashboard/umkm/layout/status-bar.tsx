"use client";

import {
  LayoutGrid,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  type LucideIcon,
} from "lucide-react";

interface Tab {
  name: string;
  icon: LucideIcon;
  color: string;
}

interface StatusBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function StatusBar({ activeTab, setActiveTab }: StatusBarProps) {
  const tabs: Tab[] = [
    { name: "All", icon: LayoutGrid, color: "text-(--primary)" },
    { name: "Progress", icon: Activity, color: "text-blue-600" },
    { name: "Done", icon: CheckCircle2, color: "text-green-600" },
    { name: "Pending", icon: Clock, color: "text-amber-600" },
    { name: "Canceled", icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="flex items-center bg-(--alternative)/50 p-1.5 rounded-2xl border border-gray-100 gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
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
                {tab.name} Projects
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
