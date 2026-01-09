"use client";

import { Eye, Trash2, Edit } from "lucide-react";
import Tooltip from "./tooltip";

interface ProjectActionButtonProps {
  status?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ProjectActionButton({
  status,
  onView,
  onEdit,
  onDelete,
}: ProjectActionButtonProps) {
  const actions = [
    {
      label: "View Detail",
      icon: <Eye className="w-4 h-4" />,
      color: "text-(--primary)",
      onClick: onView,
      tooltipPosition: "top" as const,
      tooltipAlign: "center" as const,
    },
    {
      label: "Manage / Edit",
      icon: <Edit className="w-4 h-4" />,
      color: "text-green-600",
      onClick: onEdit,
      tooltipPosition: "top" as const,
      tooltipAlign: "center" as const,
      condition: status !== "Canceled", // Example condition
    },
    {
      label: "Delete Project",
      icon: <Trash2 className="w-4 h-4" />,
      color: "text-red-600",
      onClick: onDelete,
      tooltipPosition: "top" as const,
      tooltipAlign: "end" as const,
    },
  ];

  return (
    <div className="flex items-center justify-end gap-2">
      {actions.map((action, index) => {
        if (action.condition === false) return null;
        
        return (
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
        );
      })}
    </div>
  );
}
