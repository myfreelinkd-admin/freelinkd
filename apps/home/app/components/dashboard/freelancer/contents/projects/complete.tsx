"use client";

import {
  MoreHorizontal,
  DollarSign,
  Calendar,
  Star,
  Download,
} from "lucide-react";

const completedProjects = [
  {
    id: 3,
    name: "Real Estate Landing Page",
    client: "AWA Construction",
    date: "10 Jan 2026",
    amount: "Rp 3.200.000",
    rating: 5,
    review: "Excellent work, very responsive!",
  },
  {
    id: 5,
    name: "Social Media Content Design",
    client: "Creative Studio",
    date: "28 Dec 2025",
    amount: "Rp 2.500.000",
    rating: 4.8,
    review: "Great design sense.",
  },
];

export default function CompleteProjects() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-4 pb-2">Completed Project</th>
                <th className="px-4 pb-2">Client</th>
                <th className="px-4 pb-2">Earnings</th>
                <th className="px-4 pb-2">Rating</th>
                <th className="px-4 pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {completedProjects.map((project) => (
                <tr
                  key={project.id}
                  className="group hover:bg-green-50/30 transition-colors"
                >
                  <td className="px-4 py-5 bg-green-50/20 first:rounded-l-2xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-green-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-(--primary) text-sm">
                        {project.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Finished:{" "}
                        {project.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-green-50/20 group-hover:bg-transparent border-y border-transparent group-hover:border-green-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-600 border border-green-200">
                        {project.client.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 font-bold">
                        {project.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-green-50/20 group-hover:bg-transparent border-y border-transparent group-hover:border-green-100">
                    <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                      <DollarSign className="w-3.5 h-3.5" />
                      {project.amount}
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-green-50/20 group-hover:bg-transparent border-y border-transparent group-hover:border-green-100">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-(--primary)">
                        {project.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-green-50/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-green-100 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 bg-white hover:bg-green-50 rounded-xl transition-all text-green-600 shadow-sm border border-green-100 cursor-pointer group/btn">
                        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
