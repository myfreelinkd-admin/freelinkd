"use client";

import React from "react";
import { X, Star, Quote, Award } from "lucide-react";

interface ProjectRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    name: string;
    client: {
      name: string;
      email?: string;
    };
    rating?: {
      score: number;
      review: string;
      date: string;
    };
  };
}

export default function ProjectRatingModal({
  isOpen,
  onClose,
  project,
}: ProjectRatingModalProps) {
  if (!isOpen || !project || !project.rating) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 pb-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-(--primary) flex items-center gap-2">
              <Award className="w-6 h-6 text-(--secondary)" />
              Client Feedback
            </h2>
            <p className="text-sm text-gray-500">
              Rating for{" "}
              <span className="font-semibold text-(--primary)">
                {project.name}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 custom-scrollbar">
          {/* Score Section */}
          <div className="flex flex-col items-center justify-center py-8 bg-amber-50/50 rounded-4xl border border-amber-100 relative overflow-hidden">
            <div className="text-6xl font-black text-amber-400 mb-2 tracking-tighter drop-shadow-sm">
              {project.rating.score.toFixed(1)}
            </div>
            <div className="flex gap-1.5 mb-3 relative z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${star <= project.rating!.score ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-amber-100">
              {project.rating.score >= 4.5
                ? "Excellent Work!"
                : project.rating.score >= 4
                  ? "Great Job!"
                  : "Good Work"}
            </p>

            {/* Decorative */}
            <Star className="absolute -left-6 -bottom-6 w-32 h-32 text-amber-400 opacity-10 rotate-12" />
            <Star className="absolute -right-6 -top-6 w-24 h-24 text-amber-400 opacity-10 -rotate-12" />
          </div>

          {/* Review Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-4 px-2">
              <div className="w-14 h-14 rounded-full bg-(--primary) flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 border-2 border-white">
                {project.client.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-(--primary) text-lg">
                  {project.client.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    UMKM
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    • {project.rating.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative pt-2">
              <Quote className="absolute -top-1 left-4 w-8 h-8 text-(--secondary) opacity-20 rotate-180" />
              <div className="p-6 bg-gray-50 rounded-4xl text-gray-600 leading-relaxed border border-gray-100 italic relative z-10 text-sm">
                &quot;{project.rating.review}&quot;
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 border-t border-gray-100 bg-white flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-(--primary) text-white rounded-2xl font-bold text-sm hover:bg-blue-900 transition-all shadow-lg shadow-blue-200 cursor-pointer"
          >
            Close Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
