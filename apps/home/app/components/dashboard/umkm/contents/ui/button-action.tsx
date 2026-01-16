"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, MessageSquarePlus } from "lucide-react";
import ProjectDetailModal from "../ux/modals-detail";
import FeedbackQuestionModal from "../ux/feedback/question";

interface ButtonActionProps {
  projectId: string;
  onRefresh?: () => void;
  status?: string;
  isFirst?: boolean;
  isLast?: boolean;
  totalItems?: number;
}

export default function ButtonAction({
  projectId,
  onRefresh,
  status,
  isFirst = false,
  isLast = false,
  totalItems = 0,
}: ButtonActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchProjectDetail = async (openFeedback = false) => {
    setLoading(true);
    if (openFeedback) {
      setIsFeedbackOpen(true);
    } else {
      setIsDetailOpen(true);
    }
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

  const handleRateClick = () => {
    fetchProjectDetail(true);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCompleted =
    status === "Completed" ||
    status === "Done" ||
    status === "completed" ||
    status === "done";

  // Determine mode - consistent with button-projects.tsx logic
  const isHorizontalMode =
    totalItems === 1 || isLast || (totalItems === 3 && !isFirst && !isLast);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100 cursor-pointer ${
            isOpen ? "bg-white text-(--primary) border-gray-100" : ""
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {isOpen && (
          <div
            className={`absolute z-50 ${
              isHorizontalMode
                ? "right-full top-1/2 -translate-y-1/2 mr-1"
                : "right-0 top-full mt-2"
            }`}
          >
            {isHorizontalMode ? (
              // Horizontal Icon Menu
              <div className="flex items-center bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] p-1 animate-in fade-in zoom-in-95 slide-in-from-right-2 duration-200 origin-right">
                <IconButton
                  icon={<Eye className="w-5 h-5" />}
                  onClick={() => fetchProjectDetail(false)}
                  label="View Details"
                />

                {isCompleted && (
                  <>
                    <div className="w-px h-6 bg-gray-100 mx-0.5"></div>
                    <IconButton
                      icon={<MessageSquarePlus className="w-5 h-5" />}
                      onClick={handleRateClick}
                      label="Give Feedback"
                    />
                  </>
                )}
              </div>
            ) : (
              // Vertical Text Menu
              <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden min-w-42.5 animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200">
                <TextButton
                  label="View Details"
                  onClick={() => fetchProjectDetail(false)}
                  icon={<Eye className="w-4 h-4 mr-2" />}
                />

                {isCompleted && (
                  <>
                    <div className="h-px bg-gray-50 mx-2"></div>
                    <TextButton
                      label="Give Feedback"
                      onClick={handleRateClick}
                      icon={<MessageSquarePlus className="w-4 h-4 mr-2" />}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ProjectDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={projectDetail}
        isLoading={loading}
      />

      <FeedbackQuestionModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        project={projectDetail}
      />
    </>
  );
}

function IconButton({
  icon,
  onClick,
  label,
  isDanger = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  isDanger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
        isDanger
          ? "text-(--primary) hover:text-red-600 hover:bg-red-50"
          : "text-(--primary) hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {icon}
    </button>
  );
}

function TextButton({
  label,
  onClick,
  isDanger = false,
  icon,
}: {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center ${
        isDanger
          ? "text-(--primary) hover:text-red-600 hover:bg-red-50"
          : "text-(--primary) hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
