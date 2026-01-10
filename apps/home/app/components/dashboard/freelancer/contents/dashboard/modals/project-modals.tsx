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

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  budget: number;
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
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProjectModals({ isOpen, onClose }: ProjectModalsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects from API
  const fetchProjects = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/freelancer/projects/general?page=${page}&limit=10&sortBy=createdAt&sortOrder=desc`
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
  }, []);

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProjects(currentPage);
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
                        <Clock className="w-3 h-3" /> {getRelativeTime(project.createdAt)}
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
                    <button className="w-full py-3 bg-(--secondary) text-white rounded-2xl text-sm font-bold hover:bg-(--secondary)/90 transition-all shadow-lg shadow-(--secondary)/10 cursor-pointer">
                      Accept Project
                    </button>
                    <button className="w-full py-3 bg-white text-(--primary) border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all cursor-pointer">
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
                Showing {filteredProjects.length} of {pagination.totalItems} available projects.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
    </div>
  );
}
