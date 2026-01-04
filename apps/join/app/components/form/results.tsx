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
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Submission Confirmed
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your hiring request has been logged successfully. An email
            confirmation will be sent after admin review as soon as possible.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Review Timeline</h4>
                <p className="text-sm text-gray-500">
                  Our team will carefully review your application{" "}
                  <span className="font-semibold italic text-[#081f5c]">
                    as soon as possible
                  </span>{" "}
                  and send a detailed response via email.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Stay Updated</h4>
                <p className="text-sm text-gray-500">
                  Keep an eye on your inbox we&#39;ll send application status
                  updates and next steps to{" "}
                  <span className="font-semibold italic text-[#081f5c]">
                    {data?.email || "the email you provided"}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="bg-white border border-[#081f5c] rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-[#081f5c]">
              Application Summary
            </h3>
            <p className="text-gray-500 mt-1">Submitted on {submissionDate}</p>
          </div>

          <div className="space-y-10">
            {/* Personal Information */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-[#081f5c] border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {data?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {data?.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {data?.phone || "-"}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Address
                </p>
                <p className="text-gray-900 font-semibold mt-1">
                  {data?.address || "-"}
                </p>
              </div>
            </section>

            {/* Professional Information */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-[#081f5c] border-b pb-2">
                Professional Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Skills & Expertise
                    </p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {data?.skills || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Portfolio URL
                    </p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {data?.portfolioUrl || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Professional Experience
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 whitespace-pre-wrap">
                    {data?.professionalExperience || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Resume/CV
                  </p>
                  <p className="text-gray-900 font-semibold mt-1 italic">
                    {data?.resume?.name || "No resume uploaded"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 font-semibold rounded-[10px_20px_10px_20px] cursor-pointer"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
