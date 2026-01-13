"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/button";
import { sanitizeInput } from "../../utils/sanitize";

interface ProfesionalInfoData {
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
  resume?: File | null;
}

interface ProfesionalInfoProps {
  formData: Partial<ProfesionalInfoData>;
  updateFormData: (newData: Partial<ProfesionalInfoData>) => void;
  onNext?: () => void;
}

export default function ProfesionalInfo({
  formData,
  updateFormData,
  onNext,
}: ProfesionalInfoProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    updateFormData({ [name]: sanitizeInput(value) });
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.");
      return;
    }
    updateFormData({ resume: file });
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFile(f);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
  };

  const removeFile = () => {
    updateFormData({ resume: null });
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 md:py-12 px-2 md:px-4">
      <section>
        <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
          Professional Information
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">
              Skills & Expertise
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
              placeholder="e.g. UI/UX, React, Figma"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Professional Experience
            </label>
            <textarea
              name="professionalExperience"
              value={formData.professionalExperience || ""}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 resize-y text-sm md:text-base"
              placeholder="Describe your past roles, durations, and accomplishments"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Portfolio / Website URL
            </label>
            <input
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
              placeholder="https://your-portfolio.example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-4">
              Resume / CV Upload
            </label>
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative group transition-all duration-300 ease-in-out border-2 border-dashed rounded-3xl md:rounded-4xl p-6 md:p-10 text-center flex flex-col items-center justify-center bg-[#f8faff] ${
                  isDragging
                    ? "border-[#ff6f00] bg-[#fff4ed] scale-[1.01]"
                    : "border-gray-300 hover:border-[#081f5c] hover:bg-[#f0f4ff]"
                }`}
              >
                <input
                  type="file"
                  name="resume"
                  onChange={onFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#081f5c] rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900">
                    Drag & drop your CV or tap to browse
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">
                    PDF only - Up to 2MB
                  </p>
                </div>

                <div className="mt-4 md:mt-6">
                  <span className="text-[#081f5c] font-bold text-base md:text-lg hover:underline decoration-2 underline-offset-4">
                    {formData.resume ? "Replace File" : "Choose File"}
                  </span>
                </div>
              </div>

              {formData.resume && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 bg-white border border-gray-200 rounded-2xl md:rounded-3xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#081f5c] rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                      <svg
                        className="w-6 h-6 md:w-7 md:h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-900 truncate text-sm md:text-base">
                        {formData.resume.name}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 font-medium">
                        {(
                          formData.resume.type.split("/")[1] || "PDF"
                        ).toUpperCase()}{" "}
                        - {formatFileSize(formData.resume.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 font-bold transition-colors p-2 hover:bg-red-50 rounded-xl text-sm md:text-base self-end md:self-auto"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onNext && onNext()}
              className="w-full md:w-auto bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 text-base font-semibold cursor-pointer rounded-[10px_20px_10px_20px]"
            >
              Continue to Review
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
