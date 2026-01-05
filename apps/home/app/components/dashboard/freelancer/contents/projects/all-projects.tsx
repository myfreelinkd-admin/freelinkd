"use client";

import {
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  DollarSign,
  Calendar,
} from "lucide-react";
import ProjectActionButton from "./ui/action-button";

interface Project {
  id: number;
  name: string;
  client: string;
  date: string;
  amount: string;
  status: "On going" | "Complete" | "Canceled";
  progress: number;
}

const projectsData: Project[] = [
  {
    id: 1,
    name: "E-Commerce Dashboard UI Kit",
    client: "TechFlow Solutions",
    date: "15 Jan 2026",
    amount: "Rp 5.000.000",
    status: "On going",
    progress: 75,
  },
  {
    id: 2,
    name: "Mobile App Branding & Identity",
    client: "Sagawa Group",
    date: "20 Jan 2026",
    amount: "Rp 8.500.000",
    status: "On going",
    progress: 40,
  },
  {
    id: 3,
    name: "Real Estate Landing Page",
    client: "AWA Construction",
    date: "10 Jan 2026",
    amount: "Rp 3.200.000",
    status: "Complete",
    progress: 100,
  },
  {
    id: 4,
    name: "Corporate Website Redesign",
    client: "Global Finance",
    date: "05 Jan 2026",
    amount: "Rp 12.000.000",
    status: "Canceled",
    progress: 15,
  },
  {
    id: 5,
    name: "Social Media Content Design",
    client: "Creative Studio",
    date: "28 Dec 2025",
    amount: "Rp 2.500.000",
    status: "Complete",
    progress: 100,
  },
];

export default function AllProjects({ filter }: { filter?: string }) {
  const filteredProjects = filter
    ? projectsData.filter((p) => p.status === filter)
    : projectsData;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "On going":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "Canceled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
      case "On going":
        return <Activity className="w-3 h-3 mr-1.5" />;
      case "Canceled":
        return <XCircle className="w-3 h-3 mr-1.5" />;
      default:
        return <Clock className="w-3 h-3 mr-1.5" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-4 pb-2">Project Details</th>
                <th className="px-4 pb-2">Client</th>
                <th className="px-4 pb-2">Budget</th>
                <th className="px-4 pb-2">Progress</th>
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
                  <td className="px-4 py-5 bg-(--alternative)/20 first:rounded-l-2xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-(--primary) text-sm">
                        {project.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Deadline:{" "}
                        {project.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-(--primary)/10 flex items-center justify-center text-[10px] font-bold text-(--primary) border border-(--primary)/10">
                        {project.client.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 font-bold">
                        {project.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-1 text-sm font-bold text-(--primary)">
                      <DollarSign className="w-3.5 h-3.5 text-(--secondary)" />
                      {project.amount}
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <div className="w-full max-w-32">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-(--primary)">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            project.status === "Canceled"
                              ? "bg-red-400"
                              : "bg-(--secondary)"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-bold border ${getStatusStyle(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 bg-(--alternative)/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-gray-100 text-right">
                    <ProjectActionButton status={project.status} />
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
