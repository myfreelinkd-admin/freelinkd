"use client";

import { Users, ShieldCheck, ArrowRight } from "lucide-react";

const communities = [
  { id: 1, name: "CodeLink Collective", members: "1.2k", status: "Verified" },
  { id: 2, name: "Pixel Perfect Guild", members: "850", status: "Verified" },
  { id: 3, name: "Data Wizards ID", members: "420", status: "Pending" },
  { id: 4, name: "Copywriting Circle", members: "310", status: "Verified" },
  { id: 5, name: "Marketing Hub", members: "150", status: "Pending" },
];

export default function PreviewCommunity() {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 h-100 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-(--primary)">
              Manage Community
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Review and manage active groups.
            </p>
          </div>
        </div>
        <button className="text-xs font-bold text-(--secondary) hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 overscroll-contain custom-scrollbar">
        {communities.map((community) => (
          <div
            key={community.id}
            className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm font-bold text-(--primary) text-xs">
                  {community.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-(--primary)">
                    {community.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {community.members} Members
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  community.status === "Verified"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                } flex items-center gap-1`}
              >
                {community.status === "Verified" && (
                  <ShieldCheck className="w-3 h-3" />
                )}
                {community.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
