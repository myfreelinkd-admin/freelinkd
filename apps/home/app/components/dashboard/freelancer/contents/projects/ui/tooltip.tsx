"use client";

import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div className="absolute top-full mt-2 flex flex-col items-center z-60 transition-all duration-200 ease-out animate-[fadeIn_0.2s_ease-out]">
          {/* Arrow at the top */}
          <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-6px border-b-white drop-shadow-[0_-1px_1px_rgba(0,0,0,0.05)]"></div>

          <div className="bg-white text-(--primary) text-[11px] font-bold px-4 py-2 rounded-xl shadow-[0_10px_30px_-5px_rgba(8,31,92,0.15),0_8px_10px_-6px_rgba(8,31,92,0.1)] border border-gray-100 whitespace-nowrap -mt-1px transform transition-transform duration-200">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
