"use client";

import React from "react";
import { Button } from "@repo/ui/button";
import { Clock, Mail } from "lucide-react";

interface ResultsProps {
  data?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    skills?: string;
    professionalExperience?: string;
    portfolioUrl?: string;
    resume?: { name?: string } | null;
  };
}

export default function Results({ data }: ResultsProps) {
  const submissionDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-8 md:py-12 px-2 md:px-4">
      <div className="space-y-8 md:space-y-10">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Submission Confirmed
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Your hiring request has been logged successfully. An email
            confirmation will be sent after admin review as soon as possible.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-2 md:p-3 rounded-lg shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold">
                  Review Timeline
                </h4>
                <p className="text-xs md:text-sm text-gray-500">
                  Our team will carefully review your application{" "}
                  <span className="font-semibold italic text-[#081f5c]">
                    as soon as possible
                  </span>{" "}
                  and send a detailed response via email.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-2 md:p-3 rounded-lg shrink-0">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold">
                  Stay Updated
                </h4>
                <p className="text-xs md:text-sm text-gray-500">
                  Keep an eye on your inbox we&#39;ll send application status
                  updates and next steps to{" "}
                  <span className="font-semibold italic text-[#081f5c] break-all">
                    {data?.email || "the email you provided"}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="bg-white border border-[#081f5c] rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm">
          <div className="text-center mb-6 md:mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-[#081f5c]">
              Application Summary
            </h3>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Submitted on {submissionDate}
            </p>
          </div>

          <div className="space-y-6 md:space-y-10">
            {/* Personal Information */}
            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#081f5c] border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name
                  </p>
                  <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 text-sm md:text-base">
                    {data?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 text-sm md:text-base break-all">
                    {data?.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 text-sm md:text-base">
                    {data?.phone || "-"}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-6">
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Address
                </p>
                <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 text-sm md:text-base">
                  {data?.address || "-"}
                </p>
              </div>
            </section>

            {/* Professional Information */}
            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#081f5c] border-b pb-2">
                Professional Information
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Skills & Expertise
                    </p>
                    <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 text-sm md:text-base">
                      {data?.skills || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Portfolio URL
                    </p>
                    <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 text-sm md:text-base break-all">
                      {data?.portfolioUrl || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Professional Experience
                  </p>
                  <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 whitespace-pre-wrap text-sm md:text-base">
                    {data?.professionalExperience || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Resume/CV
                  </p>
                  <p className="text-gray-900 font-semibold mt-0.5 md:mt-1 italic text-sm md:text-base">
                    {data?.resume?.name || "No resume uploaded"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 flex justify-center md:justify-end">
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full md:w-auto bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 font-semibold rounded-[10px_20px_10px_20px] cursor-pointer"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
