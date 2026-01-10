"use client";

import { useState, useEffect } from "react";
import {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  MessageCircle,
  ShieldAlert,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  TrendingUp,
  Loader2,
} from "lucide-react";
import ProjectActionButton from "./ui/button";

// Type definition for project data
interface Project {
  id: string;
  name: string;
  client: { name: string; avatar: string; email: string };
  freelancer: { name: string; avatar: string; email: string };
  date: string;
  amount: string;
  status: string;
  progress: number;
  description?: string;
  category?: string;
}

export default function AdminManageProjects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjectsData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "all", label: "All Projects", icon: LayoutGrid, color: "text-(--primary)" },
    { id: "ongoing", label: "In Progress", icon: Activity, color: "text-blue-600" },
    { id: "complete", label: "Completed", icon: CheckCircle2, color: "text-green-600" },
    { id: "canceled", label: "Canceled", icon: XCircle, color: "text-red-600" },
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "ongoing"
        ? project.status === "Process"
        : activeTab === "complete"
        ? project.status === "Complete"
        : project.status === "Canceled";

    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "Process":
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
      case "Process":
        return <Activity className="w-3 h-3 mr-1.5" />;
      case "Canceled":
        return <XCircle className="w-3 h-3 mr-1.5" />;
      default:
        return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--primary)">Project Management</h1>
          <p className="text-gray-400 mt-1 font-medium">
            Monitor and manage all project activities across the platform.
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
        {/* Tab Navigation */}
        <div className="flex items-center bg-(--alternative)/50 p-1.5 rounded-2xl border border-gray-100 gap-1 w-full lg:w-fit overflow-x-auto no-scrollbar">
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

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full lg:w-auto p-1">
          <div className="relative group flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
            <input
              type="text"
              placeholder="Search projects, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary)/20 focus:border-(--secondary) transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          <button className="p-2.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl transition-all cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-4 pb-4">Project Details</th>
                  <th className="px-4 pb-4">Client</th>
                  <th className="px-4 pb-4">Freelancer</th>
                  <th className="px-4 pb-4">Budget</th>
                  <th className="px-4 pb-4">Progress</th>
                  <th className="px-4 pb-4">Status</th>
                  <th className="px-4 pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="group hover:bg-(--alternative)/30 transition-colors"
                    >
                      <td className="px-4 py-5 bg-(--alternative)/10 first:rounded-l-3xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-gray-100 transition-all">
                        <div className="flex flex-col max-w-50">
                          <span className="font-bold text-(--primary) text-sm truncate" title={project.name}>
                            {project.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium mt-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-gray-300" /> 
                            {project.date}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-5 bg-(--alternative)/10 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100 shadow-sm relative group/avatar cursor-help">
                            {project.client.avatar}
                            <div className="absolute opacity-0 group-hover/avatar:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap transition-opacity pointer-events-none">
                              {project.client.email}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">
                              {project.client.name}
                            </span>
                            <span className="text-[10px] text-gray-400">Client</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 bg-(--alternative)/10 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-100 shadow-sm relative group/avatar cursor-help">
                            {project.freelancer.avatar}
                            <div className="absolute opacity-0 group-hover/avatar:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap transition-opacity pointer-events-none">
                              {project.freelancer.email}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">
                              {project.freelancer.name}
                            </span>
                            <span className="text-[10px] text-gray-400">Freelancer</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 bg-(--alternative)/10 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100 transition-all">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-(--primary) bg-white/50 px-2.5 py-1.5 rounded-lg w-fit border border-gray-100/50">
                          <DollarSign className="w-3.5 h-3.5 text-(--secondary)" />
                          {project.amount}
                        </div>
                      </td>

                      <td className="px-4 py-5 bg-(--alternative)/10 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100 transition-all">
                        <div className="w-full max-w-35">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-(--primary)">
                              Task Completion
                            </span>
                            <span className="text-[10px] font-bold text-(--secondary)">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                project.status === "Canceled"
                                  ? "bg-red-400"
                                  : "bg-(--secondary)"
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 bg-(--alternative)/10 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100 transition-all">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-bold border shadow-sm ${getStatusStyle(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </td>

                      <td className="px-4 py-5 bg-(--alternative)/10 last:rounded-r-3xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-gray-100 transition-all text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ProjectActionButton 
                            status={project.status}
                            onView={() => console.log("View", project.name)}
                            onEdit={() => console.log("Edit", project.name)}
                            onDelete={() => console.log("Delete", project.name)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-(--primary)">No projects found</h3>
                         <p className="text-gray-400 text-sm mt-1">Try allowing more search terms or changing filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Mock) */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-400">
              Showing {filteredProjects.length} of {projectsData.length} projects
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-(--primary) hover:bg-gray-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-4 py-2 text-xs font-bold bg-(--primary) text-white rounded-xl shadow-lg shadow-(--primary)/20 hover:bg-(--primary)/90 transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
