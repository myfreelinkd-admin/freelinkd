"use client";

import { Calendar, AlertCircle } from "lucide-react";
import ProjectActionButton from "./ui/action-button";

const canceledProjects = [
  {
    id: 4,
    name: "Corporate Website Redesign",
    client: "Global Finance",
    date: "05 Jan 2026",
    amount: "Rp 12.000.000",
    reason: "Client budget cuts",
    canceledDate: "02 Jan 2026",
  },
];

export default function CanceledProjects() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-4 pb-2">Canceled Project</th>
                <th className="px-4 pb-2">Client</th>
                <th className="px-4 pb-2">Original Budget</th>
                <th className="px-4 pb-2">Reason</th>
                <th className="px-4 pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {canceledProjects.map((project) => (
                <tr
                  key={project.id}
                  className="group hover:bg-red-50/30 transition-colors"
                >
                  <td className="px-4 py-5 bg-red-50/20 first:rounded-l-2xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-red-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-(--primary) text-sm">
                        {project.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Canceled:{" "}
                        {project.canceledDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-red-50/20 group-hover:bg-transparent border-y border-transparent group-hover:border-red-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600 border border-red-200">
                        {project.client.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 font-bold">
                        {project.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-red-50/20 group-hover:bg-transparent border-y border-transparent group-hover:border-red-100">
                    <span className="text-sm font-bold text-gray-400 line-through">
                      {project.amount}
                    </span>
                  </td>
                  <td className="px-4 py-5 bg-red-50/20 group-hover:bg-transparent border-y border-transparent group-hover:border-red-100">
                    <div className="flex items-center gap-2 text-xs font-medium text-red-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {project.reason}
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-red-50/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-red-100 text-right">
                    <ProjectActionButton status="Canceled" />
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
