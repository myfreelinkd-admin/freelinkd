"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Send,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  DollarSign,
  Star,
  Briefcase,
  Download,
  Users,
} from "lucide-react";

interface ProjectDetails {
  name?: string;
  client?: string;
  clientEmail?: string;
  amount?: string;
  budgetFrom?: string | number | null;
  budgetTo?: string | number | null;
  date?: string;
  description?: string;
  rating?: number;
  review?: string;
  completedAt?: string;
  submission?: {
    link?: string;
    file?: string;
    fileName?: string;
    note?: string;
    submittedAt?: string;
  } | null;
}

interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess?: () => void;
}

export default function SubmitAssignmentModal({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}: SubmitAssignmentModalProps) {
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );

  useEffect(() => {
    if (isOpen && projectId) {
      setFetchingDetails(true);
      fetch(`/api/freelancer/projects/${projectId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const p = data.data;
            setProjectDetails({
              name: p.name,
              client: p.client,
              clientEmail: p.clientEmail,
              amount: p.amount,
              budgetFrom: p.budgetFrom,
              budgetTo: p.budgetTo,
              date: p.date,
              description: p.description,
              rating: p.rating,
              review: p.review,
              completedAt: p.completedAt,
              submission: p.submission,
            });

            if (p.submission) {
              setLink(p.submission.link || "");
              setNote(p.submission.note || "");
              if (p.submission.file) {
                setExistingFileUrl(p.submission.file);
                setFileName(p.submission.fileName || "Attached File");
              }
            }
            // Check status
            const statusLower = (p.status || "").toLowerCase();
            if (
              statusLower === "done" ||
              statusLower === "completed" ||
              statusLower === "complete"
            ) {
              setIsReadOnly(true);
            } else {
              setIsReadOnly(false);
            }
          }
        })
        .catch((err) => console.error("Error fetching project details:", err))
        .finally(() => setFetchingDetails(false));
    } else {
      // Reset state on close/open new
      setLink("");
      setNote("");
      setFile(null);
      setExistingFileUrl(null);
      setFileName("");
      setIsReadOnly(false);
      setProjectDetails(null);
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!link && !file) {
      alert("Please provide at least a link or a file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      if (link) formData.append("link", link);
      if (note) formData.append("note", note);
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64File = reader.result as string;

          await sendSubmitRequest({
            projectId,
            link,
            note,
            file: base64File,
            fileName: file.name,
          });
        };
        return;
      }

      await sendSubmitRequest({ projectId, link, note });
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment.");
    } finally {
      setLoading(false);
    }
  };

  const sendSubmitRequest = async (data: any) => {
    const res = await fetch(`/api/freelancer/projects/${projectId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload();
    } else {
      alert("Submission failed. Please try again.");
    }
  };

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
              <Send className="w-6 h-6 text-blue-600" />
              {isReadOnly ? "Submission Details" : "Submit Assignment"}
            </h2>
            {isReadOnly && projectDetails?.submission?.submittedAt && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-green-50 text-green-600 border-green-100 flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3 h-3" /> Submitted:{" "}
                {formatDate(projectDetails.submission.submittedAt)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {fetchingDetails ? (
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--primary)"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {/* Project Info Section - Read Only Mode */}
            {isReadOnly && projectDetails && (
              <>
                {/* Header Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Name & Client */}
                  <div className="p-6 bg-gray-50/50 rounded-4xl border border-gray-100 hover:border-(--secondary)/30 transition-all">
                    <div className="flex items-center gap-3 mb-3 text-(--primary)">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Briefcase className="w-4 h-4 text-(--primary)" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                        Project
                      </span>
                    </div>
                    <p className="font-bold text-(--primary) mb-1">
                      {projectDetails.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      {projectDetails.client || "No Client"}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="p-6 bg-gray-50/50 rounded-4xl border border-gray-100 hover:border-(--secondary)/30 transition-all">
                    <div className="flex items-center gap-3 mb-3 text-(--primary)">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                        Budget
                      </span>
                    </div>
                    {projectDetails.budgetFrom && projectDetails.budgetTo ? (
                      <div>
                        <p className="text-sm text-gray-500">Range:</p>
                        <p className="text-sm font-bold text-green-600">
                          {Number(projectDetails.budgetFrom).toLocaleString(
                            "id-ID"
                          )}{" "}
                          -{" "}
                          {Number(projectDetails.budgetTo).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-green-600">
                        {projectDetails.amount || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Deadline Section */}
                <div className="p-6 bg-orange-50/50 rounded-4xl border border-orange-100 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-(--secondary)" />
                    <h3 className="font-bold text-(--primary)">
                      Project Deadline
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-(--primary)">
                      Due Date:
                    </span>
                    <span className="text-sm text-gray-600">
                      {projectDetails.date || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Rating Section (Mirroring modals-detail style) */}
                {projectDetails.rating && (
                  <div className="p-6 bg-amber-50/50 rounded-4xl border border-amber-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      </div>
                      <h3 className="font-bold text-(--primary)">
                        Client Rating
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= (projectDetails.rating || 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-bold text-amber-600">
                          {projectDetails.rating}/5
                        </span>
                      </div>
                      {projectDetails.review && (
                        <p className="text-sm text-gray-600 italic">
                          "{projectDetails.review}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submission Form Section */}
            <div className="p-6 bg-green-50/50 rounded-4xl border border-green-100 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Send className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-(--primary)">
                  {isReadOnly ? "Your Submission" : "Submission Form"}
                </h3>
              </div>

              <div className="space-y-5 relative z-10">
                {/* Link Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                    Project Link
                  </label>
                  {isReadOnly && link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                    >
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="truncate text-sm font-medium text-blue-600">
                        {link}
                      </span>
                    </a>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-3 rounded-2xl bg-white border border-green-200 focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm text-(--primary) placeholder:text-gray-400 ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                  )}
                </div>

                {/* Note Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="Any special instructions or comments..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-4 py-3 rounded-2xl bg-white border border-green-200 focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm min-h-[100px] text-(--primary) resize-none placeholder:text-gray-400 ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                    {isReadOnly ? "Attached File" : "Attach File"}
                  </label>

                  {isReadOnly && existingFileUrl ? (
                    <a
                      href={existingFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-green-100 hover:shadow-md transition-all group"
                    >
                      <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                        <Download className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-(--primary)">
                          {fileName || "Download"}
                        </p>
                        <p className="text-xs text-purple-500 font-medium">
                          Click to download
                        </p>
                      </div>
                    </a>
                  ) : isReadOnly && !existingFileUrl ? (
                    <div className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-gray-200 opacity-60">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-500">
                        No File Attached
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`relative group ${isReadOnly ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        disabled={isReadOnly}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full px-4 py-8 rounded-3xl bg-white border-2 border-dashed border-green-200 group-hover:border-green-400 group-hover:bg-green-50/30 transition-all flex flex-col items-center justify-center text-center">
                        {file ? (
                          <>
                            <FileText className="w-10 h-10 text-green-600 mb-3" />
                            <span className="text-sm font-bold text-(--primary)">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium mt-1">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-300 mb-3 group-hover:scale-110 group-hover:text-green-500 transition-all" />
                            <span className="text-sm text-gray-500 font-bold group-hover:text-green-600 transition-colors">
                              Click to upload or drag & drop
                            </span>
                            <span className="text-xs text-gray-400 mt-1 font-medium">
                              PDF, PNG, JPG up to 5MB
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer"
            disabled={loading}
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-(--secondary) hover:opacity-90 shadow-lg shadow-(--secondary)/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Assignment"}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
