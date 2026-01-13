"use client";

import React, { useState, useEffect, ReactNode } from "react";
import {
  X,
  Calendar,
  FileText,
  Briefcase,
  TrendingUp,
  User,
  DollarSign,
  Clock,
  Download,
  ExternalLink,
  CheckCircle2,
  Star,
  Users,
} from "lucide-react";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  project?: {
    amount: ReactNode;
    id: string;
    name: string;
    status: string;
    freelancer: string;
    freelancerId: string;
    isGroupProject?: boolean;
    groupName?: string;
    budget: string;
    budgetFrom?: string | number | null;
    budgetTo?: string | number | null;
    deadlineDuration: string;
    date: string;
    description: string;
    assignedDate: string;
    completedAt?: string | null;
    uploadDocument?: string | null;
    rating?: number | null;
    review?: string;
    submission?: {
      link: string;
      file: string;
      fileName: string;
      note: string;
      submittedAt: string;
    } | null;
  };
}

export default function ProjectDetailModal({
  isOpen,
  onClose,
  project,
  isLoading,
}: ProjectDetailModalProps) {
  const [ratingVal, setRatingVal] = useState(0);
  const [reviewVal, setReviewVal] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  useEffect(() => {
    if (project?.rating) {
      setRatingVal(project.rating);
    }
    if (project?.review) {
      setReviewVal(project.review);
    }
  }, [project]);

  const handleRate = async () => {
    if (!project || ratingVal === 0) return;

    setIsSubmittingRating(true);
    try {
      const res = await fetch(`/api/umkm/projects/${project.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: ratingVal,
          review: reviewVal,
        }),
      });

      if (res.ok) {
        setShowRatingSuccess(true);
        // Ideally trigger refresh of parent or update local status,
        // but showing success and sticking is fine for now.
      } else {
        alert("Failed to submit rating");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (!isOpen) return null;

  const isCompleted =
    project?.status === "Completed" ||
    project?.status === "Done" ||
    project?.status === "completed" ||
    project?.status === "done";
  const hasRated = !!project?.rating || showRatingSuccess;

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
              {project?.name || "Loading..."}
            </h2>
            {project && (
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    project.status === "Canceled"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}
                >
                  {project.status}
                </span>
                {project.submission && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-green-50 text-green-600 border-green-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Submitted
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading || !project ? (
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--primary)"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {/* Rating Section - Only if Completed */}
            {isCompleted && (
              <div className="p-6 bg-amber-50/50 rounded-4xl border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <h3 className="font-bold text-(--primary)">
                    {hasRated ? "Freelancer Rating" : "Rate Freelancer"}
                  </h3>
                </div>

                {hasRated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${star <= ratingVal ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                      <span className="ml-2 font-bold text-amber-600">
                        {ratingVal}/5
                      </span>
                    </div>
                    {reviewVal && (
                      <p className="text-sm text-gray-600 italic">
                        "{reviewVal}"
                      </p>
                    )}
                    {showRatingSuccess && (
                      <p className="text-xs font-bold text-green-600 mt-2">
                        Rating submitted successfully!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRatingVal(star)}
                          className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= ratingVal ? "text-amber-400 fill-amber-400" : "text-gray-300 hover:text-amber-200"}`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewVal}
                      onChange={(e) => setReviewVal(e.target.value)}
                      placeholder="Write a review for the freelancer's work..."
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-amber-100 focus:border-amber-300 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm min-h-[80px]"
                    />

                    <button
                      onClick={handleRate}
                      disabled={ratingVal === 0 || isSubmittingRating}
                      className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-200 cursor-pointer"
                    >
                      {isSubmittingRating ? "Submitting..." : "Submit Rating"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submission Section - Highlight if exists */}
            {project.submission && (
              <div className="p-6 bg-green-50/50 rounded-4xl border border-green-100 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-(--primary)">
                    Project Submission
                  </h3>
                </div>

                <div className="space-y-4 relative z-10">
                  {project.submission.note && (
                    <div className="p-4 bg-white/60 rounded-2xl border border-green-100 shadow-sm">
                      <p className="text-xs font-bold text-green-700 uppercase mb-1">
                        Freelancer Notes
                      </p>
                      <p className="text-sm text-gray-700">
                        {project.submission.note}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.submission.link && (
                      <a
                        href={project.submission.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-green-100 hover:shadow-md transition-all group"
                      >
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <ExternalLink className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-(--primary)">
                            Project Link
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {project.submission.link}
                          </p>
                        </div>
                      </a>
                    )}

                    {project.submission.file ? (
                      <a
                        href={project.submission.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-green-100 hover:shadow-md transition-all group"
                      >
                        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                          <Download className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-(--primary)">
                            Attached File
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {project.submission.fileName || "Download File"}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 opacity-60">
                        <div className="p-2 bg-gray-200 rounded-lg">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-500">
                            No File
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Clock className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Submitted on:{" "}
                      {new Date(
                        project.submission.submittedAt || ""
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Freelancer & Budget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50/50 rounded-4xl border border-gray-100 hover:border-(--secondary)/30 transition-all">
                <div className="flex items-center gap-3 mb-3 text-(--primary)">
                  <div
                    className={`p-2 rounded-lg shadow-sm ${project.isGroupProject ? "bg-blue-50" : "bg-white"}`}
                  >
                    {project.isGroupProject ? (
                      <Users className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-(--primary)" />
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                    Freelancer
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-(--primary)">
                    {project.freelancer || "Not assigned"}
                  </p>
                  {project.isGroupProject && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold w-fit">
                      <Users className="w-3 h-3" />
                      Team Project
                    </span>
                  )}
                  {project.freelancerId && (
                    <p className="text-xs text-gray-400">
                      ID: {project.freelancerId.substring(0, 8)}...
                    </p>
                  )}
                </div>
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
                  {project.amount}
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
                  <span className="text-sm text-gray-600">{project.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-(--primary)">
                    Duration:
                  </span>
                  <span className="text-sm text-gray-600">
                    {project.deadlineDuration}
                  </span>
                </div>
              </div>
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

            {/* Document Section (UMKM's Upload) */}
            <div className="p-5 bg-purple-50/50 rounded-3xl flex items-center justify-between border border-purple-100/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
                    Your Document
                  </span>
                  <span className="text-sm font-bold text-(--primary) truncate max-w-[200px] block">
                    {project.uploadDocument ? "View Document" : "No Document"}
                  </span>
                </div>
              </div>
              {project.uploadDocument ? (
                <a
                  href={project.uploadDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-purple-600 font-bold text-xs rounded-xl shadow-sm hover:bg-purple-600 hover:text-white transition-all border border-purple-100"
                >
                  Open
                </a>
              ) : (
                <span className="text-xs text-gray-400 italic px-2">
                  Not Available
                </span>
              )}
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
        )}

        {/* Footer Action */}
        <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-3">
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
