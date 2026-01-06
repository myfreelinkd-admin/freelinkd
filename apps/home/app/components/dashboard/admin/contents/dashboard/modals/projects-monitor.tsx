"use client";

import {
  X,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";

interface ProjectsMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ongoingProjects = [
  {
    id: 1,
    name: "E-Commerce Dashboard UI Kit",
    freelancer: "Farhan Rasendriya",
    client: "TechFlow Solutions",
    deadline: "15 Jan 2026",
    progress: 75,
    status: "In Progress",
  },
  {
    id: 2,
    name: "Mobile App Branding & Identity",
    freelancer: "Ilham Ramadhan",
    client: "Sagawa Group",
    deadline: "20 Jan 2026",
    progress: 40,
    status: "In Progress",
  },
  {
    id: 3,
    name: "Real Estate Landing Page",
    freelancer: "Alvin",
    client: "AWA Construction",
    deadline: "10 Jan 2026",
    progress: 90,
    status: "Review",
  },
  {
    id: 4,
    name: "Corporate Website Redesign",
    freelancer: "Sagawa Team",
    client: "Global Finance",
    deadline: "25 Jan 2026",
    progress: 20,
    status: "In Progress",
  },
];

export default function ProjectsMonitor({
  isOpen,
  onClose,
}: ProjectsMonitorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-(--primary)">
              Monitor Process Jobs
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Track progress of active projects across the platform.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project, freelancer, or client..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-(--secondary) outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-(--primary) hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Job List Table */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-4 pb-2">Project Details</th>
                  <th className="px-4 pb-2">Freelancer</th>
                  <th className="px-4 pb-2">Client</th>
                  <th className="px-4 pb-2">Deadline</th>
                  <th className="px-4 pb-2">Progress</th>
                  <th className="px-4 pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {ongoingProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="group hover:bg-(--alternative)/30 transition-colors"
                  >
                    <td className="px-4 py-4 bg-(--alternative)/20 first:rounded-l-2xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-gray-100">
                      <div className="flex flex-col">
                        <span className="font-bold text-(--primary) text-sm">
                          {project.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {project.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-(--secondary)/10 flex items-center justify-center text-[10px] font-bold text-(--secondary)">
                          {project.freelancer.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {project.freelancer}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                      <span className="text-sm text-gray-600 font-medium">
                        {project.client}
                      </span>
                    </td>
                    <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">
                        {project.deadline}
                      </span>
                    </td>
                    <td className="px-4 py-4 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                      <div className="w-full max-w-30">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-(--primary)">
                            {project.progress}%
                          </span>
                          {project.progress === 100 && (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-(--secondary) rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-(--alternative)/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-gray-100 text-right">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100 cursor-pointer">
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
    </div>
  );
}
