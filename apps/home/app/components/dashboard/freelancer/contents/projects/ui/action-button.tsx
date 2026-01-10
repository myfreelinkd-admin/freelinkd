"use client";

import { useState } from "react";
import {
  Eye,
  XCircle,
  Star,
  ExternalLink,
  MessageCircle,
  Trash2,
} from "lucide-react";
import Tooltip from "./tooltip";
import ProjectDetailModal from "../ux/modals-detail";
import ProjectChatModal from "../ux/modals-chat";
import ProjectRatingModal from "../ux/modals-rating";

interface ProjectActionButtonProps {
  status: string;
  onViewDetails?: () => void;
  // We can pass project data in if we want to handle modals here, 
  // but if we lift state up to AllProjects, we might just use callbacks.
  // However, ActionButton currently renders the Modals.
  // We should modify ActionButton to accept 'project' prop and use it in modals.
  project?: any; 
}

export default function ProjectActionButton({
  status,
  onViewDetails,
  project
}: ProjectActionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Use passed project or fallback (though fallback shouldn't be needed with real data)
  // Maps API data to Modal expected format
  const mappedProject = project ? {
    name: project.name,
    status: status === "Canceled" ? "Cancelled" : status, // Modal matches "Cancelled"
    priority: "Normal", // API doesn't have it yet, default
    client: {
      name: project.client,
      email: project.clientEmail || "client@example.com",
    },
    budget: project.amount,
    deadline: {
      date: project.date, // or deadline
      duration: project.deadlineDuration || "N/A",
    },
    description: project.description || "No description",
    assignedDate: project.assignedDate || "N/A",
    rating: project.rating ? {
       score: project.rating,
       review: project.review || "No review",
       date: "N/A" // Date of review not in project list usually
    } : undefined
  } : undefined;

  const handleOpenDetail = () => {
    if (onViewDetails) {
        onViewDetails();
    } else {
        setIsModalOpen(true);
    }
  };

  const getActions = () => {
    switch (status) {
      case "Complete":
      case "Completed":
        return [
          {
            label: "View Project",
            icon: <ExternalLink className="w-4 h-4" />,
            color: "text-(--primary)",
            onClick: () => setIsModalOpen(true),
            tooltipPosition: "top" as const,
            tooltipAlign: "center" as const,
          },
          {
            label: "View Rating",
            icon: <Star className="w-4 h-4" />,
            color: "text-amber-500",
            onClick: () => setIsRatingModalOpen(true),
            tooltipPosition: "top" as const,
            tooltipAlign: "end" as const,
          },
        ];
      case "Canceled":
      case "Cancelled":
        return [
          {
            label: "Chat with UMKM",
            icon: <MessageCircle className="w-4 h-4" />,
            color: "text-green-600",
            onClick: () => setIsChatModalOpen(true),
            tooltipPosition: "top" as const,
            tooltipAlign: "center" as const,
          },
          {
            label: "Delete Project",
            icon: <Trash2 className="w-4 h-4" />,
            color: "text-red-600",
            tooltipPosition: "top" as const,
            tooltipAlign: "end" as const,
          },
        ];
      case "Process":
      case "In Progress":
      default:
        return [
          {
            label: "View Detail",
            icon: <Eye className="w-4 h-4" />,
            color: "text-(--primary)",
            onClick: handleOpenDetail, // Use callback if provided, else local modal
            tooltipPosition: "bottom" as const,
            tooltipAlign: "start" as const,
          },
          {
            label: "Chat with UMKM",
            icon: <MessageCircle className="w-4 h-4" />,
            color: "text-green-600",
            onClick: () => setIsChatModalOpen(true),
            tooltipPosition: "top" as const,
            tooltipAlign: "center" as const,
          },
          {
            label: "Cancel Project",
            icon: <XCircle className="w-4 h-4" />,
            color: "text-red-600",
            tooltipPosition: "top" as const,
            tooltipAlign: "end" as const,
          },
        ];
    }
  };

  const actions = getActions();

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {actions.map((action, index) => (
          <Tooltip
            key={index}
            content={action.label}
            position={action.tooltipPosition}
            align={action.tooltipAlign}
          >
            <button
              onClick={action.onClick}
              className="p-2.5 bg-white hover:bg-gray-50 text-(--primary) rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            >
              <div
                className={`transition-transform group-hover:scale-110 ${action.color}`}
              >
                {action.icon}
              </div>
            </button>
          </Tooltip>
        ))}
      </div>

      {mappedProject && (
      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={mappedProject}
      />
      )}

      {/* Chat modal logic if needed */}
       <ProjectChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        project={mappedProject || { 
            name: "Project", 
            client: { name: "Client", status: "offline" } 
        }}
      /> 

      {mappedProject && (
      <ProjectRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        project={mappedProject}
      />
      )}
    </>
  );
}
