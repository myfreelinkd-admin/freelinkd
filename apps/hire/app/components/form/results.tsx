"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@repo/ui/button";
import { jobApiService } from "@/app/api/services/jobService";

interface ReviewPageProps {
  data: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    skills: string;
    projectDescription: string;
    additionalRequirements: string;
    dueTime: string;
    deadlineDate: string;
    budgetFrom: string;
    budgetTo: string;
    uploadDocument: File | null;
    jobStatus: "general" | "assigned";
    selectedFreelancer?: {
      id: string;
      name: string;
      skills: string;
      matchPercentage: number;
    } | null;
  };
}

export default function ReviewPage({ data }: ReviewPageProps) {
  const [orderId, setOrderId] = useState("ORD-GENERATING...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (hasSubmittedRef.current) {
      return;
    }

    const submitToDatabase = async () => {
      hasSubmittedRef.current = true;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await jobApiService.createJob({
          name: data.name,
          email: data.email,
          phone: data.phone,
          jobTitle: data.jobTitle,
          skills: data.skills,
          projectDescription: data.projectDescription,
          additionalRequirements: data.additionalRequirements,
          dueTime: data.dueTime,
          deadlineDate: data.deadlineDate,
          budgetFrom: data.budgetFrom,
          budgetTo: data.budgetTo,
          uploadDocument: data.uploadDocument?.name || "",
          status: data.jobStatus,
          selectedFreelancer: data.selectedFreelancer || undefined,
        });

        if (response.success && response.data?.id) {
          setOrderId(`ORD-${response.data.id.substring(0, 8).toUpperCase()}`);
        } else {
          throw new Error("Failed to create job");
        }
      } catch (error) {
        console.error("Error submitting job:", error);
        setSubmitError(
          error instanceof Error ? error.message : "Failed to submit job"
        );
        const generatedId =
          "ORD-" + Math.random().toString(36).substring(2, 11).toUpperCase();
        setOrderId(generatedId);
      } finally {
        setIsSubmitting(false);
      }
    };

    submitToDatabase();
  }, []);

  const submissionDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-8 md:py-12 px-2 md:px-4">
      <div className="space-y-6 md:space-y-10">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {isSubmitting ? "Submitting..." : "Submission Confirmed"}
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            {isSubmitting
              ? "Please wait while we process your request..."
              : "Your hiring request has been logged successfully. An email confirmation will be sent after admin review (within 48 hours)."}
          </p>
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{submitError}</p>
              <p className="text-gray-500 text-xs mt-1">
                Don't worry, your form data is saved locally. Please try again
                later.
              </p>
            </div>
          )}
        </div>

        {/* Application Summary */}
        <div className="bg-white border border-[#081f5c] rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm">
          <div className="text-center mb-6 md:mb-8">
            <p className="text-sm font-medium text-gray-500">Order ID</p>
            <h2 className="text-xl md:text-2xl font-bold text-[#081f5c]">
              {orderId}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Submitted on {submissionDate}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-[#081f5c] border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name / Business
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base break-words">
                    {data.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base break-all">
                    {data.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base">
                    {data.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-[#081f5c] border-b pb-2">
                Project Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Job Title
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base">
                    {data.jobTitle}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Skills
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base">
                    {data.skills}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap text-sm md:text-base">
                    {data.projectDescription}
                  </p>
                </div>
                {data.additionalRequirements && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Additional Requirements
                    </p>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap text-sm md:text-base">
                      {data.additionalRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* More Details */}
            <div>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-[#081f5c] border-b pb-2">
                More Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Due Time & Deadline
                    </p>
                    <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base">
                      {data.dueTime} - {data.deadlineDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Budget Range
                    </p>
                    <p className="text-gray-900 font-semibold mt-1 text-sm md:text-base">
                      Rp {data.budgetFrom} - Rp {data.budgetTo}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Uploaded Documents
                  </p>
                  <p className="text-gray-900 mt-1 italic text-sm md:text-base break-all">
                    {data.uploadDocument
                      ? data.uploadDocument.name
                      : "No documents uploaded"}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Status & Freelancer Assignment */}
            <div
              className={`rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg ${
                data.jobStatus === "general"
                  ? "bg-blue-600 text-white"
                  : "bg-[#081f5c] text-white"
              }`}
            >
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 border-b border-white/20 pb-2">
                {data.jobStatus === "general"
                  ? "Job Status"
                  : "Selected Freelancer"}
              </h3>

              {data.jobStatus === "general" ? (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold">
                      Open to All Freelancers
                    </h4>
                    <p className="text-xs md:text-sm opacity-70 mt-1">
                      This job will be visible to all freelancers with matching
                      skills.
                    </p>
                    <p className="text-xs md:text-sm mt-2">
                      Required Skills: {data.skills || "Any"}
                    </p>
                  </div>
                  <div className="text-right self-end md:self-auto">
                    <div className="bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                      <p className="text-xs md:text-sm font-bold">Status</p>
                      <p className="text-lg md:text-xl font-black">GENERAL</p>
                    </div>
                  </div>
                </div>
              ) : data.selectedFreelancer ? (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold">
                      {data.selectedFreelancer.name}
                    </h4>
                    <p className="text-xs md:text-sm opacity-70">
                      ID: {data.selectedFreelancer.id}
                    </p>
                    <p className="text-xs md:text-sm mt-2">
                      Skills: {data.selectedFreelancer.skills}
                    </p>
                  </div>
                  <div className="text-right self-end md:self-auto">
                    <div className="bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                      <p className="text-xs md:text-sm font-bold">
                        Match Score
                      </p>
                      <p className="text-2xl md:text-3xl font-black">
                        {data.selectedFreelancer.matchPercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs md:text-sm opacity-70">
                    No freelancer selected yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 flex justify-center md:justify-end">
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full md:w-auto bg-[#ff6f00] hover:bg-[#e66400] text-white px-8 py-3 md:px-10 font-semibold rounded-[10px_20px_10px_20px] cursor-pointer"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
