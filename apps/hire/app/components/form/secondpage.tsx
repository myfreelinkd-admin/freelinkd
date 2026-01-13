"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { DatePicker } from "./ux/callendar";
import ReviewSection from "./reviewpage";
import PickFreelancer, { Freelancer } from "./pickfreelancer";
import { FormData } from "../../form/page";
import { sanitizeInput } from "../../utils/sanitize";

interface SecondPageProps {
  onBack?: () => void;
  onNext?: () => void;
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
}

export default function SecondPage({
  onBack,
  onNext,
  formData,
  updateFormData,
}: SecondPageProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: sanitizeInput(value) });
  };

  const handleDateChange = (date: string) => {
    updateFormData({ deadlineDate: date });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateFormData({ uploadDocument: file });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      updateFormData({ uploadDocument: file });
    }
  };

  const removeFile = () => {
    updateFormData({ uploadDocument: null });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFreelancerSelect = (freelancer: Freelancer) => {
    updateFormData({
      selectedFreelancer: {
        id: freelancer.id,
        name: freelancer.name,
        skills: freelancer.skills,
        matchPercentage: freelancer.matchPercentage,
      },
      jobStatus: "assigned",
    });
  };

  const handleModeChange = (mode: "match" | "random") => {
    if (mode === "random") {
      // When switching to "Open to All" mode, clear freelancer and set status to general
      updateFormData({
        jobStatus: "general",
        selectedFreelancer: null,
      });
    } else {
      // When switching to "Skill Match" mode, keep status as assigned (user will select)
      updateFormData({
        jobStatus: "assigned",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 md:py-12 px-2 md:px-4">
      {/* Header Text */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Review Your Project Details
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Please review your information before submitting your hiring request.
        </p>
      </div>

      {/* Review Section from Page 1 */}
      <ReviewSection data={formData} />

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
        {/* More Details Section */}
        <section>
          <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
            More Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Due Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
                  placeholder="e.g. 2 Weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Deadline Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={formData.deadlineDate}
                  onChange={handleDateChange}
                  placeholder="Select Deadline Date"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Budget Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="budgetFrom"
                  value={formData.budgetFrom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
                  placeholder="From (Rp)"
                />
                <input
                  type="number"
                  name="budgetTo"
                  value={formData.budgetTo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
                  placeholder="To (Rp)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-4">
                Upload Document (Optional)
              </label>
              <div className="space-y-4">
                {/* Upload Area */}
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
                    name="uploadDocument"
                    onChange={handleFileChange}
                    accept=".doc,.docx,.pdf,.xls,.xlsx,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="file-upload"
                  />

                  {/* Icon Container */}
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
                      PDF/Word/XLSX/PNG/JPG - Up to 2MB
                    </p>
                  </div>

                  <div className="mt-4 md:mt-6">
                    <span className="text-[#081f5c] font-bold text-base md:text-lg hover:underline decoration-2 underline-offset-4">
                      {formData.uploadDocument ? "Replace File" : "Choose File"}
                    </span>
                  </div>
                </div>

                {/* File Preview Card */}
                {formData.uploadDocument && (
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
                          {formData.uploadDocument.name}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 font-medium">
                          {formData.uploadDocument.type
                            .split("/")[1]
                            ?.toUpperCase() || "FILE"}{" "}
                          - {formatFileSize(formData.uploadDocument.size)}
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
          </div>
        </section>

        {/* Choose Freelancer Section */}
        <PickFreelancer
          onSelect={handleFreelancerSelect}
          onModeChange={handleModeChange}
          selectedId={formData.selectedFreelancer?.id}
          requiredSkills={formData.skills}
        />

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Button className="w-full md:w-auto bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 text-base font-semibold cursor-pointer rounded-xl md:rounded-[10px_20px_10px_20px]">
            Post Project
          </Button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-[#081f5c] font-bold hover:underline cursor-pointer text-sm md:text-base"
            >
              Back to Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
