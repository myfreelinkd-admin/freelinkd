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
  status: "Process" | "Complete" | "Canceled";
}

export default function ProjectActionButton({
  status,
}: ProjectActionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Dummy data based on the image provided
  const dummyProject = {
    name: "UI/UX Design",
    status: status === "Canceled" ? "Cancelled" : status,
    priority: "Normal",
    client: {
      name: "Sagawa Group",
      email: "admin@sagawagroup.id",
    },
    budget: "1.000.000 - 2.000.000",
    deadline: {
      date: "2025-11-12",
      duration: "2 week",
    },
    description: "y", // As seen in the image
    assignedDate: "01 Nov 2025",
    rating: {
      score: 4.8,
      review:
        "Hasil kerja sangat memuaskan! Desain yang dibuat sangat modern dan sesuai dengan brief yang kami berikan. Komunikasi juga sangat lancar. Sangat merekomendasikan freelancer ini untuk proyek UI/UX.",
      date: "12 Nov 2025",
    },
  };

  const getActions = () => {
    switch (status) {
      case "Complete":
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
      default:
        return [
          {
            label: "View Detail",
            icon: <Eye className="w-4 h-4" />,
            color: "text-(--primary)",
            onClick: () => setIsModalOpen(true),
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

      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={dummyProject}
      />

      <ProjectChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        project={dummyProject}
      />

      <ProjectRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        project={dummyProject}
      />
    </>
  );
}
