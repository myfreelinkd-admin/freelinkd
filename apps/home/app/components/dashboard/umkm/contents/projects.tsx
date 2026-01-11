"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Loader2,
  Users,
} from "lucide-react";
import StatusBar from "../layout/status-bar";

interface Project {
  id: string;
  name: string;
  freelancer: string;
  date: string;
  status: string;
  amount: string;
  isGroupProject?: boolean;
  groupName?: string;
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState("All");
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const storedUser =
          sessionStorage.getItem("umkm_user") ||
          localStorage.getItem("umkm_user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        if (!user.email) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/umkm/projects?email=${user.email}`);
        const data = await res.json();

        if (data.success) {
          setProjectsData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
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

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-(--secondary)" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="mb-2">No projects found.</p>
            <p className="text-sm">Start by posting a new project!</p>
          </div>
        ) : (
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
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${project.isGroupProject ? 'bg-blue-100 text-blue-600' : 'bg-(--secondary)/20 text-(--secondary)'}`}>
                          {project.isGroupProject ? <Users className="w-3 h-3" /> : project.freelancer.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600 font-medium">
                            {project.freelancer}
                          </span>
                          {project.isGroupProject && (
                            <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" />
                              Team Project
                            </span>
                          )}
                        </div>
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
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
