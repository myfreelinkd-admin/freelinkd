"use client";

import {
  X,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Filter,
} from "lucide-react";

interface ProjectModalsProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableJobs = [
  {
    id: 1,
    title: "Senior UI/UX Designer for Fintech App",
    client: "Global Finance Corp",
    location: "Remote",
    budget: "Rp 15.000.000 - 25.000.000",
    posted: "2 hours ago",
    tags: ["Figma", "Fintech", "Mobile Design"],
  },
  {
    id: 2,
    title: "React Developer for E-commerce Platform",
    client: "Sagawa Retail",
    location: "Jakarta, ID",
    budget: "Rp 10.000.000 - 18.000.000",
    posted: "5 hours ago",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    id: 3,
    title: "Fullstack Engineer (Node.js & React)",
    client: "TechFlow Solutions",
    location: "Remote",
    budget: "Rp 20.000.000 - 35.000.000",
    posted: "1 day ago",
    tags: ["Node.js", "PostgreSQL", "React"],
  },
  {
    id: 4,
    title: "Graphic Designer for Branding Project",
    client: "Creative Studio",
    location: "Bandung, ID",
    budget: "Rp 5.000.000 - 8.000.000",
    posted: "3 days ago",
    tags: ["Illustrator", "Branding", "Logo"],
  },
];

export default function ProjectModals({ isOpen, onClose }: ProjectModalsProps) {
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
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-(--secondary) outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-(--primary) hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {availableJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-4xl border border-gray-100 bg-white hover:border-(--secondary)/30 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.posted}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-(--primary) group-hover:text-(--secondary) transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-500 mt-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {job.client}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <MapPin className="w-4 h-4 text-(--secondary)" />{" "}
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <DollarSign className="w-4 h-4 text-(--secondary)" />{" "}
                      {job.budget}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-[10px] font-bold border border-gray-100"
                      >
                        {tag}
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
        <div className="p-6 border-t border-gray-100 bg-white text-center">
          <p className="text-xs text-gray-400">
            Showing 4 of 128 available projects.{" "}
            <span className="text-(--secondary) font-bold cursor-pointer hover:underline">
              Load more
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
