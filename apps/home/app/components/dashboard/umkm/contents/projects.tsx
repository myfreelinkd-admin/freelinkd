"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import StatusBar from "../layout/status-bar";

const projectsData = [
  {
    id: 1,
    name: "Website AWA Construction Development",
    freelancer: "Farhan Rasendriya",
    date: "24 Dec 2025",
    status: "Pending",
    amount: "Rp 2.500.000",
  },
  {
    id: 2,
    name: "POS Sagawa Mobile App",
    freelancer: "Ilham Ramadhan",
    date: "11 Nov 2025",
    status: "Done",
    amount: "Rp 8.000.000",
  },
  {
    id: 3,
    name: "Website Sagawa Group Redesign",
    freelancer: "Alvin",
    date: "01 Oct 2025",
    status: "Done",
    amount: "Rp 1.200.000",
  },
  {
    id: 4,
    name: "E-Learning Platform Development",
    freelancer: "Alvin",
    date: "18 Dec 2025",
    status: "Progress",
    amount: "Rp 3.500.000",
  },
  {
    id: 5,
    name: "Mobile App UI Kit Design",
    freelancer: "Sagawa Team",
    date: "05 Jan 2026",
    status: "Progress",
    amount: "Rp 5.000.000",
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects =
    activeTab === "All"
      ? projectsData
      : projectsData.filter((p) => p.status === activeTab);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "Progress":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Canceled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
      case "Progress":
        return <Activity className="w-3 h-3 mr-1.5" />;
      case "Pending":
        return <Clock className="w-3 h-3 mr-1.5" />;
      case "Canceled":
        return <XCircle className="w-3 h-3 mr-1.5" />;
      default:
        return <AlertCircle className="w-3 h-3 mr-1.5" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-(--primary)">
              Project History
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage and track your collaboration with freelancers.
            </p>
          </div>

          <StatusBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-4 pb-2">Project Name</th>
                <th className="px-4 pb-2">Freelancer</th>
                <th className="px-4 pb-2">Date</th>
                <th className="px-4 pb-2">Amount</th>
                <th className="px-4 pb-2">Status</th>
                <th className="px-4 pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="group hover:bg-(--alternative)/30 transition-colors"
                >
                  <td className="px-4 py-4 bg-(--alternative)/20 first:rounded-l-2xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-gray-100">
                    <span className="font-bold text-(--primary) text-sm">
                      {project.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-(--secondary)/20 flex items-center justify-center text-[10px] font-bold text-(--secondary)">
                        {project.freelancer.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {project.freelancer}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <span className="text-sm text-gray-500">
                      {project.date}
                    </span>
                  </td>
                  <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <span className="text-sm font-bold text-(--primary)">
                      {project.amount}
                    </span>
                  </td>
                  <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 bg-(--alternative)/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-gray-100 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
