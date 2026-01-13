"use client";

import { useState, useEffect } from "react";
import { DollarSign, Calendar, Star } from "lucide-react";
import ProjectActionButton from "./ui/action-button";

interface Project {
  id: string;
  name: string;
  client: string;
  clientEmail?: string;
  date: string; // Finished date
  amount: string;
  rating?: number;
  review?: string;
  status: string;
  description?: string;
  assignedDate?: string;
  deadlineDuration?: string;
}

export default function CompleteProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storage = localStorage.getItem("freelancer_user")
          ? localStorage
          : sessionStorage;
        const storedUser = storage.getItem("freelancer_user");
        let queryParams = "?status=Complete";

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
        console.error("Failed to fetch completed projects:", error);
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
            <div className="text-center py-8 text-gray-400">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No completed projects found.
            </div>
          ) : (
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
                {projects.map((project) => (
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
                          {project.rating || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5 bg-green-50/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-green-100 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProjectActionButton
                          status="Complete"
                          project={project}
                          projectId={project.id}
                        />
                      </div>
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
