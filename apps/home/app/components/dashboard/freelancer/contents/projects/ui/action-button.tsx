"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  XCircle,
  Star,
  ExternalLink,
  MessageCircle,
  Trash2,
  Users,
  TrendingUp,
  Send,
} from "lucide-react";
import Tooltip from "./tooltip";
import ProjectDetailModal from "../ux/modals-detail";
import ProjectChatModal from "../ux/modals-chat";
import ProjectRatingModal from "../ux/modals-rating";
import TransferProjectModal from "../ux/modals-transfer";
import SubmitAssignmentModal from "./submit";

interface ProjectActionButtonProps {
  status: string;
  onViewDetails?: () => void;
  project?: any;
  projectId?: string;
  userId?: string;
}

export default function ProjectActionButton({
  status,
  onViewDetails,
  project,
  projectId,
  userId,
}: ProjectActionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [freelancerId, setFreelancerId] = useState<string>("");

  // Get freelancer ID from storage
  useEffect(() => {
    const storage = localStorage.getItem("freelancer_user")
      ? localStorage
      : sessionStorage;
    const storedUser = storage.getItem("freelancer_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFreelancerId(parsedUser.id || "");
    }
  }, []);

  const mappedProject = project
    ? {
        name: project.name,
        status: status === "Canceled" ? "Cancelled" : status,
        priority: "Normal",
        client: {
          name: project.client,
          email: project.clientEmail || "client@example.com",
        },
        budget: project.amount,
        deadline: {
          date: project.date,
          duration: project.deadlineDuration || "N/A",
        },
        description: project.description || "No description",
        assignedDate: project.assignedDate || "N/A",
        rating: project.rating
          ? {
              score: project.rating,
              review: project.review || "No review",
              date: "N/A",
            }
          : undefined,
      }
    : undefined;

  const handleOpenDetail = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAddProgress = async () => {
    if (!project) return;

    const currentProgress =
      typeof project.progress === "number"
        ? project.progress
        : Number(project.progress || 0);

    if (currentProgress >= 100) return;

    const newProgress = Math.min(currentProgress + 10, 100);

    try {
      const res = await fetch(
        `/api/freelancer/projects/${projectId || project.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress: newProgress }),
        }
      );
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error("Error updating progress", e);
    }
  };

  const getActions = () => {
    switch (status) {
      case "Complete":
      case "Completed":
      case "completed":
        return [
          {
            label: "View Submission",
            icon: <Eye className="w-4 h-4" />,
            color: "text-green-600",
            onClick: () => setIsSubmitModalOpen(true),
            tooltipPosition: "top" as const,
            tooltipAlign: "start" as const,
          },
          {
            label: "View Project Details",
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
            onClick: () => {},
            tooltipPosition: "top" as const,
            tooltipAlign: "end" as const,
          },
        ];
      case "Process":
      case "In Progress":
      default:
        const currentProgress =
          typeof project?.progress === "number"
            ? project.progress
            : Number(project?.progress || 0);

        const primaryAction =
          currentProgress >= 100
            ? {
                label: "Submit Assignment",
                icon: <Send className="w-4 h-4" />,
                color: "text-green-600",
                onClick: () => setIsSubmitModalOpen(true),
                tooltipPosition: "top" as const,
                tooltipAlign: "center" as const,
              }
            : {
                label: "Add Progress",
                icon: <TrendingUp className="w-4 h-4" />,
                color: "text-purple-600",
                onClick: handleAddProgress,
                tooltipPosition: "top" as const,
                tooltipAlign: "start" as const,
              };

        return [
          primaryAction,
          {
            label: "View Detail",
            icon: <Eye className="w-4 h-4" />,
            color: "text-(--primary)",
            onClick: handleOpenDetail,
            tooltipPosition: "top" as const,
            tooltipAlign: "center" as const,
          },
          {
            label: "Transfer to Group",
            icon: <Users className="w-4 h-4" />,
            color: "text-blue-600",
            onClick: () => setIsTransferModalOpen(true),
            tooltipPosition: "top" as const,
            tooltipAlign: "center" as const,
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
            onClick: () => {},
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
        projectId={projectId || project?.id || "unknown"}
        userId={userId || "unknown"}
        project={
          mappedProject || {
            name: "Project",
            client: { name: "Client", status: "offline" },
          }
        }
      />

      {mappedProject && (
        <ProjectRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          project={mappedProject}
        />
      )}

      {/* Transfer Modal */}
      {project && freelancerId && (
        <TransferProjectModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          project={{
            id: project.id,
            name: project.name,
            client: project.client,
          }}
          freelancerId={freelancerId}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}

      {/* Submit Assignment Modal */}
      {project && (
        <SubmitAssignmentModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          projectId={projectId || project.id}
        />
      )}
    </>
  );
}
