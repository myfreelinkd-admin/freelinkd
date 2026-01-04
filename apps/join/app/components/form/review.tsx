"use client";

import React from "react";
import { Button } from "@repo/ui/button";

interface ReviewData {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
  resume?: { name?: string } | null;
}

interface ReviewProps {
  data?: ReviewData;
  onEdit?: (section: "personal" | "project" | "professional") => void;
  onSubmit?: () => void;
}

export default function Review({ data, onEdit, onSubmit }: ReviewProps) {
  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="space-y-10">
        {/* Header like secondpage */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Review Your Project Details
          </h2>
          <p className="text-gray-600">
            Please review your information before submitting your hiring
            request.
          </p>
        </div>

        {/* Personal Information Review */}
        <section>
          <h3 className="text-xl font-bold text-center mb-6">
            Personal Information
          </h3>
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white border border-[#081f5c] rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-500">
                    Name or Business Name
                  </p>
                  <p className="text-gray-900 font-medium">
                    {data.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Address</p>
                  <p className="text-gray-900 font-medium">
                    {data.address || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">
                    {data.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium">
                    {data.phone || "-"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onEdit?.("personal")}
                  className="text-[#081f5c] font-bold hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Information Review */}
        <section>
          <h3 className="text-xl font-bold text-center mb-6">
            Professional Information
          </h3>
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white border border-[#081f5c] rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Skills & Expertise
                </p>
                <p className="text-gray-900 font-medium">
                  {data.skills || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Professional Experience
                </p>
                <p className="text-gray-900 font-medium whitespace-pre-wrap">
                  {data.professionalExperience || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Portfolio / Website
                </p>
                <p className="text-gray-900 font-medium">
                  {data.portfolioUrl || "-"}
                </p>
              </div>
              {data.resume && (
                <div>
                  <p className="text-sm font-bold text-gray-500">Uploaded CV</p>
                  <p className="text-gray-900 font-medium">
                    {data.resume.name}
                  </p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onEdit?.("professional")}
                  className="text-[#081f5c] font-bold hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Button
            onClick={() => onSubmit?.()}
            className="bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 text-base font-semibold cursor-pointer"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}
