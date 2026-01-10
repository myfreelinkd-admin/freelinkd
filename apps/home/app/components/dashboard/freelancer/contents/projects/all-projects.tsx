import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  DollarSign,
  Calendar,
} from "lucide-react";
import ProjectActionButton from "./ui/action-button";
import ProjectDetailModal from "./ux/modals-detail";

interface Project {
  id: string;
  name: string;
  client: string;
  clientEmail?: string;
  date: string;
  amount: string;
  status: string;
  progress: number;
  description?: string;
  assignedDate?: string;
  deadlineDuration?: string;
  rating?: number;
}

export default function AllProjects({ filter }: { filter?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
        const storedUser = storage.getItem("freelancer_user");
        let queryParams = "";
        
        if (storedUser) {
           const parsedUser = JSON.parse(storedUser);
           if (parsedUser.id) {
             queryParams += `?freelancerId=${parsedUser.id}`;
           }
        }
        
        // Add filter if provided (e.g. from parent tab if strict, but this component receives filter prop)
        // Actually this component filters locally in the original code. 
        // But better to filter on API if the list is huge. 
        // Original code: const filteredProjects = filter ? ... : ...
        // If I use the general API, I can pass status.
        // However, "All Projects" tab usually expects everything. `filter` prop is passed likely by parent tabs?
        // Let's stick to local filtering if the API returns all, OR pass status if filter is set.
        // But wait, if I want "Process" only for "Process" projects, I should call API with status=Process.
        // If `filter` is passed, I'll use it in query.
        
        if (filter) {
            queryParams += queryParams ? `&status=${filter}` : `?status=${filter}`;
        }

        const response = await fetch(`/api/freelancer/projects${queryParams}`);
        if (response.ok) {
           const data = await response.json();
           if (data.success) {
             setProjects(data.data);
           }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filter]);

  const getStatusStyle = (status: string) => {
    // Navigate case insensitivity or standard values
    const s = status.toLowerCase();
    if (s === "complete" || s === "completed") return "bg-green-500/10 text-green-600 border-green-200";
    if (s === "process" || s === "in progress") return "bg-blue-500/10 text-blue-600 border-blue-200";
    if (s === "canceled" || s === "cancelled") return "bg-red-500/10 text-red-600 border-red-200";
    return "bg-gray-500/10 text-gray-600 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "complete" || s === "completed") return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
    if (s === "process" || s === "in progress") return <Activity className="w-3 h-3 mr-1.5" />;
    if (s === "canceled" || s === "cancelled") return <XCircle className="w-3 h-3 mr-1.5" />;
    return <Clock className="w-3 h-3 mr-1.5" />;
  };

  const handleOpenDetail = (project: Project) => {
      setSelectedProject(project);
      setIsDetailModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center py-8 text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
             <div className="text-center py-8 text-gray-400">No projects found.</div>
          ) : (
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
              {projects.map((project) => (
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
                    <ProjectActionButton 
                        status={project.status} 
                        // onViewDetails={() => handleOpenDetail(project)} // We can let ActionButton handle it or lift state. 
                        // Since I kept Modals in ActionButton in previous step (simplest rewrite), I pass project prop.
                        project={project}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
      
      {/* Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal 
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            project={{
                name: selectedProject.name,
                status: selectedProject.status,
                client: {
                    name: selectedProject.client,
                    email: selectedProject.clientEmail || "client@example.com"
                },
                budget: selectedProject.amount,
                deadline: {
                    date: selectedProject.date,
                    duration: selectedProject.deadlineDuration || "N/A"
                },
                description: selectedProject.description || "No description provided.",
                assignedDate: selectedProject.assignedDate || "N/A"
            }}
        />
      )}
    </div>
  );
}
