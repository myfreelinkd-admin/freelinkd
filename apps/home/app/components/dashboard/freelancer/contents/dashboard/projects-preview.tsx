"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Layout, CheckCircle2 } from "lucide-react";
import ButtonProjects from "./ui/button-projects";

interface Project {
  id: string | number;
  name: string;
  client: string;
  deadline: string;
  progress: number;
  status: string;
}

export default function ProjectsPreview() {
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
        const storedUser = storage.getItem("freelancer_user");
        let queryParams = "";
        
        if (storedUser) {
           const parsedUser = JSON.parse(storedUser);
           if (parsedUser.id) {
             // Pass freelancerId if your backend logic supports/needs it
             // Current backend implementation check for it.
             // We can also just fetch all 'process' if that is the strict requirement regardless of user
             queryParams = `?freelancerId=${parsedUser.id}`;
           }
        }

        const response = await fetch(`/api/freelancer/projects/process${queryParams}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOngoingProjects(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-(--primary) flex items-center gap-2">
              <Layout className="w-5 h-5 text-(--secondary)" /> Process Projects
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Track your current work progress and upcoming deadlines.
            </p>
          </div>
          <Link href="/freelancer/projects" className="text-sm font-bold text-(--secondary) hover:underline cursor-pointer">
            View All Projects
          </Link>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center py-8 text-gray-400">Loading projects...</div>
          ) : ongoingProjects.length === 0 ? (
             <div className="text-center py-8 text-gray-400">No projects in process.</div>
          ) : (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-4 pb-2">Project Details</th>
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
                      <div className="w-6 h-6 rounded-full bg-(--primary)/10 flex items-center justify-center text-[10px] font-bold text-(--primary)">
                        {project.client.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {project.client}
                      </span>
                    </div>
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
                    <ButtonProjects
                      isFirst={project.id === ongoingProjects[0].id}
                      isLast={
                        project.id ===
                        ongoingProjects[ongoingProjects.length - 1].id
                      }
                      totalItems={ongoingProjects.length}
                    />
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
