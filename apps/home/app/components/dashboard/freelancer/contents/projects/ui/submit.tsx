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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-4">
            {isReadOnly ? (
              <div className="p-3 bg-green-100 rounded-2xl">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Send className="w-7 h-7 text-blue-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-(--primary)">
                {isReadOnly ? "Submission Completed" : "Submit Assignment"}
              </h2>
              {isReadOnly && projectDetails?.submission?.submittedAt && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  Submitted: {formatDate(projectDetails.submission.submittedAt)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {fetchingDetails ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-3 border-gray-200 border-t-green-500 rounded-full"></div>
            <span className="ml-3 text-gray-500 font-medium">
              Loading details...
            </span>
          </div>
        ) : (
          <div className="overflow-y-auto">
            {/* Project Info Card - Only show in read-only mode */}
            {isReadOnly && projectDetails && (
              <div className="p-6 bg-linear-to-br from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-(--secondary)" />
                  <span className="text-sm font-bold text-(--primary)">
                    Project Information
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-2">
                      <FileText className="w-3.5 h-3.5" />
                      PROJECT NAME
                    </div>
                    <p className="text-sm font-bold text-(--primary)">
                      {projectDetails.name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-2">
                      <User className="w-3.5 h-3.5" />
                      CLIENT
                    </div>
                    <p className="text-sm font-bold text-(--primary)">
                      {projectDetails.client || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      BUDGET RANGE
                    </div>
                    {projectDetails.budgetFrom && projectDetails.budgetTo ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Min:</span>
                          <span className="text-sm font-bold text-green-600">
                            Rp{" "}
                            {Number(projectDetails.budgetFrom).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Max:</span>
                          <span className="text-sm font-bold text-green-600">
                            Rp{" "}
                            {Number(projectDetails.budgetTo).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-green-600">
                        {projectDetails.amount || "N/A"}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      DEADLINE
                    </div>
                    <p className="text-sm font-bold text-(--primary)">
                      {projectDetails.date || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Rating Section */}
                {projectDetails.rating && (
                  <div className="mt-4 bg-linear-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-(--primary)">
                          Client Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (projectDetails.rating || 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-amber-600">
                          {projectDetails.rating}/5
                        </span>
                      </div>
                    </div>
                    {projectDetails.review && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        &ldquo;{projectDetails.review}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Submission Section Header */}
              {isReadOnly && (
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Send className="w-4 h-4 text-(--secondary)" />
                  <span className="text-sm font-bold text-(--primary)">
                    Your Submission
                  </span>
                </div>
              )}

              <div className="space-y-5">
                {/* Link Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-(--secondary)" />
                    Project Link
                  </label>
                  {isReadOnly && link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-5 py-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{link}</span>
                      <ExternalLink className="w-4 h-4 shrink-0 ml-2 group-hover:scale-110 transition-transform" />
                    </a>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-(--secondary) focus:ring-4 focus:ring-(--secondary)/10 outline-none transition-all text-sm font-medium text-(--primary) ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                  )}
                </div>

                {/* Note Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                    <FileText className="w-4 h-4 text-(--secondary)" />
                    Notes
                  </label>
                  <textarea
                    placeholder="Any special instructions or comments..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-(--secondary) focus:ring-4 focus:ring-(--secondary)/10 outline-none transition-all text-sm font-medium min-h-[100px] text-(--primary) resize-none ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                    <Upload className="w-4 h-4 text-(--secondary)" />
                    {isReadOnly
                      ? "Attached File"
                      : "Attach File (PDF, PNG, JPG)"}
                  </label>

                  {isReadOnly && existingFileUrl ? (
                    <a
                      href={existingFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-4 rounded-3xl bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-100 hover:from-purple-100 hover:to-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-xl shadow-sm">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-(--primary)">
                            {fileName}
                          </p>
                          <p className="text-xs text-purple-500 font-medium">
                            Click to view or download
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                        <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-600" />
                      </div>
                    </a>
                  ) : isReadOnly && !existingFileUrl ? (
                    <div className="w-full px-4 py-6 rounded-3xl bg-gray-50 border border-gray-200 text-center">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 font-medium">
                        No file attached
                      </p>
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
                      <div className="w-full px-4 py-8 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 group-hover:border-(--secondary) group-hover:bg-(--secondary)/5 transition-all flex flex-col items-center justify-center text-center">
                        {file ? (
                          <>
                            <FileText className="w-10 h-10 text-(--primary) mb-3" />
                            <span className="text-sm font-bold text-(--primary)">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium mt-1">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-300 mb-3 group-hover:scale-110 group-hover:text-(--secondary) transition-all" />
                            <span className="text-sm text-gray-500 font-bold group-hover:text-(--primary) transition-colors">
                              Click to upload or drag and drop
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

        <div className="p-8 border-t border-gray-100 bg-linear-to-r from-gray-50 to-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-white text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all cursor-pointer border border-gray-200 shadow-sm"
            disabled={loading}
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
