"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import ProjectDetailModal from "../../projects/ux/modals-detail";
interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  budget: number;
  budgetFrom?: number;
  budgetTo?: number;
  deadline: string;
  duration: string;
  skills: string[];
  category: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProjectModalsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Format budget to Rupiah
function formatBudget(amount: number): string {
  if (!amount || amount === 0) return "Negotiable";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format relative time
function getRelativeTime(dateString: string | null): string {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectModals({ isOpen, onClose }: ProjectModalsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    skills: string | string[];
  } | null>(null);
  const [confirmProject, setConfirmProject] = useState<Project | null>(null);
  const [viewDetailsProject, setViewDetailsProject] = useState<Project | null>(
    null
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  // Get user info on mount
  useEffect(() => {
    try {
      const userStr =
        localStorage.getItem("freelancer_user") ||
        sessionStorage.getItem("freelancer_user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData && userData.id) {
          setUserId(userData.id);
          setUser(userData);
        }
      }
    } catch (e) {
      console.error("Error loading user info", e);
    }
  }, []);

  // Fetch projects from API
  const fetchProjects = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const userParam = userId ? `&userId=${userId}` : "";
        const response = await fetch(
          `/api/freelancer/projects/general?page=${page}&limit=10&sortBy=createdAt&sortOrder=desc${userParam}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        if (data.success) {
          setProjects(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.error || "Failed to fetch projects");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProjects(currentPage);
      setAcceptSuccess(false);
    }
  }, [isOpen, currentPage, fetchProjects]);

  // Filter projects by search query
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.client.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  const handleAcceptClick = (project: Project) => {
    setConfirmProject(project);
  };

  const handleViewDetails = (project: Project) => {
    setViewDetailsProject(project);
  };

  const handleConfirmAccept = async () => {
    if (!confirmProject || !user) return;

    setIsAccepting(true);
    try {
      // Format skills to string if it's an array, or keep as string
      let skillsStr = "";
      if (Array.isArray(user.skills)) {
        skillsStr = user.skills.join(", ");
      } else if (typeof user.skills === "string") {
        skillsStr = user.skills;
      }

      const response = await fetch(
        `/api/freelancer/projects/${confirmProject.id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freelancerId: user.id,
            name: user.name,
            skills: skillsStr,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAcceptSuccess(true);
        // Refresh list after short delay
        setTimeout(() => {
          setConfirmProject(null);
          setAcceptSuccess(false);
          fetchProjects(currentPage);
          onClose(); // Optional: close modal on success
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to accept project");
      }
    } catch (err) {
      console.error("Error accepting project:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to accept project. Please try again."
      );
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-(--primary)">
              Find Your Next Project
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Browse through hundreds of available opportunities.
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
              placeholder="Search by job title, keywords, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-(--secondary) outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-(--primary) hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-(--secondary)" />
              <p className="mt-4 text-sm text-gray-400">Loading projects...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <p className="mt-4 text-sm text-red-500">{error}</p>
              <button
                onClick={() => fetchProjects(currentPage)}
                className="mt-4 px-6 py-2 bg-(--secondary) text-white rounded-xl text-sm font-bold hover:bg-(--secondary)/90 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Briefcase className="w-10 h-10 text-gray-300" />
              <p className="mt-4 text-sm text-gray-400">
                {searchQuery
                  ? "No projects found matching your search."
                  : "No projects available at the moment."}
              </p>
            </div>
          )}

          {/* Project List */}
          {!loading &&
            !error &&
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-4xl border border-gray-100 bg-white hover:border-(--secondary)/30 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {getRelativeTime(project.createdAt)}
                      </span>
                      {project.category && (
                        <span className="px-2 py-0.5 rounded-lg bg-(--secondary)/10 text-(--secondary) text-[10px] font-bold">
                          {project.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-(--primary) group-hover:text-(--secondary) transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {project.client}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <MapPin className="w-4 h-4 text-(--secondary)" />{" "}
                        {project.duration || "Remote"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <DollarSign className="w-4 h-4 text-(--secondary)" />{" "}
                        {formatBudget(project.budget)}
                      </div>
                      {project.deadline && project.deadline !== "N/A" && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Clock className="w-4 h-4 text-(--secondary)" />{" "}
                          Deadline: {project.deadline}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-[10px] font-bold border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-35">
                    <button
                      onClick={() => handleAcceptClick(project)}
                      className="w-full py-3 bg-(--secondary) text-white rounded-2xl text-sm font-bold hover:bg-(--secondary)/90 transition-all shadow-lg shadow-(--secondary)/10 cursor-pointer"
                    >
                      Accept Project
                    </button>
                    <button
                      onClick={() => handleViewDetails(project)}
                      className="w-full py-3 bg-white text-(--primary) border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          {pagination && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                Showing {filteredProjects.length} of {pagination.totalItems}{" "}
                available projects.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={!pagination.hasPrevPage || loading}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-(--primary) hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-xs font-bold text-(--primary)">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="px-4 py-2 bg-(--secondary) text-white rounded-xl text-xs font-bold hover:bg-(--secondary)/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewDetailsProject && (
        <ProjectDetailModal
          isOpen={!!viewDetailsProject}
          onClose={() => setViewDetailsProject(null)}
          project={{
            name: viewDetailsProject.name,
            status: viewDetailsProject.status || "Open",
            client: {
              name: viewDetailsProject.client,
              email: viewDetailsProject.clientEmail,
            },
            budget: formatBudget(viewDetailsProject.budget),
            budgetFrom: viewDetailsProject.budgetFrom,
            budgetTo: viewDetailsProject.budgetTo,
            deadline: {
              date: viewDetailsProject.deadline,
              duration: viewDetailsProject.duration,
            },
            description: viewDetailsProject.description,
            assignedDate: getRelativeTime(viewDetailsProject.createdAt),
            document: null,
          }}
        />
      )}

      {/* Confirmation Modal */}
      {confirmProject && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              !isAccepting && !acceptSuccess && setConfirmProject(null)
            }
          ></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            {acceptSuccess ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Project Accepted!
                </h3>
                <p className="text-gray-500 text-sm">
                  You have successfully accepted the project. Best of luck!
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-(--secondary)/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-(--secondary)" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Accept this Project?
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Are you sure you want to accept "
                    <span className="font-bold text-gray-900">
                      {confirmProject.name}
                    </span>
                    "? This will assign the project to you instantly.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmProject(null)}
                    disabled={isAccepting}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAccept}
                    disabled={isAccepting}
                    className="flex-1 py-3 px-4 bg-(--secondary) text-white font-bold rounded-xl hover:bg-(--secondary)/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      "Confirm Accept"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
