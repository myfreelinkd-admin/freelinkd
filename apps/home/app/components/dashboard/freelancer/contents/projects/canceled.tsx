"use client";

import { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import ProjectActionButton from "./ui/action-button";

interface Project {
  id: string;
  name: string;
  client: string;
  clientEmail?: string;
  date: string; // Used for "Finished" or similar, here we might map "canceledDate" to date or explicit fields
  amount: string;
  reason?: string;
  canceledDate?: string;
  status: string;
    description?: string;
    assignedDate?: string;
    deadlineDuration?: string;
    rating?: number;
}

export default function CanceledProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
        const storedUser = storage.getItem("freelancer_user");
        let queryParams = "?status=Canceled";
        
        if (storedUser) {
           const parsedUser = JSON.parse(storedUser);
           if (parsedUser.id) {
             queryParams += `&freelancerId=${parsedUser.id}`;
           }
        }

        const response = await fetch(`/api/freelancer/projects${queryParams}`);
        if (response.ok) {
           const data = await response.json();
           if (data.success) {
             setProjects(data.data);
           }
        }
      } catch (error) {
        console.error("Failed to fetch canceled projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center py-8 text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
             <div className="text-center py-8 text-gray-400">No canceled projects found.</div>
          ) : (
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
              {projects.map((project) => (
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
                        {project.canceledDate || "N/A"}
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
                      {project.reason || "No reason specified"}
                    </div>
                  </td>
                  <td className="px-4 py-5 bg-red-50/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-red-100 text-right">
                    <ProjectActionButton status="Canceled" project={project} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}
