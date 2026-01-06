"use client";

import React from "react";
import {
  X,
  Calendar,
  FileText,
  Briefcase,
  TrendingUp,
  User,
  DollarSign,
  Clock,
} from "lucide-react";
import Tooltip from "../ui/tooltip";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    name: string;
    status: string;
    client: {
      name: string;
      email: string;
    };
    budget: string;
    deadline: {
      date: string;
      duration: string;
    };
    description: string;
    assignedDate: string;
  };
}

export default function ProjectDetailModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-(--primary) flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-(--secondary)" />
              {project.name}
            </h2>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  project.status.toLowerCase() === "cancelled"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* Client & Budget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50/50 rounded-4xl border border-gray-100 hover:border-(--secondary)/30 transition-all">
              <div className="flex items-center gap-3 mb-3 text-(--primary)">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-4 h-4 text-(--primary)" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Client
                </span>
              </div>
              <p className="font-bold text-(--primary)">
                {project.client.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {project.client.email}
              </p>
            </div>

            <div className="p-6 bg-gray-50/50 rounded-4xl border border-gray-100 hover:border-(--secondary)/30 transition-all">
              <div className="flex items-center gap-3 mb-3 text-(--primary)">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Budget
                </span>
              </div>
              <p className="text-lg font-bold text-green-600">
                {project.budget}
              </p>
            </div>
          </div>

          {/* Deadline Section */}
          <div className="p-6 bg-orange-50/50 rounded-4xl border border-orange-100 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-(--secondary)" />
              <h3 className="font-bold text-(--primary)">Project Deadline</h3>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-(--primary)">
                  Date:
                </span>
                <span className="text-sm text-gray-600">
                  {project.deadline.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-(--primary)">
                  Time:
                </span>
                <span className="text-sm text-gray-600">
                  {project.deadline.duration}
                </span>
              </div>
              <p className="text-xs text-(--secondary) font-medium mt-2 italic">
                Please complete this project within the specified timeframe
              </p>
            </div>
            {/* Decorative background icon */}
            <Calendar className="absolute -right-2.5 -bottom-2.5 w-24 h-24 text-(--secondary) opacity-5 rotate-12" />
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-(--primary)">
              <FileText className="w-5 h-5 text-(--primary)" />
              <h3 className="font-bold">Job Description</h3>
            </div>
            <div className="p-6 bg-gray-50/50 rounded-4xl text-sm text-gray-600 leading-relaxed border border-gray-100">
              {project.description}
            </div>
          </div>

          {/* Assigned Date */}
          <div className="p-5 bg-blue-50/50 rounded-3xl flex items-center gap-4 border border-blue-100/50">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                Assigned Date
              </span>
              <span className="text-sm font-bold text-(--primary)">
                {project.assignedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-3">
          {project.status === "Process" && (
            <Tooltip content="Update Progress" position="top">
              <button className="p-3.5 bg-(--primary) text-white rounded-2xl font-bold text-sm hover:bg-blue-900 transition-all shadow-lg shadow-blue-200 flex items-center justify-center cursor-pointer">
                <TrendingUp className="w-5 h-5" />
              </button>
            </Tooltip>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-(--secondary) text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-(--secondary)/20 cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
