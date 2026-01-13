"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Activity,
  XCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import ProjectDetailModal from "../ux/modals-detail";

interface ButtonActionProps {
  projectId: string;
  onRefresh?: () => void;
  status?: string;
}

export default function ButtonAction({
  projectId,
  onRefresh,
  status,
}: ButtonActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState<any>(null);

  const fetchProjectDetail = async () => {
    setLoading(true);
    setIsDetailOpen(true);
    setIsOpen(false);
    try {
      const res = await fetch(`/api/umkm/projects/${projectId}`);
      const data = await res.json();
      if (data.success) {
        setProjectDetail(data.data);
      } else {
        console.error("Failed to fetch project detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted =
    status === "Completed" ||
    status === "Done" ||
    status === "completed" ||
    status === "done";

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100 cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-1">
                <button
                  onClick={fetchProjectDetail}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-(--primary) hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {isCompleted && (
                  <button
                    onClick={fetchProjectDetail}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4" />
                    Rate Freelancer
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <ProjectDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={projectDetail}
        isLoading={loading}
      />
    </>
  );
}
