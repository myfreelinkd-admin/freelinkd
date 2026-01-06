"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Activity, X } from "lucide-react";

interface ButtonProjectsProps {
  isFirst: boolean;
  isLast: boolean;
  totalItems: number;
}

export default function ButtonProjects({
  isFirst,
  isLast,
  totalItems,
}: ButtonProjectsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Determine mode
  const isHorizontalMode =
    totalItems === 1 || isLast || (totalItems === 3 && !isFirst && !isLast);

  return (
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
            // Horizontal Icon Menu (Image 2)
            <div className="flex items-center bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] p-1 animate-in fade-in zoom-in-95 slide-in-from-right-2 duration-200 origin-right">
              <IconButton
                icon={<Eye className="w-5 h-5" />}
                onClick={() => setIsOpen(false)}
                label="Detail"
              />
              <div className="w-px h-6 bg-gray-100 mx-0.5"></div>
              <IconButton
                icon={<Activity className="w-5 h-5" />}
                onClick={() => setIsOpen(false)}
                label="Progress"
              />
              <div className="w-px h-6 bg-gray-100 mx-0.5"></div>
              <IconButton
                icon={<X className="w-5 h-5" />}
                onClick={() => setIsOpen(false)}
                label="Cancel"
                isDanger
              />
            </div>
          ) : (
            // Vertical Text Menu (Image 1)
            <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden min-w-42.5 animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200">
              <TextButton
                label="Detail Projects"
                onClick={() => setIsOpen(false)}
              />
              <div className="h-px bg-gray-50 mx-2"></div>
              <TextButton
                label="Mark a Progress"
                onClick={() => setIsOpen(false)}
              />
              <div className="h-px bg-gray-50 mx-2"></div>
              <TextButton
                label="Cancel"
                onClick={() => setIsOpen(false)}
                isDanger
              />
            </div>
          )}
        </div>
      )}
    </div>
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
}: {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-colors duration-200 cursor-pointer ${
        isDanger
          ? "text-(--primary) hover:text-red-600 hover:bg-red-50"
          : "text-(--primary) hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {label}
    </button>
  );
}
