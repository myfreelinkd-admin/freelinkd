"use client";

import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export default function Tooltip({
  children,
  content,
  position = "top",
  align = "center",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Position classes
  const posClasses = {
    top: "bottom-full mb-3",
    bottom: "top-full mt-3",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
  };

  // Align classes for top/bottom
  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  // Arrow style based on position
  const getArrowStyle = () => {
    switch (position) {
      case "top":
        return "bottom-[-6px] border-t-white border-x-transparent border-t-[6px]";
      case "bottom":
        return "top-[-6px] border-b-white border-x-transparent border-b-[6px]";
      case "left":
        return "right-[-6px] border-l-white border-y-transparent border-l-[6px] top-1/2 -translate-y-1/2";
      case "right":
        return "left-[-6px] border-r-white border-y-transparent border-r-[6px] top-1/2 -translate-y-1/2";
      default:
        return "";
    }
  };

  // Shadow for arrow
  const getArrowShadow = () => {
    switch (position) {
      case "top":
        return "drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]";
      case "bottom":
        return "drop-shadow-[0_-1px_1px_rgba(0,0,0,0.05)]";
      case "left":
        return "drop-shadow-[1px_0_1px_rgba(0,0,0,0.05)]";
      case "right":
        return "drop-shadow-[-1px_0_1px_rgba(0,0,0,0.05)]";
      default:
        return "";
    }
  };

  const arrowAlignClasses = {
    start: "left-4 translate-x-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-4 translate-x-0",
  };

  return (
    <div
      className="relative flex flex-col items-center group w-fit"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-100 pointer-events-none transition-all duration-200 ease-out animate-in fade-in zoom-in-95 
            ${posClasses[position]} 
            ${
              position === "top" || position === "bottom"
                ? alignClasses[align]
                : ""
            }
          `}
        >
          <div className="relative">
            <div className="bg-white text-(--primary) text-[10px] sm:text-[11px] font-bold px-4 py-2.5 rounded-xl shadow-[0_10px_30px_-5px_rgba(8,31,92,0.15),0_8px_10px_-6px_rgba(8,31,92,0.1)] border border-gray-100 whitespace-nowrap overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-transparent to-blue-50/30"></div>
              <span className="relative z-10">{content}</span>
            </div>

            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-x-[6px] 
                ${getArrowStyle()} 
                ${getArrowShadow()}
                ${
                  position === "top" || position === "bottom"
                    ? arrowAlignClasses[align]
                    : ""
                }
              `}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
